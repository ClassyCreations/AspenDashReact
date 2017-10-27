import React, { Component } from 'react';
import { Panel, Col } from 'react-bootstrap';
import './BlockTimer.css'

export default class BlockTimer extends Component{
  constructor(){
    super();
    this.state = {currentPercent: 0, nextPercent: 0, nextEvent: 'Loading', timer: 0, intervalIndex: 0};
    this.startLoop = this.startLoop.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  componentWillUnmount(){
    //Get rid of any running functions before unmounting to avoid errors
    clearInterval(this.state.intervalIndex);
  }

  componentWillReceiveProps(){
    //Wait to start the countdown until the schedule is received
    setTimeout(() => {
      clearInterval(this.state.intervalIndex);
      this.startLoop();
    }, 1);
  }

  getNumberIndex(array, number){
    //Get the next number that is less than the current percent value
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
    const percents = this.props.percents;
    const classes = this.props.classes;
    //Each day corresponds to a schedule depending on which advisory there is
    if(currentWeekDay === 2) {
      const blockNumber = this.getNumberIndex(percents.tuesday, currentPercent);
      if(blockNumber !== false) {
        nextEvent = classes.tuesday(this.props.schedule)[blockNumber];
        nextPercent = percents.tuesday[blockNumber];
      }else{
        nextEvent = "Start of School";
        nextPercent = 100;
      }
    }else if(currentWeekDay === 4) {
      const blockNumber = this.getNumberIndex(percents.thursday, currentPercent);
      if(blockNumber !== false) {
        nextEvent = classes.thursday(this.props.schedule)[blockNumber];
        nextPercent = percents.thursday[blockNumber];
      }else{
        nextEvent = "Start of School";
        nextPercent = 100;
      }
    }else{
      const blockNumber = this.getNumberIndex(percents.regular, currentPercent);
      if(blockNumber !== false) {
        nextEvent = classes.regular(this.props.schedule)[blockNumber];
        nextPercent = percents.regular[blockNumber];
      }else{
        nextEvent = "Start of School";
        nextPercent = 100;
      }
    }
    this.setState({
      currentPercent: currentPercent,
      nextPercent: nextPercent,
      nextEvent: nextEvent
    });
    this.startTimer(currentPercent, nextPercent);
  }

  startTimer(current, next){
    //Stop any current timer before starting a new one
    clearInterval(this.state.intervalIndex);
    //dayTime(length of the day in seconds) is multiplied by the difference between the current percent
    //and next event percent in order to calculate the time until the next event
    const dayTime = (new Date().setHours(14, 11, 0, 0) - new Date().setHours(7, 45, 0, 0))/1000;
    const diff = next-current;
    const timeDiff = (diff/100)*dayTime;
    this.setState({timer: timeDiff});
    const interval = setInterval(() => {
      this.setState({timer: this.state.timer - 1});
      if(this.state.timer < 0){
        this.props.refresh();
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