import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimePicker from 'material-ui/TimePicker';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, Marker, Popup } from "react-mapbox-gl";

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import './App.css';
//import * as muiTheme from './NewTheme.js';

var classNames = require('classnames');


const accessToken = "pk.eyJ1IjoiZG9taWZ1bCIsImEiOiJjajZ3YWxwMnExYWtrMzhvM29tN2F6Mnl2In0.URW4KAAH60FcmQLe-0UWQg";
const DBLUE = '#303841';
const BLUE = '#16157A';
const YELLOW = "#FEC009";
const WHITE = "#E7E4DF";

const Map = ReactMapboxGl({
  accessToken
});

const styles = {
  textFieldSelected: {
    borderColor: "#FEC009",
  },
};

const muiTheme = getMuiTheme({
    fontFamily: 'Share Tech Mono',
    palette: {
      textColor: WHITE,
      canvasColor: DBLUE
    },
    textField: {
      hintColor: WHITE,
    },
    flatButton: {
        textColor: BLUE,
    },
    datePicker: {
      selectColor: YELLOW,
      selectTextColor: BLUE,
      headerColor: YELLOW,
    },
    timePicker: {
      selectTextColor: BLUE,
      headerColor: YELLOW,
    },
});

const persons = [
  {value: 0, name: 'Oliver Hansen'},
  {value: 1, name: 'Van Henry'},
  {value: 2, name: 'April Tucker'},
  {value: 3, name: 'Ralph Hubbard'},
  {value: 4, name: 'Omar Alexander'},
  {value: 5, name: 'Carlos Abbott'},
  {value: 6, name: 'Miriam Wagner'},
  {value: 7, name: 'Bradley Wilkerson'},
  {value: 8, name: 'Virginia Andrews'},
  {value: 9, name: 'Kelly Snyder'},
];


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { searchOpen: false, inmate: '', theMap: 'null', loginOpen: true, center: [-139.765,10.361392] };
  }

  markerClicked(prisonID, prison) {
    var si = ReactDOM.findDOMNode(this).getElementsByClassName('selections');
    si[0].className = classNames({ selections: true, selectInmate: true, visible: false });
    si[1].className = classNames({ selections: true, createVisit: true, visible: false });
    si[2].className = classNames({selections: true, cancelVisit: true, visible:false});
    this.setState({ center: [-113.718, 36.146] });
    this.setState({ searchOpen: true });
    var label = ReactDOM.findDOMNode(this).getElementsByClassName('prison_name')[0];
    label.innerHTML = prison;


  }
  menuItems(persons) {
    return persons.map((person) => (
      <MenuItem
        key={person.value}
        insetChildren={true}
        value={person.value}
        primaryText={person.name}
      />
    ));
  }

  inmateSelected = (event, index, inmate) => this.setState({inmate});

  selectionRenderer = (inmate) => {
    return persons[inmate].name;
  }

  inmateSearched() {
    var si = ReactDOM.findDOMNode(this).getElementsByClassName('selections');
    si[0].className = classNames({ selections: true, selectInmate: true, visible: true });
    si[1].className = classNames({ selections: true, createVisit: true, visible: false });
    si[2].className = classNames({selections: true, cancelVisit: true, visible:false});
  }

  createClicked() {
    var si = ReactDOM.findDOMNode(this).getElementsByClassName('selections');
    si[0].className = classNames({ selections: true, selectInmate: true, visible: true });
    si[1].className = classNames({ selections: true, createVisit: true, visible: true });
    si[2].className = classNames({selections: true, cancelVisit: true, visible:false});
  }

  cancelClicked() {
    var si = ReactDOM.findDOMNode(this).getElementsByClassName('selections');
    si[0].className = classNames({ selections: true, selectInmate: true, visible: true });
    si[1].className = classNames({ selections: true, createVisit: true, visible: false });
    si[2].className = classNames({selections: true, cancelVisit: true, visible:true});
  }

  render() {

    return (
      <MuiThemeProvider muiTheme={muiTheme}>

        <div className="App">
          <Drawer width="25%" openSecondary={true} open={this.state.loginOpen} >
            <Toolbar style={{ 'backgroundColor': "#FEC009" }}>
              <ToolbarTitle text="Hello Visitor" />
              
            </Toolbar>
          <Tabs>
            <Tab label="Login" style={{ 'backgroundColor': "#FEC009" }}>
              <div className="login">
                    <TextField
                      hintText="Username"
                      underlineFocusStyle={styles.textFieldSelected}
                    /><br />
                    <TextField
                      hintText="Password"
                      type="password"
                      underlineFocusStyle={styles.textFieldSelected}
                    /><br />
                    <FlatButton
                      backgroundColor="#E7E4DF"
                      hoverColor="#FEC009"
                      label="LOGIN"
                      fullWidth={true}
                      onClick={() => { this.setState({ loginOpen: false }); this.state.theMap.flyTo({'center':[-119.718,36.146] , 'zoom':[5.2]});}}
                      />
              </div>
            </Tab>
            <Tab label="Register" style={{ 'backgroundColor': "#FEC009" }}>
              <div className="login">  
              <TextField
                hintText="First Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                hintText="Last Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                hintText="Address"
                multiLine={true}
                rows={4}
                rowsMax={4}  
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                hintText="Username"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />  
              <TextField
                hintText="Password"
                type="password"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <FlatButton
                backgroundColor="#E7E4DF"
                hoverColor="#FEC009"
                label="REGISTER"
                fullWidth={true}
                onClick={()=>{}}  
                  />
                </div>  
            </Tab>
          </Tabs>

          </Drawer>
          
          <Drawer className="searchDrawer" width="30%" openSecondary={true} open={this.state.searchOpen} >
            <Toolbar style={{ 'backgroundColor': "#FEC009" }}>
              <ToolbarTitle text="Search Inmate" />
              <FlatButton label="Close" onClick={() => { this.setState({ searchOpen: false }); this.state.theMap.easeTo({'center':[-119.718,36.146]}); }}/>
          </Toolbar>
            <div>
              <TextField
                hintText="First Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                hintText="Last Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <FlatButton
                backgroundColor="#E7E4DF"
                hoverColor="#FEC009"
                label="SEARCH"
                onClick={()=>{this.inmateSearched()}}  

              />

            </div>

            <div className="selections selectInmate">
              <h3>Select inmate visiting</h3>
              <SelectField
                hintText="Select an inmate"
                value={this.state.inmate}
                onChange={this.inmateSelected}
                selectionRenderer={this.selectionRenderer}
              >
                {this.menuItems(persons)}
              </SelectField>
                <FlatButton
                backgroundColor="#E7E4DF"
                hoverColor="#FEC009"
                label="CREATE VISIT"
                fullWidth={true}
                onClick={()=>{this.createClicked()}}
                /><br /><br />
              <FlatButton
                backgroundColor="#E7E4DF"
                hoverColor="red"
                label="CANCEL VISIT"
                fullWidth={true}
                onClick={()=>{this.cancelClicked()}}  
              /><br /><br />
            </div>
              <div className="selections createVisit">
                <h3>Create a new visit</h3>
                <DatePicker hintText="Visit Date" container="inline" mode="landscape" />
                <TimePicker
                  hintText="Start Time"
                  autoOk={true}
                />
                <TimePicker
                  hintText="End Time"
                  autoOk={true}
                />
                <br />
                <FlatButton
                  backgroundColor="#E7E4DF"
                  hoverColor="#FEC009"
                  label="CREATE VISIT"
                  fullWidth={true}  
                />
              </div>
              <div className="selections cancelVisit">
                  <h3>Choose visit to cancel</h3>
                  <SelectField
                    hintText="Select an inmate"
                    value={this.state.inmate}
                    onChange={this.inmateSelected}
                    selectionRenderer={this.selectionRenderer}
                  >
                    {this.menuItems(persons)}
                </SelectField>
                <FlatButton
                  backgroundColor="#E7E4DF"
                  hoverColor="red"
                  label="CANCEL VISIT"
                  fullWidth={true}  
                />
                
              </div>
          </Drawer>
          <span id="theMap">
            <Map
              style="mapbox://styles/domiful/cj6wampja8ygb2rqfrfsl8uwo"
              center={this.state.center}
              zoom="5"
              interactive={false}
              onStyleLoad={(map) => {
                this.setState({ theMap: map });
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
                onClick={() => { this.markerClicked(1, 'High Desert State Prison Susanville') }}
              />
              <Marker
                coordinates={[-121.152455, 38.693346]}
                anchor="bottom"
                className="marker"
                onClick={() => { this.markerClicked(2, 'California State Prison - Sacramento')}}
              />
              <Marker
                coordinates={[-124.159985, 41.4477586]}
                anchor="bottom"
                className="marker"
                onClick={() => { this.markerClicked(3, 'Pelican Bay State Prison') }}
              />
              <Marker
                coordinates={[-119.552853, 36.060226]}
                anchor="bottom"
                className="marker"
                onClick={() => { this.markerClicked(4, 'California State Prison, Corcoran') }}
              />
              <Marker
                coordinates={[-114.908844, 33.562798]}
                anchor="bottom"
                className="marker"
                onClick={() => { this.markerClicked(5, 'Chuckawalla Valley State Prison') }}
              />
              <Marker
                coordinates={[-118.236, 34.690]}
                anchor="bottom"
                className="marker"
                onClick={() => { this.markerClicked(6, 'California State Prison') }}
              />
              <Marker
                coordinates={[-120.696, 35.322]}
                anchor="bottom"
                className="marker"
                onClick={() => { this.markerClicked(7, 'California Men\'s Colony') }}
              />

              </Map>
          </span>
          <img src={require('./logo.png')} id='logo' height='100px' width="223px" />
          <span className="prison_name"> </span>
          </div>  
            
      </MuiThemeProvider>
    );
  }
}

export default App;
