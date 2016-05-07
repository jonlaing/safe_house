'use strict';

import React, {
  Component,
  StyleSheet,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Chat from 'react-native-gifted-messenger';

import Colors from './Colors';

import NavBar from './NavBar';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);

    this.messager = this.props.navigator.props.messager;
    this.api = this.props.navigator.props.api;

    this.state = { username: '', messages: [], pubKey: null };
  }

  componentDidMount() {
    this.api.messages(this.props.token).list(this.props.threadID)
    .then(res => this.setState({
      username: res.message_thread.user.username,
      messages: this.parseMessages(res.messages),
      pubKey: res.message_thread.user.public_key
    }))
    .then(() => this.messager.setTheirKey(this.state.pubKey))
    .catch(err => console.log(err));
    this.openSocket();
  }

  openSocket() {
     this.api.messages(this.props.token).socket(this.props.threadID,
        function (res) {
          let data = JSON.parse(res.data);
          let msgs = this.parseMessages(data.messages);
          if(msgs.length > 0) {
            this.setState({messages: this.state.messages.concat(msgs)});
          }
        }.bind(this),
        (err) => console.log("err:", err));
  }

  handleSend(message) {
    this.api.messages(this.props.token).send(this.props.threadID, message.text, this.messager)
    .then(res => console.log(res))
    .catch(err => console.log('err', err));
  }

  parseMessages(messages) {
    return messages.reverse().map((message) => {
      let cipher = message.is_me ? message.sender_copy_message : message.encrypted_message;

      try {
        return {
          uniqueId: message.id,
          text: this.messager.decrypt(cipher),
          position: message.is_me ? 'right' : 'left', // left for received messages, right for sent messages, center for server messages
          date: message.created_at
        };
      } catch(e) {
        console.log(e);
      }
    });
  }

  render() {
    return (
      <View>
        <Chat
          styles={styles}
          messages={this.state.messages}
          handleSend={this.handleSend.bind(this)}
          ref="chat"
        />
        <NavBar
          title={this.state.username}
          leftButton={<Icon name="chevron-left" size={32} color={Colors.action} />}
          leftButtonPress={() => this.props.navigator.pop()}
          rightButton={<Icon name="more-vert" size={32} color={Colors.action} />}
          rightButtonPress={() => this.props.navigator.pop()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    paddingTop: 72
  },
  bubbleRight: {
    marginLeft: 70,
    backgroundColor: Colors.action,
    alignSelf: 'flex-end'
  },
  sendButton: {
    marginTop: 11,
    marginLeft: 10,
    color: Colors.action
  }
});

module.exports = ChatScreen;
