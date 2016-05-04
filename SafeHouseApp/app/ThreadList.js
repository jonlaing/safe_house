'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  View,
  Text
} from 'react-native';

import Api from './Api';
import Router from './Router';

import NavBarMain from './NavBarMain';
import ThreadRow from './ThreadRow';

export default class ThreadList extends Component {
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { threads: [], ds: ds.cloneWithRows([]), page: 0, refreshing: false, fetched: false };
  }

  componentDidMount() {
    this._getThreads();
  }

  _getThreads() {
    Api.messages(this.props.token).threads()
    .then(res => this.setState({threads: res.message_threads, ds: this.state.ds.cloneWithRows(res.message_threads)}))
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

  render() {
    return (
      <View style={styles.container}>
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
  }
});

module.exports = ThreadList;
