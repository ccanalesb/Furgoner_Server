import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Button,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import MapView from 'react-native-maps'
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../services/firebase.js'
import { sha256 } from 'react-native-sha256';



const LATITUD_DELTA = 0.0922

const LONGITUDE_DELTA = 0.0421

export default class ShowMap extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            position: {
                latitude : 0,
                longitude : 0,
                latitudeDelta: 0,
                longitudeDelta : 0
            },
            regionPosition: {
                latitude : 0,
                longitude : 0,
                latitudeDelta: 0,
                longitudeDelta : 0
            },
            markerPosition:{
                latitude : 0,
                longitude : 0
            },
            follow_marker : true,
            user : null,
            in_transit : false,
            attorneys : []
        };
    }
    watchID : ?number = null

    componentDidMount () {
        console.log(this.state)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
                const window = Dimensions.get('window');
                const { width, height }  = window
                LONGITUDE_DELTA = LATITUD_DELTA + (width / height)

                let initialRegion = {
                    latitude : lat,
                    longitude : long,
                    latitudeDelta: LATITUD_DELTA/30,
                    longitudeDelta : LONGITUDE_DELTA/30
                }
                this.setState({
                    position: initialRegion,
                    regionPosition : initialRegion,
                    markerPosition : { latitude: lat, longitude: long}
                })
                console.log("Get current position")

            }, (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: true, timeout: 20000, maximumAge : 100 })

            this.watchID = navigator.geolocation.watchPosition((position)=>{

                console.log("Watching position")
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
                if(this.state.in_transit){
                    let user = firebaseRef.auth().currentUser;
                    let search = "School_bus/" + user.displayName 
                    firebaseRef.database().ref('School_bus/' + user.displayName).update({
                        latitude: lat,
                        longitude: long,
                    })
                }
                // const { latitudeDelta, longitudeDelta} = getRegionForCoordinates({ latitude: lat, longitude: long })
                // console.log(latitudeDelta)
                // console.log(longitudeDelta)

                let lastPosition = {
                    latitude : lat,
                    longitude : long,
                    latitudeDelta: LATITUD_DELTA,
                    longitudeDelta : LONGITUDE_DELTA
                }
                if(this.state.follow_marker){
                    console.log("Following marker")
                    this.setState({
                        position: {
                            latitude : lat,
                            longitude : long,
                            latitudeDelta: this.state.position.latitudeDelta,
                            longitudeDelta : this.state.position.longitudeDelta
                        }, 
                        markerPosition : { latitude: lat, longitude: long}})
                }
                else {
                    console.log("Free move")
                    this.setState({
                        markerPosition : { latitude: lat, longitude: long}
                    })
                }

            }, (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: true, timeout: 20000, maximumAge : 100 })
        
    }
    onRegionChange(region){
        if(this.state.follow_marker){
            this.setState({
                position: {
                    ...this.state.position,
                    latitudeDelta : region.latitudeDelta,
                    longitudeDelta : region.longitudeDelta
                }
            })
        }
        else{
            this.setState({
                regionPosition: {
                    latitude : region.latitude,
                    longitude : region.longitude,
                    latitudeDelta : region.latitudeDelta,
                    longitudeDelta : region.longitudeDelta
                }
            })
        }
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID)
    }
    touchMarker(e){
        console.log("tocando el marcado")
        console.log(e.nativeEvent)
        console.log(this.state)
        this.state.attorneys.map((attorney) => (
            console.log(attorney)
        ))
    }
    moveMarker(e){
        console.log("terminando de mover")
        console.log(e.nativeEvent)
    }
    handlePress(){
        if(this.state.follow_marker){
            this.setState({ 
                follow_marker : false,
                regionPosition: {
                    ...this.state.position
                }
            })
        }
        else{
            this.setState({ 
                follow_marker : true,
                position : {
                    ...this.state.regionPosition,
                    latitude : this.state.position.latitude,
                    longitude : this.state.position.longitude
                }
            })
        }
        this.getAttorneys()
    }
    initRound(){
        
        let user = firebaseRef.auth().currentUser;
        if(this.state.in_transit){
            console.log("Terminado el viaje de la vida")
            this.setState({ in_transit: false })
            firebaseRef.database().ref('School_bus/' + user.displayName).update({
                in_transit: false,
                latitude: this.state.markerPosition.latitude,
                longitude: this.state.markerPosition.longitude
            });
        }
        else{
            console.log("iniciando el viaje de la vida")
            this.setState({ in_transit: true })
            firebaseRef.database().ref('School_bus/' + user.displayName).update({
                in_transit: true,
                latitude: this.state.markerPosition.latitude,
                longitude: this.state.markerPosition.longitude
            });                
        }
    }
    componentWillMount(){
        firebaseRef.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user)
                this.setState({ user: user })
            } else {
                this.setState({user: null})
                navigator.geolocation.clearWatch(this.watchID)
                Actions.login()
            }
        })
        let user = firebaseRef.auth().currentUser;
        var ref = firebaseRef.database().ref('School_bus/' + user.displayName);
        ref.once("value")
            .then((snapshot) => {
                this.setState({ in_transit: snapshot.child("in_transit").val() })
                console.log(this.state.in_transit)
            })
        this.getAttorneys()
        
    }
    getAttorneys() {
        let user = firebaseRef.auth().currentUser;
        let search = "School_bus/" + user.displayName + "/attorneys"
        var ref = firebaseRef.database().ref(search).orderByKey();;
        ref.once("value")
            .then((snapshot) => {
                let ready_temp_attorneys = []
                snapshot.forEach((childSnapshot) => {
                    let attorney = {}
                    let val = childSnapshot.val()
                    if (val.hasOwnProperty("state")) {
                        attorney[childSnapshot.key] = childSnapshot.val()
                        ready_temp_attorneys.push(attorney)
                    }
                });
                this.setState({
                    attorneys: ready_temp_attorneys,
                })
            })
            .then((temp_attorney) => {
                let ready_temp_attorneys = this.state.attorneys
                ready_temp_attorneys.forEach((attorney, index) => {
                    this.searchAttorney(attorney, index)
                })
            })
    }
    searchAttorney(hash, index) {
        console.log("in search attorney with index: " + index)
        let attorneyid = Object.keys(hash)[0]
        let search = "Attorney/" + Object.keys(hash)[0] + "/personal_info"
        var ref = firebaseRef.database().ref(search);
        ref.once("value")
            .then((snapshot) => {
                temp_atorney = {
                    name: snapshot.child("name").val(),
                    last_name: snapshot.child("last_name").val(),
                    
                    street: snapshot.child("street").val(),
                    street_number: snapshot.child("street_number").val(),
                    position: {
                        longitude: snapshot.child("longitude").val(),
                        latitude: snapshot.child("latitude").val()
                    },
                    number_children: snapshot.child("children").numChildren(),
                    attorneyid: attorneyid
                }
                let ready_temp_attorneys = this.state.attorneys
                ready_temp_attorneys[index] = temp_atorney
                this.setState({ attorneys: ready_temp_attorneys })
            })
    }
    render(){
        /* this.watcher_position() */
        let mapRegion = {}
        var markers = []
        if (this.state.attorneys.length > 0){
            markers = this.state.attorneys.map((attorney,index) => {
                if (attorney.hasOwnProperty("position")) {
                    // console.log(attorney)
                    return(
                        <MapView.Marker
                            key = {index}
                            title={attorney.name + " " + attorney.last_name}
                            description={"Dirección: "+ attorney.street +" "+ attorney.street_number}
                            coordinate={{
                                latitude: attorney.position.latitude,
                                longitude: attorney.position.longitude,
                            }}
                        >
                            <View style={styles.radius2}>
                                <View style={styles.marker2}>
                                </View>
                            </View>    
                        </MapView.Marker>
                    )
                }
            })
            // console.log(markers)
        }
        if(this.state.follow_marker){
            mapRegion = this.state.position
        }
        else{
            mapRegion = this.state.regionPosition
        }
        return (
            <View style = {styles.container} >
                <MapView
                    style = {styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={this.onRegionChange.bind(this)}
                    ref={(ref) => { this.mapRef = ref }}
                >

                <MapView.Marker
                coordinate = {this.state.markerPosition}
                draggable
                onDragEnd={this.moveMarker.bind(this)}
                onPress = {this.touchMarker.bind(this)}
                >
    
                    <View style={styles.radius}>
                        <View style = {styles.marker}>  
                        </View>    
                    </View>    
                </MapView.Marker>
                {markers}
                </MapView>
                {/* {   
                    this.state.attorneys.map((attorney,index) => (
                        <MapView.Marker
                            key={index}
                            coordinate={attorney.position}
                            title={attorney.name}
                        >
                            <View style={styles.radius}>
                                <View style={styles.marker}>
                                </View>
                            </View> 
                        </MapView.Marker>
                    ))
                } */}

                {/* {markers === null ? null : markers} */}
                <TouchableOpacity style={styles.roundButtom} onPress={this.handlePress.bind(this)}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../images/follow.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.buttonContainer} 
                    onPress={this.initRound.bind(this)}
                    activeOpacity={.1}
                    underlayColor={'rgba(0,0,0,'+this.state.opacity+')'}
                >
                    <Text style={styles.buttonText}>
                        {this.state.in_transit ? 'Terminar Viaje' : 'Iniciar Viaje'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    radius: {
        height: 50,
        width: 50,
        borderRadius: 50/2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,122,255,0.3)',
        alignItems: 'center',
        justifyContent : 'center'
    },
    marker : {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20/2,
        overflow: 'hidden',
        backgroundColor: '#007AFF'
    },
    radius2: {
        height: 30,
        width: 30,
        borderRadius: 50/2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,122,255,0.3)',
        alignItems: 'center',
        justifyContent : 'center'
    },
    marker2: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20/2,
        overflow: 'hidden',
        backgroundColor: 'red'
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'baseline',

    },
    map: {
      ...StyleSheet.absoluteFillObject,
      borderTopWidth: 100,
      alignItems: 'baseline',

    },
    button: {
        position: 'absolute',
        bottom: 10,
        zIndex: 2,
        paddingVertical: 20
    },
    buttonContainer:{
        alignSelf : 'center',
        backgroundColor: '#f10f3c',
        paddingVertical: 20,
        zIndex: 2,
        width: '90%',
        marginTop :'100%'
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    roundButtom:{
        alignSelf : 'flex-end',
        left: -20,
        top : -20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        // backgroundColor: '#f10f3c',
        borderRadius: 100,
    }
  });
// const styles = StyleSheet.create({
//     container:{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF'
//     },
//     map:{
//         left : 0,
//         right: 0,
//         top: 0,
//         position: 'absolute'
//     }
// })
