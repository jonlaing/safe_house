'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Colors from './Colors';

export default class MatchRow extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.matchData}>
          <Text style={styles.username}>{this.props.username}</Text>
          <View style={styles.matchMeta}>
            <View style={styles.matchMetaItem}>
              <Text>{this.props.capacity}</Text>
            </View>
            <View style={styles.matchMetaItem}>
              <Text>{this.props.duration}</Text>
            </View>
          </View>
        </View>
        <View style={styles.distanceContainer}>
          <View style={styles.distance}>
            <Text style={styles.distanceText}>{this.props.distance}</Text>
            <Text style={styles.distanceUnit}>km</Text>
          </View>
        </View>
      </View>
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
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey'
  },
  matchData: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  username: {
    flex: 1,
    fontSize: 24,
    color: Colors.action
  },
  matchMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  matchMetaItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  distanceContainer: {
    width: 100
  },
  distance: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  distanceText: {
    fontSize: 32,
    color: 'grey'
  },
  distanceUnit: {
    color: 'grey'
  }
});

module.exports = MatchRow;
