import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Login from 'react-native-simple-login'
import InputScreen from './InputScreen'
import { firebaseRef } from '../services/firebase.js'

export default class LoginWrapper extends Component {
    onLogin(email, password){
        email = "canaleschiko@gmail.com"
        password = "123456"
        console.log(email, password)
        firebaseRef.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            firebaseRef.auth().onAuthStateChanged(function(user) {
                if (user) {
                    console.log("logiiniiiiinnininini")
                    Actions.main()
                  // User is signed in.
                } else {
                    console.log("no pasó na")
                  // No user is signed in.
                }
            });
          })
        .catch(function(error) {
            // Handle Errors here.
            console.log(error.code)
            console.log(error.message)
            // ...
        })

        // Actions.main()
        // Actions.main({type: "reset"})
        
        // this.props.navigator.immediatelyResetRouterStack([{
        //     component: InputScreen
        // }])
    }
    onResetPassword(email, password){
        console.log(email, password)
    }
    componentDidMount(){
        console.log(firebaseRef)
        // Actions.main()
    }
    render(){
        return(
            <Login
                onLogin={this.onLogin.bind(this)}
                onResetPassword={this.onResetPassword}
                logoImage = { require('../../images/login.jpeg') }
                labels = { {
                    userIdentification: "Email",
                    password : "Contraseña",
                    forgotPassword : "Olvidó su contraseña?",
                    loginFormButton : "Entrar",
                    forgotPasswordFormButton: "Enviar",
                    back : "Atrás"
                }}
             />
        )
    }
}
// export default class Login extends Component {
//     render(){
//         return(
//             <View>
//                 <View style={styles.logo_container}>
//                     <Image 
//                         style = {styles.logo}
//                         source = { require('../img/login.jpeg') }
//                     />
//                 </View>
//                 <View>
//                 </View>
//             </View>

//         )
//     }
// }

// const styles = StyleSheet.create({
//     logo: {
//         width : 100,
//         height: 100
//     },
//     logo_container: {
//         alignItems: 'center',
//         flexGrow: 1,
//         justifyContent : 'center'
//     }
// })