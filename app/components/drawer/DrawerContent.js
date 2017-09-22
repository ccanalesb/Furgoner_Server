import React from 'react';

import { StyleSheet, Text, View, ViewPropTypes,
  Dimensions,
  ScrollView,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../../services/firebase.js'

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
class DrawerContent extends React.Component {

  logOut(){
    console.log("Cerrando sesión")
    firebaseRef.auth().signOut()
    .then(() => {
      Actions.login()
    }, function(error) {
      alert("No se pudo cerrar sesión")
    });
  }
  render() {
    return (
      <View style={styles.drawer}>
        <TouchableNativeFeedback style={styles.header} >
          <View>
            <Image
              style={styles.headerIcon}
              source={{ uri }}
            />
            <Text style={styles.headerTitle}>Your name</Text>
          </View>
        </TouchableNativeFeedback>
        <ScrollView scrollsToTop={false} style={styles.content}>
          <TouchableOpacity style={styles.listItem} onPress={() => console.log("about")}>
            <Text
              
              style= {styles.listItemTitle}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => console.log("contact")}>
            <Text
              
              style= {styles.listItemTitle}
            >
              Contacts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => this.logOut()}>
            <Text
              
              style= {styles.listItemTitle}
            >
              Salir
            </Text>
          </TouchableOpacity>
      </ScrollView>
    </View>
    );
  }
}
const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#f1c40f'
  },
  header: {
    height: '20%',
    flex: 1,
    backgroundColor: '#f1c40f',
    
  },
  content: {
    flex: 3,
    padding: 16,
    backgroundColor: 'white'
  },
  headerInfo: {
    height: 56
  },
  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 45,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1c40f',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10
  },
  headerTitle: {
    color: 'black',
    fontSize: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10
  },
  headerEmail: {
    color: '#fff',
    fontSize: 16
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 40,
    marginBottom: 2
  },
  listItemTitle: {
    fontSize: 18,
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 7,
    marginRight: 10,
  }
});

export default DrawerContent;
