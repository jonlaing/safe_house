'use strict';

import React, {
  Component,
  View
} from 'react-native';

import Messager from './Messager';
import Api from './Api';

import I18n from './i18n';
import IconButton from './IconButton';

export default class MessageUserButton extends Component {
  constructor(props) {
    super(props);
    this.api = new Api(this.props.navigator.props.eventEmitter);
    this.messager = new Messager();

    this.state = { status: 0, threadUserID: 0, threadID: 0, statusChangedBy: 0 };
  }

  componentDidMount() {
    this.messager.getKeys().catch(err => console.log(err));
    this._fetchStatus();
  }

  _fetchStatus() {
    this.api.messages(this.props.token).thread(this.props.userID)
    .then(res => this.setState({
      status: res.message_thread.status,
      threadID: res.message_thread.id,
      threadUserID: res.message_thread.user_id
    }))
    .then(() => console.log(this.state.status, this.state.threadID, this.state.threadUserID))
    .catch(err => console.log(err)); // the thread probably just doesn't exist...
  }

  _handleSubmit() {
    switch(this.state.status) {
            case 0:
                    this.api.messages(this.props.token).request(this.props.userID, this.messager.publicKey())
                    .then(res => { console.log(res); this.setState({status: res.status, threadID: res.id, threadUserID: res.user_id}); })
                    .catch(err => console.log(err));
                    break;
            case 1:
                    // if we're looking at the user who started the chat
                    // then we can accept the request
                    if(this.state.threadUserID === this.props.userID) {
                      this.api.messages(this.props.token).accept(this.props.threadID, this.messager.publicKey())
                      .then(res => this.setState({status: res.status, threadID: res.id, threadUserID: res.user_id}))
                      .then(() => this.props.navigator.pop())
                      .then(() => this.props.navigator.props.eventEmitter.emit('chat-accept'))
                      .catch(err => console.log(err));
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
                        primary={false}
                        large={true}
                        onPress={this._handleSubmit.bind(this)} />
                    );
            case 3:
                    if(this.state.threadUserID === this.props.userID && this.state.statusChangedBy === 2) {
                      return (
                        <IconButton
                          name="check-circle"
                          label={I18n.t('pubKeyAccept')}
                          primary={true}
                          large={true}
                          onPress={this._handleSubmit.bind(this)} />
                      );
                    }

                    return (
                      <IconButton
                        name="schedule"
                        label={I18n.t('pubKeyWaiting')}
                        primary={false}
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
  userID: React.PropTypes.number.isRequired,
  threadID: React.PropTypes.number
};

module.exports = MessageUserButton;
