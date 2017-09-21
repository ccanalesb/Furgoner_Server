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

export default class FurgonerServer extends Component {
  render(){
    return (
      <Router>
       
        <Stack key="root">
          <Scene key="login"
                  component={LoginWrapper}
                  title="Login"
                  initial
                  hideNavBar
          />
          <Scene key="main">
            <Drawer
              hideNavBar   
              key="drawer"
              contentComponent={DrawerContent}
              drawerImage={ require('../images/menu_burger.png') }       
            >   
              <Scene
                key="home"
                component={ShowMap}
                title="Inicio"
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