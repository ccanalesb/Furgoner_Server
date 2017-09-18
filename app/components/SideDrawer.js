import React, { Component } from 'react';
import Drawer from 'react-native-drawer';
import {
    Text,
    View
  } from 'react-native';

export default class SideDrawer extends Component {

    render () {
        const state = this.props.navigationState
        // const children = state.children

        return (
            <Drawer
        type="overlay"
        content={<ControlPanel />}
        tapToClose={true}
        openDrawerOffset={0.2} 
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={{ drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
            main: {paddingLeft: 3} }}
        tweenHandler={(ratio) => ({ main: { opacity: (2 - ratio) / 2 } })}
      >
        {React.Children.map(this.props.children, c => React.cloneElement(c, {
          route: this.props.route
        }))}
      </Drawer>
        )
      }
}

export class ControlPanel extends Component {
    render(){
        return (
            <View>
            </View>
        );
    }
}
