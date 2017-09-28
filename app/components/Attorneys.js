import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import Tabs from 'react-native-tabs';
import Prompt from 'react-native-prompt';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { sha256 } from 'react-native-sha256';

export default class Attorneys extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          page: 'first',
          visible : false,
          attorneys : []
        };
    }
    showPop(){
      console.log(this.state)
    }
    searchEmail(value){
      this.setState({visible: true})
      sha256(value).then( hash => {
          let search = "Attorney/"+hash
          let ref = firebaseRef.database().ref(search);
          ref.once("value")
            .then(function(snapshot) {
              alert(`El nombre de la persona es " ${snapshot.child("name").val()}"`)
            console.log(snapshot.child("uid").val()); 
          });
      })
      this.setState({
        promptVisible: false,
        message: `You said "${value}"`,
        visible: false
      }) 
    }

    render() {

        const { page } = this.state;
        // const tabbarStyles = [styles.tabbar];
        // if (Platform.OS === 'android') tabbarStyles.push(styles.androidTabbar);
        
        return (
          <View style={styles.container}>
            <List style={styles.list}>
              <List.Item>
                item list
              </List.Item>
            </List>
            <View style={styles.form}>
                    <View style={styles.formContainer}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={()=> this.setState({promptVisible:true})}>
                            <Text style={styles.buttonText}> 
                                Agregar apoderado
                            </Text>
                        </TouchableOpacity>
                    </View>
            </View>
            <Prompt
              title="Ingrese correo del apoderado"
              placeholder="example@mail.com"
              defaultValue="test@mail.cl"
              visible={ this.state.promptVisible }
              onCancel={ () => this.setState({
                promptVisible: false,
                message: "You cancelled"
              }) }
              onSubmit={ this.searchEmail.bind(this) }/>     
              <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{color: '#FFF'}} />       
          </View>  
          


               //<View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fafafa'
  },
  logoContainer:{
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center'
  },
  list:{
    flex :5
  },
  form:{
    flex :1
  },
  logo: {
      width: 150,
      height: 250
  },
  title: {
      color: 'black',
      textAlign: 'center',
      marginTop: 10
  },
  input: {
      height: 40,
      color: 'rgba(255,255,255,0.7)',
      marginBottom: 20,
      color: 'black',
      paddingHorizontal: 10
  },
  formContainer: {
      padding: 20
  },
  buttonContainer:{
      backgroundColor: '#f1c40f',
      paddingVertical: 20
  },
  buttonRegisterContainer:{
      backgroundColor: '#FFB74D',
      paddingVertical: 5,
      marginTop: 10
  },
  buttonText: {
      textAlign: 'center',
      color: 'black',
      fontWeight: '700'
  }
});
