import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { DatePicker, List, InputItem, Button, Card,Flex } from 'antd-mobile';
import { firebaseRef } from '../services/firebase.js'

export default class AttorneysCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: ''
    };
  }
  handleAccept() {
    // this.props.attorney.attorneyid
    let user = firebaseRef.auth().currentUser;
    firebaseRef.database().ref('School_bus/' + user.displayName + '/attorneys/' + this.props.attorney.attorneyid).update({
      state: "ready"
    })
    this.setState({ color: '#f1c40f'})
  }
  handleCancel() {
    let user = firebaseRef.auth().currentUser;
    firebaseRef.database().ref('School_bus/' + user.displayName + '/attorneys/' + this.props.attorney.attorneyid).update({
      state: "pending"
    })
    this.setState({ color: '#f10f3c' })
  }
    render(){


        return(
            <View>
              {
                this.props.type == "ready" ?
                <List.Item>
                  <Card>
                    <Card.Header
                      title={this.props.attorney.name + " "+ this.props.attorney.last_name}
                      extra={`Hijos ${this.props.attorney.number_children}`}
                    />
                    <Card.Body>
                      <Text style={{ textAlign: 'justify', marginLeft: 10 }}>
                      Comuna: {"\n"}
                      Calle: {this.props.attorney.street} {this.props.attorney.street_number}
                      </Text>
                      {/* <Button icon="check-circle-o">with icon</Button> */}
                    </Card.Body>
                    <Card.Footer content={this.props.status} extra="Se recoje en la vuelta:" />
                  </Card>
                </List.Item>
                :
                <List.Item
                  extra={
                    <View style={{ flex: 1 }}>
                      <Button 
                        type="primary" 
                        size="large" 
                        inline 
                        style={{ marginLeft:60}}
                        onClick = {this.handleAccept.bind(this)}
                        >
                          Aceptar
                      </Button>
                      <Button 
                        type="warning" 
                        size="large" 
                        inline 
                        style={{ marginLeft:60 }}
                        onClick= {this.handleCancel.bind(this)}
                        >
                          Rechazar
                        </Button>
                    </View>}
                  wrap
                  multipleLine
                  
                  style={{backgroundColor : `${this.state.color}`}}
                >
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'}}>
                  {this.props.attorney.name} {this.props.attorney.last_name}
                </Text>
                <List.Item.Brief>
                    Dirección:{"\n"}
                  <Text>
                  { this.props.attorney.street } { this.props.attorney.street_number }
                  </Text>
                </List.Item.Brief>
                </List.Item>
              }

          </View>
        )
    }

}

const styles = StyleSheet.create({
  title: {
      color: 'black',
      textAlign: 'left',
      marginTop: 10
  },

});