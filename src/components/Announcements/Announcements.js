import React, { Component } from 'react';
import './Announcements.css'

export default class Announcements extends Component{
  constructor(props){
    super(props);
    this.state = {announcement: <li>Nothing to report, sir!</li>, announcementIndex: 0, cycleIndex: 0, paused: false, barCycleIndex: 0, barPercent: 0};
    this.startCycle = this.startCycle.bind(this);
    this.pauseCycle = this.pauseCycle.bind(this);
    this.unpauseCycle = this.unpauseCycle.bind(this);
    this.setAnnouncement = this.setAnnouncement.bind(this);
    this.incrementAnnouncement = this.incrementAnnouncement.bind(this);
    this.decrementAnnouncement = this.decrementAnnouncement.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.startBarCycle = this.startBarCycle.bind(this);
    this.stopBarCycle = this.stopBarCycle.bind(this);
  }

  componentDidMount(){
    if(typeof this.props.announcements !== 'undefined'){
      setTimeout(() => {
        this.startCycle();
      }, 10)
    }
  }

  componentWillReceiveProps(){
    setTimeout(() => {
      if(typeof this.props.announcements !== 'undefined' && this.state.cycleIndex === 0){
        this.startCycle();
      }
    }, 10)
  }

  componentWillUnmount(){
    clearInterval(this.state.cycleIndex);
    clearInterval(this.state.barCycleIndex);
  }

  startCycle(){
    if(this.props.announcements.length > 0) {
      this.setAnnouncement(0);
      this.startBarCycle();
      const index = setInterval(() => {
        this.setAnnouncement(this.state.announcementIndex + 1);
      }, this.props.cycleTime);
      this.setState({cycleIndex: index, paused: false});
    }
  }

  pauseCycle(){
    this.stopBarCycle();
    clearInterval(this.state.cycleIndex);
    this.setState({paused: true});
  }

  unpauseCycle(){
    if(this.state.paused === true){
      this.startBarCycle();
      const index = setInterval(() => {
        this.setAnnouncement(this.state.announcementIndex + 1);
      }, this.props.cycleTime);
      this.setState({cycleIndex: index, paused: false});
    }
  }

  startBarCycle(){
    const progressIteration = 1000/this.props.cycleTime;
    let barIndex = setInterval(() => {
      if(this.state.barPercent < 100) {
        this.setState({barPercent: this.state.barPercent + progressIteration});
      }
    }, 10);
    this.setState({barCycleIndex: barIndex});
  }

  stopBarCycle(){
    clearInterval(this.state.barCycleIndex);
    this.setState({barPercent: 0});
  }

  setAnnouncement(index){
    const announcements = this.props.announcements;
    this.setState({barPercent: 0});
    if(index < 0){
      index = announcements.length - 1;
    }else if(index > announcements.length - 1){
      index = 0;
    }
    this.setState({announcement: <li><span className='announcement-title'>{announcements[index].title}: </span><span className='announcement-description'>{announcements[index].description}</span></li>, announcementIndex: index});
  }

  incrementAnnouncement(){
    this.pauseCycle();
    this.setAnnouncement(this.state.announcementIndex + 1);
  }

  decrementAnnouncement(){
    this.pauseCycle();
    this.setAnnouncement(this.state.announcementIndex - 1);
  }

  togglePause(){
    if(this.state.paused){
      this.unpauseCycle();
    }else{
      this.pauseCycle();
    }
  }

  render(){
    let displayButtons = this.props.displayButtons;
    if(typeof displayButtons === "undefined"){
      displayButtons = true;
    }
    let announcementIndex;
    if(typeof this.props.announcements !== 'undefined'){
      announcementIndex = `${this.state.announcementIndex+1}/${this.props.announcements.length}`
    }else{
      announcementIndex = <p/>
    }
    return(
      this.props.hidden ?
        <div className="panel panel-danger announcements">
          <div className="panel-heading announcements-heading">
            <div className="panel-heading">Announcements <small className="announcements-index">{announcementIndex}</small></div>
            {displayButtons?
              <div className="announcements-buttons-container">
                <div className="announcement-button arrow-icon" onClick={this.decrementAnnouncement}>
                  <i className="fa fa-arrow-left"></i>
                </div>
                <div className="announcement-button" onClick={this.togglePause}>
                  {this.state.paused ?
                    <i className="fa fa-play" id="pause-button"></i>
                    :
                    <i className="fa fa-pause" id="pause-button"></i>
                  }
                </div>
                <div className="announcement-button arrow-icon" onClick={this.incrementAnnouncement}>
                  <i className="fa fa-arrow-right"></i>
                </div>
              </div>
              :
              <div/>
            }
          </div>
          <div className="announcements-progress">
            <div className="announcements-progress-bar progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width: this.state.barPercent+"%"}}></div>
          </div>
          <div className="panel-body announcements-body">
            <ul className="announcements-list">
              {this.state.announcement}
            </ul>
          </div>
        </div>
        :
        <div/>
    )
  }
};