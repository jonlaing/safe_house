'use strict';

import React, {
  Component,
  ActivityIndicatorIOS,
  StyleSheet,
  ListView,
  View,
  Text
} from 'react-native';

import Router from './Router';
import I18n from './i18n';

import NavBarMain from './NavBarMain';
import ThreadRow from './ThreadRow';

export default class ThreadList extends Component {
  constructor(props) {
    super(props);

    this.api = this.props.navigator.props.api;
    this.messager = this.props.navigator.props.messager;

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { threads: [], ds: ds.cloneWithRows([]), page: 0, refreshing: false, fetched: false };
  }

  componentDidMount() {
    this._getThreads();
    this.props.navigator.props.eventEmitter.addListener('chat-accept', this._getThreads.bind(this));
  }

  _getThreads() {
    this.api.messages(this.props.token).threads()
    .then(res => this.setState({threads: res.message_threads, ds: this.state.ds.cloneWithRows(res.message_threads), fetched: true}))
    .catch(err => console.log(err));
  }

  _renderRow(thread) {
    if(thread.user === undefined) {
      return <View />;
    }

    let lastMessage;

    if(thread.last_message.is_me === true) {
      lastMessage = thread.last_message.sender_copy_message;
    } else {
      lastMessage = thread.last_message.encrypted_message;
    }

    return <ThreadRow
      id={thread.id}
      threadCreatorID={thread.user_id}
      userID={thread.user.id}
      username={thread.user.username}
      status={thread.status}
      lastMessage={lastMessage}
      updatedAt={thread.last_message.created_at}
      onPress={this.handlePress(thread.status, thread.id, thread.user.id).bind(this)}
      messager={this.messager}
    />;
  }

  handlePress(status, threadID, userID) {
    return () => {
      if(status === 2) {
        this.props.navigator.push(Router.chatScreen(threadID, this.props.token));
      } else {
        this.props.navigator.push(Router.matchScreen(userID, this.props.token, threadID));
      }
    };
  }

  _nothing() {
    if(this.state.fetched === true && this.state.threads.length < 1) {
      if(this.props.navigator.props.userType === 2) {
        return <Text style={styles.nothing}>{I18n.t('noContact')}</Text>;
      } else {
        return <Text style={styles.nothing}>{I18n.t('noMessages')}</Text>;
      }
    }

    return <View/>;
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
        />
        <NavBarMain
          userType={this.props.navigator.props.userType}
          leftButtonPress={() => this.props.navigator.replace(Router.matchList(this.props.token)) }
          rightButtonPress={() => this.props.navigator.replace(Router.settingsScreen(this.props.token)) }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 80
  },
  nothing: {
    flex: 1,
    textAlign: 'center',
    color: 'grey'
  }
});

module.exports = ThreadList;
