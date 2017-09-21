import React from 'react';

import { StyleSheet, Text, View, ViewPropTypes,
  Dimensions,
  ScrollView,
  Image } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
  },
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
});

class DrawerContent extends React.Component {


  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{ uri }}
        />
        <Text style={styles.name}>Your name</Text>
      </View>

      <Text
        onPress={() => onItemSelected('About')}
        style={styles.item}
      >
        About
      </Text>

      <Text
        onPress={() => onItemSelected('Contacts')}
        style={styles.item}
      >
        Contacts
      </Text>
    </ScrollView>
/*       <View style={styles.container}>
        <Text>Drawer Content</Text>
        <Button onPress={Actions.closeDrawer}>Back</Button>
        <Text>Title: {this.props.title}</Text>
        {this.props.name === 'tab1_1' &&
          <Button onPress={Actions.tab_1_2}>next screen for tab1_1</Button>
        }
        {this.props.name === 'tab2_1' &&
          <Button onPress={Actions.tab_2_2}>next screen for tab2_1</Button>
        }
        <Button onPress={Actions.pop}>Back</Button>
        <Button onPress={Actions.tab_1}>Switch to tab1</Button>
        <Button onPress={Actions.tab_2}>Switch to tab2</Button>
        <Button onPress={Actions.tab_3}>Switch to tab3</Button>
        <Button onPress={Actions.tab_4}>Switch to tab4</Button>
        <Button onPress={() => { Actions.tab_5({ data: 'test!' }); }}>Switch to tab5 with data</Button>
        <Button onPress={Actions.echo}>Push Clone Scene (EchoView)</Button>
      </View > */
    );
  }
}

export default DrawerContent;
