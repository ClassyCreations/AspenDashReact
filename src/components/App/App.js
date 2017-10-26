// src/components/App/index.js
import React, { Component } from 'react';
import request from 'request';
import { Row } from 'react-bootstrap';

import Header from '../Header/Header';
import PageTitle from '../Title/Title';
import Schedule from '../Schedule/Schedule'
import Announcements from '../Announcements/Announcements';
import DayTimer from '../DayTimer/DayTimer';
import BlockTimer from '../BlockTimer/BlockTimer';
import Lunch from '../Lunch/Lunch';
import { loadState, saveState } from '../../localstorage';

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {aspenLoaded: false, schedule: null, currentBlock: null, dayNumber: null, asOf: 0, displayExceptions: {}, hideCursor: false};
    this.getAspenInfo()
      .then(res => {
        this.setState({aspenLoaded: true, asOf: res.asOf, schedule: res.schedule.blockSchedule, currentBlock: res.schedule.block, dayNumber: res.schedule.day, announcements: res.announcements.hs});
        setInterval(this.getAspenInfo, 60000);
      });
    this.getDisplayExceptions = this.getDisplayExceptions.bind(this);
    this.setDisplayException = this.setDisplayException.bind(this);
    this.toggleDisplayException = this.toggleDisplayException.bind(this);
    this.getQueryStringOverrides = this.getQueryStringOverrides.bind(this);
    this.hideCursor = this.hideCursor.bind(this);
  }

  componentDidMount(){
    this.getDisplayExceptions();
    this.hideCursor();
  }

  getDisplayExceptions(){
    let loadedState = loadState();
    if(typeof loadedState === 'object') {
      this.setState({displayExceptions: loadedState});
    }else{
      let defaultDisplay = {pageTitle: true, schedule: true, dayTimer: true, blockTimer: true, lunch: true, announcements: true, header: true};
      loadedState = defaultDisplay;
      saveState(defaultDisplay);
    }
    const overrides = this.getQueryStringOverrides() || [];
    overrides.forEach(override => {
      loadedState[override] = false;
    });
    this.setState({displayExceptions: loadedState});
  }

  setDisplayException(id, value){
    let newExceptions = this.state.displayExceptions;
    newExceptions[id] = value;
    this.setState({displayExceptions: newExceptions});
    saveState(this.state.displayExceptions);
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  getQueryStringOverrides(){
    try{
      return JSON.parse(this.getParameterByName('displayOverrides'));
    }catch(err){
      return [];
    }
  }

  hideCursor(){
    if(this.getParameterByName('hideCursor') === 'true'){
      this.setState({hideCursor: true});
    }
  }

  toggleDisplayException(id){
    let newExceptions = this.state.displayExceptions;
    if(typeof newExceptions[id] === 'undefined'){
      return false;
    }else{
      if(newExceptions[id]){
        newExceptions[id] = false;
      }else{
        newExceptions[id] = true;
      }
      this.setState({displayExceptions: newExceptions});
      saveState(newExceptions);
    }
  }

  getAspenInfo(){
    return new Promise(resolve => {
      request.get('https://mhs-aspencheck-serve.herokuapp.com/', (err, res, body) => {
        try{
          const res = JSON.parse(body);
          resolve(res);
        }catch(err){
          resolve({asOf: new Date().getTime(), schedule: {blockSchedule: [], currentBlock: 'Z', day: 0}, announcements: {hs: []}});
        }
      })
    });
  }

  render() {
    let colDisplayed = 0;
    let size;
    if(this.state.displayExceptions.dayTimer) colDisplayed++;
    if(this.state.displayExceptions.blockTimer) colDisplayed++;
    if(this.state.displayExceptions.lunch) colDisplayed++;
    if(colDisplayed === 1) size = 12;
    if(colDisplayed === 2) size = 6;
    if(colDisplayed === 3) size = 4;
    return (
      <div className={this.state.hideCursor ? "main-container no-cursor" : "main-container"}>
        {this.state.displayExceptions.header ?
          <Header loaded={this.state.aspenLoaded} setDisplay={this.toggleDisplayException} exceptions={this.state.displayExceptions}/>
          :
          <div/>
        }
        <div className="mainInfoWrapper">
          {this.state.displayExceptions.pageTitle ?
            <PageTitle dayNumber={this.state.dayNumber} asOf={this.state.asOf}/>
            :
            <div/>
          }
          {this.state.displayExceptions.schedule ?
            <Schedule schedule={this.state.schedule} currentBlock={this.state.currentBlock}/>
            :
            <div/>
          }
          <Row>
            {this.state.displayExceptions.dayTimer ?
              <DayTimer size={size} isHalfDay={false}/>
              :
              <div/>
            }
            {this.state.displayExceptions.blockTimer ?
              <BlockTimer schedule={this.state.schedule}  size={size}/>
              :
              <div/>
            }
            {this.state.displayExceptions.lunch ?
              <Lunch size={size}/>
              :
              <div/>
            }
          </Row>
          {this.state.displayExceptions.announcements ?
            <Announcements announcements={this.state.announcements} displayButtons={this.state.displayExceptions.announcementsButtons} cycleTime={8000}/>
            :
            <div/>
          }
        </div>
      </div>
    );
  }
}

export default App;