'use strict';

import React, {
  Component,
  AsyncStorage,
  View
} from 'react-native';

import Messager from './Messager';
import Api from './Api';

import I18n from './i18n';
import IconButton from './IconButton';

export default class MessageUserButton extends Component {
  constructor(props) {
    super(props);

    this.state = { status: 0, threadUserID: 0 };
  }

  componentDidMount() {
    AsyncStorage.getItem('username')
    .then(un => this.messager = new Messager(un))
    .catch(err => console.log(err));
  }

  _fetchStatus() {
    Api.messages(this.props.token).get(this.props.userID)
    .then(res => this.setState({
      status: res.message_thread.status,
      threadID: res.message_thread.id,
      threadUserID: res.message_thread.user_id
    }))
    .then(() => console.log(this.state.status, this.state.threadID, this.state.threadUserID))
    .catch(err => console.log(err));
  }

  _handleSubmit() {
    switch(this.state.status) {
            case 0:
                    Api.messages(this.props.token).request(this.props.userID, this.messager)
                    .then(res => this.setState({status: res.status, threadID: res.id, threadUserID: res.user_id}));
                    break;
            case 1:
                    // if we're looking at the user who started the chat
                    // then we can accept the request
                    if(this.state.threadUserID === this.props.userID) {
                      Api.messages(this.props.token).accept(this.messager)
                      .then(res => this.setState({status: res.status, threadID: res.id, threadUserID: res.user_id}));
                    }
                    break;
            default:
                    console.log("Couldn't submit, bad status");
                    break;
    }
  }

  render() {
    switch(this.state.status) {
            case 0:
                    return (
                      <IconButton
                        name="speaker-notes"
                        label={I18n.t('message')}
                        primary={true}
                        large={true}
                        onPress={this._handleSubmit.bind(this)} />
                    );
            case 1:
                    if(this.state.threadUserID === this.props.userID) {
                      return (
                        <IconButton
                          name="check-circle"
                          label={I18n.t('accept')}
                          primary={true}
                          large={true}
                          onPress={this._handleSubmit.bind(this)} />
                      );
                    }

                    return (
                      <IconButton
                        name="schedule"
                        label={I18n.t('waiting')}
                        primary={true}
                        large={true}
                        onPress={this._handleSubmit.bind(this)} />
                    );
            default:
                    return <View />;
    }
  }
}

MessageUserButton.propTypes = {
  token: React.PropTypes.string.isRequired,
  userID: React.PropTypes.number.isRequired
};

module.exports = MessageUserButton;
