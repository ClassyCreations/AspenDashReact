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
      });
    this.getDisplayExceptions = this.getDisplayExceptions.bind(this);
    this.setDisplayException = this.setDisplayException.bind(this);
    this.toggleDisplayException = this.toggleDisplayException.bind(this);
    this.getQueryStringOverrides = this.getQueryStringOverrides.bind(this);
    this.hideCursor = this.hideCursor.bind(this);
    this.refresh = this.refresh.bind(this);
    this.addFocusListener = this.addFocusListener.bind(this);

    this.addFocusListener();
  }

  tuesdayAdvisoryPercents = [
    14.766839378238341, //Block 1 End
    15.544041450777202, //Block 2 Start
    29.015544041450774, //Block 2 End
    29.792746113989637, //Block 3 Start
    43.26424870466321,  //Block 3 End
    43.26424870466321,  //Block 4 Start - Lunch 1 Start
    48.96373056994819,  //Lunch 1 End
    49.740932642487046, //Lunch 2 Start
    55.44041450777202,  //Lunch 2 End
    57.51295336787565,  //Lunch 3 Start
    63.212435233160626, //Block 4 End - Lunch 3 End
    63.98963730569949,  //Block 5 Start
    77.46113989637306,  //Block 5 End
    78.23834196891191,  //Adv Start
    86.01036269430051,  //Adv End
    86.78756476683938,  //Block 6 Start
    100,                //Block 6 End
  ];
  tuesdayAdvisoryClasses = () => {
    const blocks = this.state.schedule;
    return [
      blocks[0]+' End',
      blocks[1]+' Start',
      blocks[1]+' End',
      blocks[2]+' Start',
      blocks[2]+' End',
      blocks[3]+' Start - Lunch 1 Start',
      blocks[3]+' - Lunch 1 End',
      blocks[3]+' - Lunch 2 Start',
      blocks[3]+' - Lunch 2 End',
      blocks[3]+' - Lunch 3 Start',
      blocks[3]+' End - Lunch 3 End',
      blocks[4]+' Start',
      blocks[4]+' End',
      'Adv Start',
      'Adv End - '+blocks[5] + ' Start',
      blocks[5]+' Start',
      blocks[5]+' End',
    ];
};

  regularDayPercents = [
    16.06217616580311, //Block1End
    16.83937823834197, //Block2Start
    31.606217616580313,//Block2End
    32.38341968911917, //Block3Start
    47.15025906735752, //Block3End
    47.66839378238342, //Block4Start - 1st lunch start
    53.36787564766839, //First Lunch End
    55.181347150259064,//Second Lunch Start
    60.880829015544045,//Second Lunch End
    63.212435233160626,//Third Lunch Start
    68.9119170984456,  //Block4End - Third Lunch End
    69.68911917098445, //Block5Start
    84.4559585492228,  //Block5End
    85.23316062176166, //Block6Start
    100,               //Block6End
  ];
  regularDayClasses = () => {
    console.log(this.state.schedule);
    const blocks = this.state.schedule;
    if(!blocks){
      return [].fill('Z', 0, 5)
    }
    return [
      blocks[0]+' End',
      blocks[1]+' Start',
      blocks[1]+' End',
      blocks[2]+' Start',
      blocks[2]+' End',
      blocks[3]+' Start - 1st lunch start',
      blocks[3]+' - 1st lunch end',
      blocks[3]+' - 2nd lunch start',
      blocks[3]+' - 2nd lunch End',
      blocks[3]+' - 3rd lunch start',
      blocks[3]+' End - 3rd lunch end',
      blocks[4]+' Start',
      blocks[4]+' End',
      blocks[5]+' Start',
      blocks[5]+' End',
    ];
};

  thursdayAdvisoryPercents = [
    14.766839378238341, //Block 1 End
    15.544041450777202, //Block 2 Start
    29.015544041450774, //Block 2 End
    29.792746113989637, //Adv Start
    37.56476683937824,  //Adv End
    38.34196891191709,  //Block 3 Start
    51.813471502590666, //Block 3 End
    51.813471502590666, //Block 4 Start - Lunch 1 Start
    57.51295336787565,  //Lunch 1 End
    59.067357512953365, //Lunch 2 Start
    64.76683937823834,  //Lunch 2 End
    66.58031088082902,  //Lunch 3 Start
    72.279792746114,    //Block 4 End - Lunch 3 End
    73.05699481865285,  //Block 5 Start
    86.01036269430051,  //Block 5 End
    86.78756476683938,  //Block 6 Start
    100,                //Block 6 End
  ];
  thursdayAdvisoryClasses = () => {
    const blocks = this.state.schedule;
    return [
      blocks[0]+' End',
      blocks[1]+' Start',
      blocks[1]+' End',
      'Adv Start',
      'Adv End - '+blocks[2] + ' Start',
      blocks[2]+' Start',
      blocks[2]+' End',
      blocks[3]+' Start - Lunch 1 Start',
      blocks[3]+' - Lunch 1 End',
      blocks[3]+' - Lunch 2 Start',
      blocks[3]+' - Lunch 2 End',
      blocks[3]+' - Lunch 3 Start',
      blocks[3]+' End - Lunch 3 End',
      blocks[4]+' Start',
      blocks[4]+' End',
      blocks[5]+' Start',
      blocks[5]+' End',
    ];
};

  percents = {regular: this.regularDayPercents, tuesday: this.tuesdayAdvisoryPercents, thursday: this.thursdayAdvisoryPercents};
  classes = {regular: this.regularDayClasses, tuesday: this.tuesdayAdvisoryClasses, thursday: this.thursdayAdvisoryClasses};

  addFocusListener(){
    //To reload info when the focus shifts to avoid timing issues
    const onchange = () => {
      this.refresh();
    };

    let hidden = "hidden";

    // Standards:
    if (hidden in document) {
      document.addEventListener("visibilitychange", onchange);
    }else if ("mozHidden" in document) {
      document.addEventListener("mozvisibilitychange", onchange);
    }else if ("webkitHidden" in document) {
      document.addEventListener("webkitvisibilitychange", onchange);
    }else if ("msHidden" in document) {
      document.addEventListener("msvisibilitychange", onchange);
      // IE 9 and lower:
    }else if ("onfocusin" in document) {
      document.onfocusin = document.onfocusout = onchange;
      // All others:
    }else {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
    }
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
    this.refresh();
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

  refresh(){
    this.getAspenInfo()
      .then(res => {
        this.setState({aspenLoaded: true, asOf: res.asOf, schedule: res.schedule.blockSchedule, currentBlock: res.schedule.block, dayNumber: res.schedule.day, announcements: res.announcements.hs});
        if(typeof this.refs.scheduleChild !== 'undefined'){
          this.refs.scheduleChild.refresh();
        }
        if(typeof this.refs.dayTimerChild !== 'undefined'){
          this.refs.dayTimerChild.refresh();
        }
        if(typeof this.refs.lunchChild !== 'undefined'){
          this.refs.lunchChild.refresh();
        }
        if(typeof this.refs.blockTimerChild !== 'undefined'){
          this.refs.blockTimerChild.refresh();
        }
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
        <Header hidden={this.state.displayExceptions.header} loaded={this.state.aspenLoaded} setDisplay={this.toggleDisplayException} exceptions={this.state.displayExceptions}/>
        <div className="mainInfoWrapper">
          <PageTitle hidden={this.state.displayExceptions.pageTitle} dayNumber={this.state.dayNumber} asOf={this.state.asOf}/>
          <Schedule hidden={this.state.displayExceptions.schedule} ref="scheduleChild" percents={this.percents} schedule={this.state.schedule}/>
          <Row>
              <DayTimer hidden={this.state.displayExceptions.dayTimer} ref="dayTimerChild" size={size} isHalfDay={false}/>
              <BlockTimer hidden={this.state.displayExceptions.blockTimer} ref="blockTimerChild" classes={this.classes} percents={this.percents} refresh={this.refresh} schedule={this.state.schedule}  size={size}/>
              <Lunch hidden={this.state.displayExceptions.lunch} ref="lunchChild" size={size}/>
          </Row>
            <Announcements hidden={this.state.displayExceptions.announcements} announcements={this.state.announcements} displayButtons={this.state.displayExceptions.announcementsButtons} cycleTime={8000}/>
        </div>
      </div>
    );
  }
}

export default App;