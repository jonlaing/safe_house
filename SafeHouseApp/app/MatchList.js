'use strict';

import React, {
  Component,
  ActivityIndicatorIOS,
  StyleSheet,
  ListView,
  RefreshControl,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import I18n from './i18n';
import Router from './Router';

import MatchRow from './MatchRow';
import NavBarMain from './NavBarMain';

export default class MatchList extends Component {
  constructor(props) {
    super(props);

    this.api = this.props.navigator.props.api;

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { matches: [], ds: ds.cloneWithRows([]), page: 0, refreshing: false, fetched: false };
  }

  componentDidMount() {
    this._getMatches(true).then(() => this.setState({fetched: true}));
  }

  _getMatches(refresh = false) {
    let page = refresh ? this.state.page : this.state.page + 1;

    return this.api.matches(this.props.token).list(page, 100)
    .then(res => refresh ? res.users : this.state.matches.concat(res.users))
    .then(matches => this.setState({matches: matches, ds: this.state.ds.cloneWithRows(matches)}))
    .then(() => refresh ? {} : this.setState({page: page}))
    .catch(err => console.log(err));
  }

  _refresh() {
    this.setState({refreshing: true});
    this._getMatches(true).then(() => this.setState({refreshing: false}));
  }

  _renderRow(match) {
    return (
      <MatchRow
        userID={match.id}
        username={match.username}
        capacity={match.capacity}
        distance={match.distance}
        duration={match.duration}
        onPress={() => this.props.navigator.push(Router.matchScreen(match.id, this.props.token))}
      />
    );
  }

  _nothing() {
    if(!this.state.fetched || this.state.matches.length > 0) {
      return <View />;
    }

    return (
      <View style={{padding: 16}}>
        <Text style={{textAlign: 'center'}}>{I18n.t('nothing')}</Text>
      </View>
    );
  }

  _loading() {
    if(!this.state.fetched) {
      return <ActivityIndicatorIOS style={{flex: 1}} animating={true} size="large" />;
    }

    return <View/>;
  }

  render() {
    return (
      <View style={styles.container}>
        {this._nothing()}
        {this._loading()}
        <ListView
          dataSource={this.state.ds}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          onEndReached={() => this._getMatches()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refresh.bind(this)}
            />
          }
        />
        <NavBarMain
          userType={this.props.navigator.props.userType}
          middleButtonPress={() => this.props.navigator.replace(Router.threadList(this.props.token)) }
          rightButtonPress={() => this.props.navigator.replace(Router.settingsScreen(this.props.token)) }
        />
      </View>
    );
  }
}

MatchList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72
  }
});

module.exports = MatchList;
