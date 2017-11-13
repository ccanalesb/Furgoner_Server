import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import Attorneys from './Attorneys'

const AttorneyRoute = () => <Attorneys attorney_status = "ready"/>
const SecondRoute = () => <Attorneys attorney_status="pending" />

export default class AttorneysTabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: [
                { key: '1', title: 'Aceptados' },
                { key: '2', title: 'Por aceptar' },
            ],
            ready_attorneys : [],
            pending_attorneys : []
        };
    }
    
    _handleIndexChange = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props} style={{ backgroundColor: '#f1c40f',}}/>;

    _renderScene = SceneMap({
        '1': AttorneyRoute,
        '2': SecondRoute,
    });

    render() {
        return (
            <TabViewAnimated
                style={styles.container}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});