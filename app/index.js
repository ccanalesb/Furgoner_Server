import React, { Component } from 'react';

import { Router, Scene } from 'react-native-router-flux';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { DatePicker, List, InputItem } from 'antd-mobile';
import { Button } from 'antd-mobile';
import { NavBar, Icon } from 'antd-mobile';

import { Actions, Stack, Drawer } from 'react-native-router-flux';
import InputScreen from './components/InputScreen'
import ScarletScreen  from './components/ScarletScreen'
import LoginWrapper  from './components/Login/LoginWrapper'
import SideDrawer  from './components/SideDrawer'
import DrawerContent from './components/drawer/DrawerContent';
import ShowMap  from './components/ShowMap'
import NewAccount from './components/Login/NewAccount'
import AttorneysTabs from './components/AttorneysTabs'
// import NotificationView from './components/notifications/NotificationView'
import Attorneys from './components/Attorneys'
import { firebaseRef } from './services/firebase.js'

export default class FurgonerServer extends Component {
  componentWillMount(){
    console.log("revisando si tenía sesión")
    firebaseRef.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("ya estaba conectado")
            console.log(user.email)
            Actions.main()
            
          // User is signed in.
        } else {
            console.log("no estaba conectado")
          // No user is signed in.
        }
    });
  }
  render(){
    return (
      <Router navigationBarStyle={styles.navBar} titleStyle={styles.navBarTitle}>
       
        <Stack key="root">
          <Scene key="login"
                  component={LoginWrapper}
                  title="Login"
                  initial
                  hideNavBar
          />
          <Scene
            key="newAccount"
            component = {NewAccount}
            title="Crea tu cuenta"
            
          />
          <Scene key="main">
            <Drawer
              hideNavBar   
              key="drawer"
              contentComponent={DrawerContent}
              drawerImage={ require('../images/menu_burger2.png') }       
            >   
              <Scene
                key="home"
                component={ShowMap}
                title="Proximos destinos"
                
              />
              <Scene
                key="attorneys"
                component={AttorneysTabs}
                title="Apoderados"
                initial
              />
              {/* <Scene
                key="notification"
                component={NotificationView}
                title="Notifficacioens"
                
              /> */}

            </Drawer>  
          </Scene>
        </Stack>
         
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor:'#f1c40f',
  },
  navBarTitle:{
      color:'#FFFFFF'
  },
  barButtonTextStyle:{
      color:'#FFFFFF'
  },
  barButtonIconStyle:{
      tintColor:'rgb(255,255,255)'
  },
})