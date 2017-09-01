import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, Marker } from "react-mapbox-gl";


import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import logo from './logo.svg';
import './App.css';


const accessToken = "pk.eyJ1IjoiZG9taWZ1bCIsImEiOiJjajZ3YWxwMnExYWtrMzhvM29tN2F6Mnl2In0.URW4KAAH60FcmQLe-0UWQg";

const Map = ReactMapboxGl({
  accessToken
});

class App extends Component {
  render() {
    var theMap = null;
    return (
      <MuiThemeProvider>

        <div className="App">
          <Toolbar
            style={{
                backgroundColor: '#303841',
              }}
            >
            <ToolbarTitle text="CalPIVS" />  
          </Toolbar>
          <span id="theMap">
            <Map
              style="mapbox://styles/domiful/cj6wampja8ygb2rqfrfsl8uwo"
              center={[-120.108,37.333]}
              zoom="1"
              onStyleLoad={(map) => {
                theMap = map;
                theMap.flyTo({'center':[-119.718,36.146] , 'zoom':[5.2]});
              }}
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}
            >
              
              <Marker
                coordinates={[-120.52582, 40.40501]}
                anchor="bottom"
                className="marker"
                onClick={console.log('High Desert State Prison Susanville')}
              />
              <Marker
                coordinates={[-121.152455, 38.693346]}
                anchor="bottom"
                className="marker"
                onClick={console.log('California State Prison - Sacramento')}
              />
              <Marker
                coordinates={[-124.159985, 41.4477586]}
                anchor="bottom"
                className="marker"
                onClick={console.log('Pelican Bay State Prison')}
              />
              <Marker
                coordinates={[-119.552853, 36.060226]}
                anchor="bottom"
                className="marker"
                onClick={console.log('California State Prison, Corcoran')}
              />
              <Marker
                coordinates={[-114.908844, 33.562798]}
                anchor="bottom"
                className="marker"
                onClick={console.log('Chuckawalla Valley State Prison')}
              />
              </Map>
          </span>
            
  </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
