'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import I18n from './i18n';
import Colors from './Colors';

export default class MatchRow extends Component {
  _capacity() {
    if(this.props.capacity === 1) {
      return `1 ${I18n.t('person')}`;
    }

    return `${this.props.capacity} ${I18n.t('people')}`;
  }

  _duration() {
    switch(this.props.duration) {
      case 2:
        return I18n.t('mediumTerm');
      case 3:
        return I18n.t('longTerm');
      default:
        return I18n.t('shortTerm');
    }
  }

  render() {
    return (
      <TouchableHighlight>
        <View style={styles.container}>
          <View style={styles.matchData}>
            <View style={styles.userData}>
              <Icon name="home" size={24} color="grey" />
              <Text style={styles.username}>{this.props.username}</Text>
            </View>
            <View style={styles.matchMeta}>
              <View style={styles.matchMetaItem}>
                <Icon style={styles.matchMetaIcon} name="schedule" size={18} color="grey" />
                <Text style={styles.matchMetaText}>{this._duration()}</Text>
              </View>
              <View style={styles.matchMetaItem}>
                <Icon style={styles.matchMetaIcon} name="people" size={18} color="grey" />
                <Text style={styles.matchMetaText}>{this._capacity()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.distanceContainer}>
            <View style={styles.distance}>
              <Text style={styles.distanceText}>{Math.round(this.props.distance * 10) / 10}</Text>
              <Text style={styles.distanceUnit}>km</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

MatchRow.propTypes = {
  capacity: React.PropTypes.number.isRequired,
  distance: React.PropTypes.number.isRequired,
  duration: React.PropTypes.number.isRequired,
  userID: React.PropTypes.number.isRequired,
  username: React.PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  matchData: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  userData: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    flex: 1,
    marginLeft: 8,
    fontSize: 24,
    color: Colors.action
  },
  matchMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  matchMetaItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130
  },
  matchMetaIcon: {
    width: 18,
    height: 18,
    marginRight: 6
  },
  matchMetaText: {
    flex: 1,
    color: 'grey'
  },
  distanceContainer: {
    width: 100
  },
  distance: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'lightgrey'
  },
  distanceText: {
    fontSize: 32,
    color: 'grey'
  },
  distanceUnit: {
    marginLeft: 8,
    color: 'grey'
  }
});

module.exports = MatchRow;
