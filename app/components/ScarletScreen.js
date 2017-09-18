import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements'

export default class ScarletScreen extends Component {
    constructor () {
      super()
      this.state = {
        isOpen: false,
        
      }
      this.toggleSideMenu = this.toggleSideMenu.bind(this)
    }
    
    onSideMenuChange (isOpen: boolean) {
      this.setState({
        isOpen: isOpen
      })
    }
    
    toggleSideMenu () {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
    render(){
      const MenuComponent = (
        <View style={{flex: 1, backgroundColor: '#ededed', paddingTop: 50}}>
          <List containerStyle={{marginBottom: 20}}>
          {
            
              <ListItem
                roundAvatar
                onPress={() => console.log('Pressed')}
                avatar="url"
                key={ 1 }
                title="nombre"
                subtitle="subtitulo"
              />
            
          }
          </List>
        </View>
      )
        return (
          <SideMenu
          isOpen={this.state.isOpen}
          onChange={this.onSideMenuChange.bind(this)}
          menu={MenuComponent}>  
          <View style={styles.container}>
              <Text style={styles.welcome}>
                  Scarlet Screen
              </Text>
          </View>
        </SideMenu>
        );    
    }
}    

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bb0000',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
});