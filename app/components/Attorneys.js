import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';
import Tabs from 'react-native-tabs';
import Prompt from 'react-native-prompt';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { sha256 } from 'react-native-sha256';
import AttorneysCard from './AttorneysCard'

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
        var ref = firebaseRef.database().ref(search);
        ref.once("value")
            .then((snapshot) => {
                alert(`El nombre de la persona es " ${snapshot.child("name").val()}"`)
                console.log(snapshot.child("children").numChildren())
                console.log(snapshot.child("children").val()); 
                let temp_attorney = this.state.attorneys
                temp_attorney.push({ name : snapshot.child("name").val(), children: snapshot.child("children").val() , number_children: snapshot.child("children").numChildren() })
                this.setState({attorneys : temp_attorney })
        });
          
      })
      this.setState({
        promptVisible: false,
        message: `You said "${value}"`,
        visible: false
      }) 
    }

    componentWillMount() {
        this.getAttorneys()
    }
    getAttorneys(){
        let user = firebaseRef.auth().currentUser;
        let search = "School_bus/" + user.displayName + "/attorneys"
        var ref = firebaseRef.database().ref(search).orderByKey();;
        ref.once("value")
            .then((snapshot) => {
                let ready_temp_attorneys = []
                snapshot.forEach((childSnapshot) => {
                    let attorney = {}
                    let val = childSnapshot.val()
                    if (val.hasOwnProperty("state") && val.state == this.props.attorney_status) {
                        attorney[childSnapshot.key] = childSnapshot.val()
                        ready_temp_attorneys.push(attorney)
                    }
                });
                this.setState({
                    attorneys: ready_temp_attorneys,
                })
            })
            .then((temp_attorney) => {
                console.log("mostrando attorney")
                let ready_temp_attorneys = this.state.attorneys
                ready_temp_attorneys.forEach((attorney,index) => {
                    this.searchAttorney(attorney,index)
                })
            })
    }
    recharge(){
        this.getAttorneys()
    }
    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    searchAttorney(hash,index){
        console.log("in search attorney with index: "+index)
        let attorneyid = Object.keys(hash)[0]
        let search = "Attorney/" + Object.keys(hash)[0]
        var ref = firebaseRef.database().ref(search);
        ref.once("value")
            .then((snapshot) => {
                console.log(snapshot.val())
                temp_atorney = {
                    name: snapshot.child("personal_info").child("name").val(),
                    last_name: snapshot.child("personal_info").child("last_name").val(),
                    county: snapshot.child("personal_info").child("county").val(),
                    street: snapshot.child("personal_info").child("street").val(),
                    street_number: snapshot.child("personal_info").child("street_number").val(),
                    children: snapshot.child("children").val(),
                    number_children: snapshot.child("children").numChildren(),
                    attorneyid: attorneyid
                }
                let ready_temp_attorneys = this.state.attorneys
                ready_temp_attorneys[index] = temp_atorney
                this.setState({attorneys : ready_temp_attorneys})
                // console.log(this.state.attorneys)
                // return temp_atorney
            })
            .then(()=>{
                console.log(this.state)
            })
    }
    render() {

        const { page } = this.state;
        // const tabbarStyles = [styles.tabbar];
        // if (Platform.OS === 'android') tabbarStyles.push(styles.androidTabbar);
        
        return (
          <View style={styles.container}>

            <ScrollView>

                <List style={styles.list}>
                    {
                        Object.values(this.state.attorneys).map((e, i) =>
                            <AttorneysCard key={i} attorney = {e} type={this.props.attorney_status}/>
                        )}
                </List>
                
            </ScrollView>
            {
            this.props.attorney_status == "pending" ? 
                <View style={styles.form}>
                    <View style={styles.formContainer}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={this.recharge.bind(this)}>
                            <Text style={styles.buttonText}>
                                recargar apoderados
                                </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.buttonContainer} onPress={()=> this.setState({promptVisible:true})}>
                            <Text style={styles.buttonText}> 
                                Agregar apoderado
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </View> : null 
            } 
            <Prompt
                title="Ingrese correo del apoderado"
                placeholder="example@mail.com"
                defaultValue="test@mail.cl"
                visible={this.state.promptVisible}
                onCancel={() => this.setState({
                    promptVisible: false,
                    message: "You cancelled"
                })}
                onSubmit={this.searchEmail.bind(this)} />   
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
      justifyContent: 'center',
      flex:1
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
