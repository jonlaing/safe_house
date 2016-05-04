'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import Colors from './Colors';
import I18n from './i18n';

export default class ThreadRow extends Component {
  _renderStatus() {
    switch(this.props.status) {
            case 1:
                    // this user can accept the conversation
                    if(this.props.threadCreatorID === this.props.userID) {
                      return <Icon name="feedback" size={32} color="orange" />;
                    }

                    return <Icon name="schedule" size={32} color="orange" />;
            case 2:
                    return <Icon name="check-circle" size={32} color={Colors.action} />;
            default:
                    return <View />;
    }
  }

  _updatedAt() {
    let updatedAt = moment(this.props.updatedAt);

    // if there is no last message, then the date is zeroed out;
    // return a blank updatedAt
    if(updatedAt.isSameOrBefore(new Date('0001'), 'year')) {
      return "";
    }

    return updatedAt.fromNow();
  }

  _lastMessage() {
    switch(this.props.status) {
            case 1:
                    // this user can accept the conversation
                    if(this.props.threadCreatorID === this.props.userID) {
                      return I18n.t('accept');
                    }

                    return I18n.t('waiting');
            default:
                    return this.props.lastMessage;
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            {this._renderStatus()}
          </View>
          <View style={{flex: 1, overflow: 'hidden'}}>
            <Text style={styles.username}>{this.props.username}</Text>
            <Text style={styles.lastMessage}>{this._lastMessage()}</Text>
          </View>
          <Text style={styles.updatedAt}>{this._updatedAt()}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

ThreadRow.propTypes = {
  id: React.PropTypes.number.isRequired,
  threadCreatorID: React.PropTypes.number.isRequired,
  userID: React.PropTypes.number.isRequired,
  username: React.PropTypes.string.isRequired,
  status: React.PropTypes.number.isRequired,
  lastMessage: React.PropTypes.string,
  onPress: React.PropTypes.func
};

ThreadRow.defaultProps = {
  lastMessage: "",
  onPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lighterGrey
  },
  iconContainer: {
    marginRight: 16
  },
  username: {
    fontSize: 16
  },
  updatedAt: {
    flex: 1,
    textAlign: 'right',
    color: 'grey'
  },
  lastMessage: {
    marginTop: 12,
    fontSize: 12,
    color: 'grey'
  }
});

module.exports = ThreadRow;
