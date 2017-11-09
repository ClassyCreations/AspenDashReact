import React, { Component } from 'react'
import { Panel, ProgressBar } from 'react-bootstrap'

import './Schedule.css';

//These map the day percent to a value in the schedule array.
const tuesdayPercentMap = [
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  3,
  3,
  3,
  3,
  4,
  4,
  9,
  9,
  5,
  5,
];

const thursdayPercentMap = [
  0,
  1,
  1,
  9,
  9,
  2,
  2,
  3,
  3,
  3,
  3,
  3,
  3,
  4,
  4,
  5,
  5,
];

const regularPercentMap = [
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  3,
  3,
  3,
  3,
  4,
  4,
  5,
  5,
];

export default class Schedule extends Component{
  constructor(props){
    super(props);
    this.state = {percent: 0, blocks: [], intervalId: 0};
    this.createBlocks = this.createBlocks.bind(this);
    this.startCounter = this.startCounter.bind(this);
    this.refresh = this.refresh.bind(this);
    this.getBlockNumber = this.getBlockNumber.bind(this);
  }

  refresh(){
    //TODO: Potential large issue: In order to increase efficiency, refresh is only called when a block changes. Due to the update time, this may not actually change the current block
    this.startCounter();
    if(typeof this.props.schedule !== 'undefined'){
      setTimeout(() => {
        this.createBlocks(this.props.schedule, this.props.currentBlock);
      }, 10)
    }
  }

  componentDidMount(){
    this.startCounter();
    if(typeof this.props.schedule !== 'undefined'){
      setTimeout(() => {
        this.createBlocks(this.props.schedule, this.props.currentBlock);
      }, 10)
    }
  }

  componentWillReceiveProps(){
    setTimeout(() => {
      this.createBlocks(this.props.schedule, this.props.currentBlock);
    }, 10)
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalId);
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

  getBlockNumber(){
    const currentWeekDay = new Date().getDay();
    const currentPercent = ((new Date() - new Date().setHours(7, 45, 0, 0)) / (new Date().setHours(14, 11, 0, 0) - new Date().setHours(7, 45))) * 100;
    const percents = this.props.percents;
    //Each day corresponds to a schedule depending on which advisory there is
    if(currentWeekDay === 2) {
      const blockNumber = this.getNumberIndex(percents.tuesday, currentPercent);
      if(blockNumber !== false) {
        return tuesdayPercentMap[blockNumber];
      }else{
        return 9;
      }
    }else if(currentWeekDay === 4) {
      const blockNumber = this.getNumberIndex(percents.thursday, currentPercent);
      if(blockNumber !== false) {
        return thursdayPercentMap[blockNumber];
      }else{
        return 9;
      }
    }else{
      const blockNumber = this.getNumberIndex(percents.regular, currentPercent);
      if(blockNumber !== false) {
        return regularPercentMap[blockNumber];
      }else{
        return 9;
      }
    }
  }

  createBlocks(blockArray){
    const currentBlock = this.getBlockNumber();
    if(typeof blockArray !== 'undefined' && blockArray !== null){
      let blocks = [];
      let counter = 0;
      blockArray.forEach((block) => {
        if (counter === currentBlock) {
          blocks.push(<div key={counter} className='block-container' style={{fontWeight:"Bolder", backgroundColor: "#fee9e9"}}>{block}</div>);
        } else {
          blocks.push(<div key={counter} className='block-container'>{block}</div>);
        }
        counter++;
      });
      this.setState({blocks: blocks});
    }else{
      this.setState({blocks: <div></div>})
    }
  }

  startCounter(){
    const start = new Date().setHours(7, 45); //TODO: make this dynamic
    const end = new Date().setHours(14, 11);
    const startPercent = (new Date()-start)/(end - start)*100;
    this.setState({percent: startPercent});
    const interval = setInterval(() => {
      const start = new Date().setHours(7, 45); //TODO: make this dynamic
      const end = new Date().setHours(14, 11);
      this.setState({percent: (new Date()-start)/(end - start)*100});
    }, 1000);
    this.setState({intervalId: interval});
  }

  render(){
    const barPercent = this.state.percent > 100 ? 100 : Math.round(this.state.percent);
    return(
      this.props.hidden ?
        <Panel header="Schedule" bsStyle="danger">
          <div className="schedule-panel">
            {this.state.blocks}
          </div>
          <ProgressBar active={barPercent < 100} striped bsStyle="danger" now={barPercent} label={`${barPercent}%`}/>
        </Panel>
        :
        <div/>
    )
  }
}