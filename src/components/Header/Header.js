// src/components/App/index.js
import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import './Header.css';

class Header extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}
  constructor(){
    super();
    this.handleSetDisplay = this.handleSetDisplay.bind(this);
  }

  handleSetDisplay(item){
    this.props.setDisplay(item);
  }

  getCheckState(exceptBoolean){
    const checkBoxEmpty = <i className="fa fa-square-o header-check-box" aria-hidden="true"/>;
    const checkBoxChecked = <i className="fa fa-check-square-o header-check-box" aria-hidden="true"/>;
    return exceptBoolean ? checkBoxChecked : checkBoxEmpty
  }

  render() {
    let except = this.props.exceptions;
    return (
      this.props.hidden ?
        <Navbar inverse collapseOnSelect className="header">
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/" className="header-m">{this.props.loaded ? 'M' : <span className="glyphicon glyphicon-refresh spinning"/>}</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} onClick={() => this.handleSetDisplay()}>Melrose High School</NavItem>
              <NavItem eventKey={2} href="/" disabled>Toggle Notifications</NavItem>
              <NavDropdown eventKey={3} title="Display Settings" id="display-settings">
                <MenuItem onClick={() => this.handleSetDisplay('pageTitle')}>Title{this.getCheckState(except.pageTitle)}</MenuItem>
                <MenuItem onClick={() => this.handleSetDisplay('schedule')}>Schedule{this.getCheckState(except.schedule)}</MenuItem>
                <MenuItem onClick={() => this.handleSetDisplay('dayTimer')}>Day Timer{this.getCheckState(except.dayTimer)}</MenuItem>
                <MenuItem onClick={() => this.handleSetDisplay('blockTimer')}>Block Timer{this.getCheckState(except.blockTimer)}</MenuItem>
                <MenuItem onClick={() => this.handleSetDisplay('lunch')}>Lunch{this.getCheckState(except.lunch)}</MenuItem>
                <MenuItem onClick={() => this.handleSetDisplay('announcements')}>Announcements{this.getCheckState(except.announcements)}</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        :
        <div/>
    );
  }
}

export default Header;