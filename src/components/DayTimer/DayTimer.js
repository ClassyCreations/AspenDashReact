import React, { Component } from 'react';
import { Panel, Col } from 'react-bootstrap'
import './DayTimer.css';

export default class DayTimer extends Component{
  constructor(){
    super();
    this.state = {time: 0};
    this.getTimeTillEnd = this.getTimeTillEnd.bind(this);
  }

  componentDidMount(){
    this.getTimeTillEnd();
  }

  timeToString(time){
    if(typeof time !== 'number'){
      return time;
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

  getTimeTillEnd(){
    let endTime;
    if(this.props.isHalfDay){
      endTime = new Date().setHours(12, 11, 0, 0, 0);
    }else{
      endTime = new Date().setHours(14, 11, 0, 0, 0);
    }
    let now = new Date().getTime();
    let timeTillEnd = Math.round((endTime-now)/1000);
    if(timeTillEnd < 0){
      timeTillEnd = 0;
    }
    this.setState({time: timeTillEnd});
    setInterval(() => {
      if(this.state.time > 0) {
        this.setState({time: this.state.time - 1});
      }else{
        this.setState({time: "School Out"});
      }
    }, 1000)
  }

  render(){
    return(
      <Col sm={4}>
        <Panel bsStyle="danger" header="End of Day" className="day-timer-panel">
          {this.timeToString(this.state.time)}
        </Panel>
      </Col>
    )
  }
}