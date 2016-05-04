'use strict';

import React, {
  Component,
  StyleSheet,
  ScrollView,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import I18n from './i18n';
import Api from './Api';
import Colors from './Colors';
import formatter from './formatter';

import NavBar from './NavBar';
import MessageUserButton from './MessageUserButton';

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { user: {} };
  }

  _handleSubmit() {
    return;
  }

  componentDidMount() {
    Api.matches(this.props.token).get(this.props.userID)
    .then(res => this.setState({user: res}))
    .catch(err => console.log("err:", err));
  }

  render() {
    if(this.state.user === {}) {
      return <View/>; // TODO: make better loader
    }

    let button;

    if(this.state.user.id !== undefined) {
      button = <MessageUserButton token={this.props.token} userID={this.state.user.id} threadID={this.props.threadID} />;
    } else {
      button = <View />;
    }

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.metaData}>
            <View style={styles.distanceContainer}>
              <View style={styles.distanceInner}>
                <Text style={styles.distanceText}>{formatter.distance(this.state.user.distance)}</Text>
                <Text style={styles.distanceUnit}>km</Text>
              </View>
            </View>
            <View style={styles.metaInner}>
              <View style={styles.matchMetaItem}>
                <Icon style={styles.matchMetaIcon} name="schedule" size={18} color="grey" />
                <Text style={styles.matchMetaText}>{formatter.duration(this.state.user.duration)}</Text>
              </View>
              <View style={styles.matchMetaItem}>
                <Icon style={styles.matchMetaIcon} name="people" size={18} color="grey" />
                <Text style={styles.matchMetaText}>{formatter.capacity(this.state.user.capacity)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.profile}>
            <Text style={styles.profileHeader}>{I18n.t('about')}:</Text>
            <Text>{this.state.user.profile}</Text>
          </View>
        </ScrollView>
        <View style={styles.action}>
          {button}
        </View>
        <NavBar
          title={this.state.user.username}
          leftButton={<Icon name="chevron-left" size={32} color={Colors.action} />}
          leftButtonPress={() => this.props.navigator.pop()}
        />
      </View>
    );
  }
}

MatchScreen.propTypes = {
  userID: React.PropTypes.number.isRequired,
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 72,
    backgroundColor: Colors.lighterGrey
  },
  scroll: {
    padding: 16
  },
  metaData: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 32
  },
  metaInner: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  matchMetaItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
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
    width: 100,
    marginRight: 32
  },
  distanceInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  distanceText: {
    fontSize: 48,
    color: 'grey'
  },
  distanceUnit: {
    marginLeft: 8,
    fontSize: 16,
    color: 'grey'
  },
  profileHeader: {
    fontWeight: 'bold',
    color: 'lightgrey',
    marginBottom: 16
  },
  profile: {
    marginVertical: 32,
    padding: 16,
    backgroundColor: 'white'
  },
  action: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  }
});

module.exports = MatchScreen;
