import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import moment from 'moment';

import './Title.css'

export default class Title extends Component{
  render(){
    let m;
    if(this.props.asOf !== 0) {
      const date = new Date(this.props.asOf * 1000);
      m = moment(date).format('h:mm a');
    }else{
      m = "";
    }
    return(
      this.props.hidden ?
        <PageHeader className="page-title">Day {this.props.dayNumber !== null ? `${this.props.dayNumber}'s ` : ' '}Information <small className="smallText">{m}</small></PageHeader>
        :
        <div/>
    )
  }
}