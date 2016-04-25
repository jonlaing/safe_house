'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  View,
  Text
} from 'react-native';

import Api from './Api';
import MatchRow from './MatchRow';
import NavBarMain from './NavBarMain';

export default class MatchesScreen extends Component {
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { matches: [], ds: ds.cloneWithRows([]) };
  }

  componentDidMount() {
    Api.matches(this.props.token).list(0)
    .then(res => this.setState({matches: res.users, ds: this.state.ds.cloneWithRows(res.users)}))
    .catch(err => console.log("err:", err));
  }

  _renderRow(match) {
    console.log(match.capacity);
    return (
      <MatchRow
        userID={match.id}
        username={match.username}
        capacity={match.capacity}
        distance={match.distance}
        duration={match.duration}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.ds}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
        <NavBarMain />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72
  }
});

module.exports = MatchesScreen;
