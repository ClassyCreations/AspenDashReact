import React, { Component } from 'react';
import { Panel, Col } from 'react-bootstrap';
import request from 'request'
import './Lunch.css';

export default class Lunch extends Component{
  constructor(){
    super();
    this.state = {special: 'Loading...', loaded: false};
  }

  componentDidMount(){
    this.getLunchInfo();
    if(this.state.loaded !== true) {
      setInterval(this.getLunchInfo(), 600000);
    }
  }

  getLunchInfo(){
    request.get('https://cors-anywhere.herokuapp.com/melroseschools.nutrislice.com/menu/api/weeks/school/melrose/menu-type/lunch/'+new Date().getFullYear()+'/00/00/?format=json', (err, res, body) => {
      body = JSON.parse(body);
      //TODO: Fix when no internet
      const item = body.days[new Date().getDay()].menu_items[1];
      if(typeof item !== 'undefined'){
        this.setState({special: item.food.name, loaded: true});
      }else{
        this.setState({special: 'No Lunch Served'});
      }
    })
  }

  render(){
    //3: 4
    //1: 12
    //2: 6
    return(
      <Col sm={this.props.size}>
        <Panel bsStyle="danger" header="Lunch Special" className="lunch-panel">
          {this.state.special}
        </Panel>
      </Col>
    )
  }
}