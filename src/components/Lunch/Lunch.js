import React, { Component } from 'react';
import { Panel, Col } from 'react-bootstrap';
import request from 'request'
import './Lunch.css';

export default class Lunch extends Component{
  constructor(){
    super();
    this.state = {special: 'Loading...', loaded: false, oldDate: null};
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount(){
    this.setState({oldDate: new Date()});
    this.getLunchInfo();
  }

  refresh(){
    //If a request has already been made today, don't make another one.
    const today = new Date();
    if(Math.round(Math.abs((this.state.oldDate.getTime() - today.getTime())/(86400000)))){
      this.setState({oldDate: today});
      this.getLunchInfo();
    }
  }

  getLunchInfo(){
    const self = this;
    function onCallback(body){
      console.log(body);
      try{
        const item = body.days[new Date().getDay()].menu_items[1];
        if(typeof item !== 'undefined'){
          self.setState({special: item.food.name, loaded: true});
        }else{
          self.setState({special: 'No Lunch Served'});
        }
      }catch(err){
        self.setState({special: 'Error getting lunch'});
      }
    }

    //TODO: Make this not stupid (Either save the nutrislice response and serve it ourselves or make some other way of this not being stupid)
    request.get('https://melroseschools.nutrislice.com/menu/api/weeks/school/melrose/menu-type/lunch/'+new Date().getFullYear()+'/00/00/?format=json-p&callback=onCallback', (err, res, body) => {
      eval(body);
    })
  }

  render(){
    //3: 4
    //1: 12
    //2: 6
    return(
      this.props.hidden ?
        <Col sm={this.props.size}>
          <Panel bsStyle="danger" header="Lunch Special" className="lunch-panel">
            {this.state.special}
          </Panel>
        </Col>
        :
        <div/>
    )
  }
}