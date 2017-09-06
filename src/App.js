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
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import TimePicker from 'material-ui/TimePicker';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, Marker, Popup } from "react-mapbox-gl";

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import axios from 'axios';

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


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
            searchOpen: false,
            inmate: '',
            theMap: 'null',
            loginOpen: true,
            associateID: null,
            prisonID: null,
            persons: [],
            inmateID: null,
            startTime: null,
            endTime: null,
            date: null,
            center: [-139.765, 10.361392],
            dOpen: false
    };
    this.handleDate = this.handleDate.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleEndTime = this.handleEndTime.bind(this);
  }

  markerClicked(prisonID, prison) {
    var si = ReactDOM.findDOMNode(this).getElementsByClassName('selections');
    si[0].className = classNames({ selections: true, selectInmate: true, visible: false });
    si[1].className = classNames({ selections: true, createVisit: true, visible: false });
    si[2].className = classNames({selections: true, cancelVisit: true, visible:false});
    this.setState({ prisonID: prisonID });
    this.setState({ center: [-113.718, 36.146] });
    this.setState({ searchOpen: true });
    var label = ReactDOM.findDOMNode(this).getElementsByClassName('prison_name')[0];
    label.innerHTML = prison;
  }
   menuItems() {
        return this.state.persons.map((person) => ( <
            MenuItem key = { person.id }
            insetChildren = { true }
            onClick = {
                () => {
                    this.setState({ inmateID: person.id });
                }
            }
            primaryText = { person.inmate_first_name + " " + person.inmate_last_name }
            />
        ));
  }

  menuItems() {
        return this.state.persons.map((person) => ( <
            MenuItem key = { person.id }
            insetChildren = { true }
            onClick = {
                () => {
                    this.setState({ inmateID: person.id });
                }
            }
            primaryText = { person.inmate_first_name + " " + person.inmate_last_name }
            />
        ));
    }

    associateLogin(data) {
        var self = this;
        axios.get(`http://129.158.67.147/api/associate?q={"filters":[{"name":"username","op":"==","val":"${data.username}"}, {"name":"password","op":"==","val":"${data.password}"}]}`)
            .then(function(response) {
              response.data.num_results > 0 ? self.setState({ associateID: response.data.objects[0].id, loginOpen: false }) : console.log("No results found");
              self.setState({ loginOpen: false });
              self.state.theMap.flyTo({ 'center': [-119.718, 36.146], 'zoom': [5.2] });
                //console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    associateRegister(data) {
        var self = this;
        axios.post(`http://129.158.67.147/api/associate`, data)
            .then(function(response) {
              response.status == 201 ? self.setState({ associateID: response.data.id, loginOpen: false }) : console.log("No results found");
              self.setState({ loginOpen: false });
              self.state.theMap.flyTo({ 'center': [-119.718, 36.146], 'zoom': [5.2] });
                //console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    searchInmateFullname(data) {
        var self = this;

        if (data.lname.length < 1) {
            axios.get(`http://129.158.67.147/api/inmate?q={"filters":[{"name":"inmate_first_name","op":"==","val":"${data.fname}"},{"name":"prison_id","op":"==","val":"${this.state.prisonID}"}]}`)
                .then(function(response) {
                    response.data.num_results > 0 ? console.log(response) : console.log("No results found");
                    self.setState({ persons: response.data.objects });
                    self.menuItems();
                    self.inmateSearched();
                })
                .catch(function(error) {
                    console.log(error);
                });
        } else if (data.fname.length < 1) {
            axios.get(`http://129.158.67.147/api/inmate?q={"filters":[{"name":"inmate_last_name","op":"==","val":"${data.lname}"},{"name":"prison_id","op":"==","val":"${this.state.prisonID}"}]}`)
                .then(function(response) {
                    response.data.num_results > 0 ? console.log(response) : console.log("No results found");
                    self.setState({ persons: response.data.objects });
                    self.menuItems();
                    self.inmateSearched();
                })
                .catch(function(error) {
                    console.log(error);
                });
        } else {
            axios.get(`http://129.158.67.147/api/inmate?q={"filters":[{"name":"inmate_first_name","op":"==","val":"${data.fname}"},{"name":"inmate_last_name","op":"==","val":"${data.lname}"},{"name":"prison_id","op":"==","val":"${this.state.prisonID}"}]}`)
                .then(function(response) {
                    response.data.num_results > 0 ? console.log(response) : console.log("No results found");
                    self.setState({ persons: response.data.objects });
                    self.menuItems();
                    self.inmateSearched();
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    };

    handleStartTime(event, time) {
        this.setState({ startTime: time });
    };

    handleEndTime(event, time) {
        this.setState({ endTime: time });
    };

    handleDate(event, date) {
        this.setState({ date: date });
    };

    createVisit(data) {
        var self = this;
        axios.post(`http://129.158.67.147/api/visit`, data)
          .then(function (response) {
            self.setState({ dOpen: true });
            self.setState({ searchOpen: false });
                //response.status == 201 ? self.setState({ associateID: response.data.id, loginOpen: false }) : console.log("No results found");
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    inmateSelected = (event, index, inmate) => this.setState({ inmate });

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
    const dActions = [
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onClick={() => { this.setState({ dOpen: false }) }}
      />,
    ];
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
                      ref="loginUsername"
                      hintText="Username"
                      underlineFocusStyle={styles.textFieldSelected}
                    /><br />
                    <TextField
                      ref="loginPassword"
                      hintText="Password"
                      type="password"
                      underlineFocusStyle={styles.textFieldSelected}
                    /><br />
                    <FlatButton
                      backgroundColor="#E7E4DF"
                      hoverColor="#FEC009"
                      label="LOGIN"
                      fullWidth={true}
                      onClick={() => {
                        var payload = { username: this.refs.loginUsername.getValue(),
                          password: this.refs.loginPassword.getValue()
                        };
                        console.log(payload);
                        this.associateLogin(payload);
                      }}
                      />
              </div>
            </Tab>
            <Tab label="Register" style={{ 'backgroundColor': "#FEC009" }}>
              <div className="login">  
              <TextField
                ref="registerFirstName"      
                hintText="First Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                ref="registerLastName"      
                hintText="Last Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                ref="registerAddress"      
                hintText="Address"
                multiLine={true}
                rows={4}
                rowsMax={4}  
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                ref="registerUserName"      
                hintText="Username"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />  
              <TextField
                ref="registerPassword"      
                hintText="Password"
                type="password"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <FlatButton
                backgroundColor="#E7E4DF"
                hoverColor="#FEC009"
                label="REGISTER"
                fullWidth={true}
                onClick={() => {
                  var payload = {
                    associate_firstname: this.refs.registerFirstName.getValue(),
                    associate_lastname: this.refs.registerLastName.getValue(),
                    associate_address: this.refs.registerAddress.getValue(),
                    username: this.refs.registerUserName.getValue(),
                    password: this.refs.registerPassword.getValue()
                  };
                  this.associateRegister(payload);
                }}  
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
                ref="inmateFirstName"  
                hintText="First Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <TextField
                ref="inmateLastName"  
                hintText="Last Name"
                underlineFocusStyle={styles.textFieldSelected}
              /><br />
              <FlatButton
                backgroundColor="#E7E4DF"
                hoverColor="#FEC009"
                label="SEARCH"
                onClick={() => {
                  var payload = {
                    fname: this.refs.inmateFirstName.getValue(),
                    lname: this.refs.inmateLastName.getValue()
                  };
                  this.searchInmateFullname(payload);
                }}  

              />

            </div>

            <div className="selections selectInmate">
              <h3>Select inmate visiting</h3>
              <SelectField
                hintText={this.state.inmateID ? "" : "Select an Inmate" }
                value={this.state.inmate}
                onChange={this.inmateSelected}
                //selectionRenderer={this.selectionRenderer}
              >
                {this.menuItems(this.state.persons)}
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
                <DatePicker hintText="Visit Date" container="inline" mode="landscape" ref="visitDate" onChange={this.handleDate} />
                <TimePicker
                  hintText="Start Time"
                  autoOk={true}
                  ref="visitStartTime"
                  onChange={this.handleStartTime}
                />
                <TimePicker
                  hintText="End Time"
                  autoOk={true}
                  ref="visitEndTime"
                  onChange={this.handleEndTime}
                />
                <br />
                <FlatButton
                  backgroundColor="#E7E4DF"
                  hoverColor="#FEC009"
                  label="CREATE VISIT"
                  fullWidth={true}
                  onClick={() => {
                      var payload = {
                        inmate_id: this.state.inmateID,
                        associate_id: this.state.associateID,
                        visit_date: this.state.date.toString(),
                        visit_start_time: this.state.startTime.toString(),
                        visit_end_time: this.state.endTime.toString(),
                      };
                      console.log(payload); 
                      this.createVisit(payload);
                   }}
                />
              </div>
              <div className="selections cancelVisit">
                  <h3>Choose visit to cancel</h3>
                  <SelectField
                    hintText="Select an inmate"
                    value={this.state.inmate}
                    onChange={this.inmateSelected}
                    //selectionRenderer={this.selectionRenderer}
                  >
                    {this.menuItems(this.state.persons)}
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
          <Dialog
            title="Visit Created"
            actions={dActions}
            modal={false}
            open={this.state.dOpen}
            onRequestClose={() => { this.setState({ dOpen: false }) }}
          >
            Congrats your visit has been created.
          </Dialog>
          <img src={require('./logo.png')} id='logo' height='100px' width="223px" />
          <span className="prison_name"> </span>
          </div>  
            
      </MuiThemeProvider>
    );
  }
}

export default App;
