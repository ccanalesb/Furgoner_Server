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
import Login from 'react-native-simple-login'
import InputScreen from './components/InputScreen'
import ScarletScreen  from './components/ScarletScreen'
import LoginWrapper  from './components/Login/LoginWrapper'
import SideDrawer  from './components/SideDrawer'
import DrawerContent from './components/drawer/DrawerContent';
import ShowMap  from './components/ShowMap'
import NewAccount from './components/Login/NewAccount'

export default class FurgonerServer extends Component {
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
                initial
              />
              <Scene
                key="test"
                component={InputScreen}
                title="Gray"
              />
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