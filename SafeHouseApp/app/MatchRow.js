'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from './Colors';
import formatter from './formatter';

export default class MatchRow extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.matchData}>
            <View style={styles.userData}>
              <Icon name="home" size={24} color="grey" />
              <Text style={styles.username}>{this.props.username}</Text>
            </View>
            <View style={styles.matchMeta}>
              <View style={styles.matchMetaItem}>
                <Icon style={styles.matchMetaIcon} name="schedule" size={18} color="grey" />
                <Text style={styles.matchMetaText}>{formatter.duration(this.props.duration)}</Text>
              </View>
              <View style={styles.matchMetaItem}>
                <Icon style={styles.matchMetaIcon} name="people" size={18} color="grey" />
                <Text style={styles.matchMetaText}>{formatter.capacity(this.props.capacity)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.distanceContainer}>
            <View style={styles.distance}>
              <Text style={styles.distanceText}>{formatter.distance(this.props.distance)}</Text>
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
  username: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func
};

MatchRow.defaultProps = {
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
