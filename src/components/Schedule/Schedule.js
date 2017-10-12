import React, { Component } from 'react'
import { Panel, ProgressBar } from 'react-bootstrap'

import './Schedule.css';

export default class Schedule extends Component{
  constructor(props){
    super(props);
    this.state = {percent: 0, blocks: [], intervalId: 0};
    this.createBlocks = this.createBlocks.bind(this);
    this.startCounter = this.startCounter.bind(this);
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

  createBlocks(blockArray, currentBlock){
    if(typeof blockArray !== 'undefined' && blockArray !== null){
      let blocks = [];
      let counter = 0;
      blockArray.forEach((block) => {
        if (block === currentBlock) {
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
      <Panel header="Schedule" bsStyle="danger">
        <div className="schedule-panel">
          {this.state.blocks}
        </div>
        <ProgressBar active={barPercent < 100} striped bsStyle="danger" now={barPercent} label={`${barPercent}%`}/>
      </Panel>
    )
  }
}