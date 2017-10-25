import React, { Component } from 'react';
import { Panel, Col} from 'react-bootstrap';
import './BlockTimer.css'

const tuesdayAdvisoryPercents = [
  14.766839378238341,
  15.544041450777202,
  29.015544041450774,
  29.792746113989637,
  43.26424870466321,
  43.26424870466321,
  63.212435233160626,
  63.98963730569949,
  77.46113989637306,
  78.23834196891191,
  86.01036269430051,
  86.78756476683938,
  100,
];
const tuesdayAdvisoryClasses = (blocks) => {
  return [
    blocks[0]+' End',
    blocks[1]+' Start',
    blocks[1]+' End',
    blocks[2]+' Start',
    blocks[2]+' End',
    blocks[3]+' Start',
    blocks[3]+' End',
    blocks[4]+' Start',
    blocks[4]+' End',
    'Adv Start',
    'Adv End',
    blocks[5]+' Start',
    blocks[5]+' End',
  ];
}

//TODO: Second Lunch 11:20
//TODO: Third Lunch 11:51
const regularDayPercents = [
  16.06217616580311,
  16.83937823834197,
  31.606217616580313,
  32.38341968911917,
  47.15025906735752,
  47.66839378238342,
  68.9119170984456,
  69.68911917098445,
  84.4559585492228,
  85.23316062176166,
  100,
];
const regularDayClasses = (blocks) => {
  return [
    blocks[0]+' End',
    blocks[1]+' Start',
    blocks[1]+' End',
    blocks[2]+' Start',
    blocks[2]+' End',
    blocks[3]+' Start',
    blocks[3]+' End',
    blocks[4]+' Start',
    blocks[4]+' End',
    blocks[5]+' Start',
    blocks[5]+' End',
  ];
}

const thursdayAdvisoryPercents = [
  14.766839378238341,
  15.544041450777202,
  29.015544041450774,
  29.792746113989637,
  37.56476683937824,
  38.34196891191709,
  51.813471502590666,
  51.813471502590666,
  72.279792746114,
  73.05699481865285,
  86.01036269430051,
  86.78756476683938,
  100,
];
const thursdayAdvisoryClasses = (blocks) => {
  return [
    blocks[0]+' End',
    blocks[1]+' Start',
    blocks[1]+' End',
    'Adv Start',
    'Adv End',
    blocks[2]+' Start',
    blocks[2]+' End',
    blocks[3]+' Start',
    blocks[3]+' End',
    blocks[4]+' Start',
    blocks[4]+' End',
    blocks[5]+' Start',
    blocks[5]+' End',
  ];
}


export default class BlockTimer extends Component{
  constructor(){
    super();
    this.state = {currentPercent: 0, nextPercent: 0, nextEvent: '', timer: 0, intervalIndex: 0};
    this.startLoop = this.startLoop.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalIndex);
  }

  componentWillReceiveProps(){
    setTimeout(() => {
      clearInterval(this.state.intervalIndex);
      this.startLoop();
    }, 1);
  }

  getNumberIndex(array, number){
    array.forEach(number => {
      if(typeof number !== "number"){
        return false;
      }
    });
    for(let i = 0; i < array.length; i++){
      if(number < array[i]){
        return i;
      }
    }
    return false;
  };

  startLoop(){
    const currentWeekDay = new Date().getDay();
    const currentPercent = ((new Date() - new Date().setHours(7, 45, 0, 0)) / (new Date().setHours(14, 11, 0, 0) - new Date().setHours(7, 45))) * 100;
    let nextEvent;
    let nextPercent;
    if(currentWeekDay === 2) {
      const blockNumber = this.getNumberIndex(tuesdayAdvisoryPercents, currentPercent);
      if(blockNumber !== false) {
        nextEvent = tuesdayAdvisoryClasses(this.props.schedule)[blockNumber];
        nextPercent = tuesdayAdvisoryPercents[blockNumber];
      }else{
        nextEvent = "Start of School";
        nextPercent = 100;
      }
    }else if(currentWeekDay === 4) {
      const blockNumber = this.getNumberIndex(thursdayAdvisoryPercents, currentPercent);
      if(blockNumber !== false) {
        nextEvent = thursdayAdvisoryClasses(this.props.schedule)[blockNumber];
        nextPercent = thursdayAdvisoryPercents[blockNumber];
      }else{
        nextEvent = "Start of School";
        nextPercent = 100;
      }
    }else{
      const blockNumber = this.getNumberIndex(regularDayPercents, currentPercent);
      if(blockNumber !== false) {
        nextEvent = regularDayClasses(this.props.schedule)[blockNumber];
        nextPercent = regularDayPercents[blockNumber];
      }else{
        nextEvent = "Start of School";
        nextPercent = 100;
      }
    }
    if(nextPercent !== this.state.nextPercent) {
      this.setState({
        currentPercent: currentPercent,
        nextPercent: nextPercent,
        nextEvent: nextEvent
      });
      this.startTimer(currentPercent, nextPercent);
    }
  }

  startTimer(current, next){
    const dayTime = (new Date().setHours(14, 11, 0, 0) - new Date().setHours(7, 45, 0, 0))/1000;
    const diff = next-current;
    const timeDiff = (diff/100)*dayTime;
    this.setState({timer: timeDiff});
    const interval = setInterval(() => {
      this.setState({timer: this.state.timer - 1});
      if(this.state.timer < 0){
        clearInterval(interval);
        this.startLoop();
      }
      //TODO: Check to make sure this works.
    }, 1000);
    this.setState({intervalIndex: interval});
  }

  timeToString(time){
    if(typeof time !== 'number'){
      return time;
    }
    if(time < 0){
      return 0+" seconds";
    }
    const seconds = time%60;
    const mins = ((time-seconds)/60)%60;
    const hours = (time-mins*60-seconds)/3600;

    if(mins === 0){
      return seconds+"s";
    }else if(hours === 0){
      return mins+" minutes, "+seconds+" seconds";
    }else{
      return hours+"h "+mins+"m "+seconds+"s";
    }
  }

  render(){
    return(
      <Col sm={this.props.size}>
        <Panel bsStyle="danger" header={this.state.nextEvent} className="block-timer-panel">
          {this.timeToString(Math.round(this.state.timer))}
        </Panel>
      </Col>
    )
  }
}