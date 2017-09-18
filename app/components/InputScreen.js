import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
// import Tabs from 'react-native-tabs';
import { Button } from 'antd-mobile';
import { NavBar, Icon } from 'antd-mobile';
import { DatePicker, List, InputItem } from 'antd-mobile';

export default class InputScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          page: 'first'
        };
    }
    callback(key) {
        console.log('onChange', key);
    }
    handleTabClick(key) {
        console.log('onTabClick', key);
    }
    superclick(){
        console.log("This is a superclick")
    }
    render() {
        const { page } = this.state;
        // const tabbarStyles = [styles.tabbar];
        // if (Platform.OS === 'android') tabbarStyles.push(styles.androidTabbar);
        
        return (
          <View>
            <List>
              <List.Item arrow="horizontal">
                item list
              </List.Item>
              <List.Item >
                <Button onClick={this.superclick}> Start </Button>
              </List.Item>
              <List.Item >
                <InputItem
                  type="phone"
                  placeholder="input your phone"
                >Some label</InputItem>
              </List.Item>
    
    
            {/* </DatePicker> */}
            </List>
          </View>  
        //   <View style={styles.container}>
        //     <NavBar leftContent="back"
        //   mode="light"
        //   onLeftClick={() => console.log('onLeftClick')}
        //   rightContent={[
        //     <Icon key="0" type="search" style={{ marginRight: '0.32rem' }} />,
        //     <Icon key="1" type="ellipsis" />,
        //   ]}
        // >NavBar</NavBar>        
        //     <Tabs
        //       selected={page}
        //       style={tabbarStyles}
        //       selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}
        //     >
        //         <Text name="first">
        //           First
        //         </Text>
        //         <Text name="second">Second</Text>
        //         <Text name="third">Third</Text>
        //     </Tabs>
    
        //     <Button> Start </Button>
        //     <Text>CodeSharing App</Text>
        //     <Text>{page}</Text>
        //   </View>
        )
      }
}    
// module.exports = InputScreen;