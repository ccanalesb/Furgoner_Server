import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Button
} from 'react-native';
import MapView from 'react-native-maps'



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
            follow_marker : true
        };
    }
    watchID : ?number = null

    componentDidMount () {
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
            { enableHighAccuracy: true, timeout: 20000, maximumAge : 1000 })

            this.watchID = navigator.geolocation.watchPosition((position)=>{
                console.log("Watching position")
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
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

            })
        
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
        console.log(this.state)
    }
    
    render(){
        console.log(this.state.position)
        let mapRegion = {}
        if(this.state.follow_marker){
            mapRegion = this.state.position
        }
        else{
            mapRegion = this.state.regionPosition
        }
        return (
            <View style = {styles.container} >
                <View style={styles.button}>
                    <Button
                        name = "Click me"
                        title = "Click me"
                        onPress = {this.handlePress.bind(this)}
                    >
                    </Button>    
                </View>
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
                </MapView>
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
        bottom: 0,
        right: 0,
        zIndex: 2
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
