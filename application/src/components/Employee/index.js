/**
 *  src/components/Employee/index.js
 * 
 *  e-GP System with Hyperledger Fabric
 *  
 *  Copyright (C) 2019  Kevin Marekia Kiringu (kmarekia@students.uonbi.ac.ke)
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React, { Component } from 'react';

import EmployeeRegister from './employeeRegister';
import EmployeeRegisterLink from './employeeRegisterLink';
import EmployeeEdit from './employeeEdit';
import EmployeeEditLink from './employeeEditLink';

import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = { id: '', employerID: null };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          let id = authUser.uid;

          this.props.firebase.user(id)
            .get()
            .then(doc => {
              let userDetails = doc.data(); // get useDetails
              let employerID = userDetails.employerID; // get employerID from userDetails

              this.setState({ employerID });
            })
            .catch(error => {
              this.setState({ error });
            });
          
          this.setState({ id });
        }
      }
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const{ id, employerID } = this.state;
    return(
      <div>
        <h1>Employee</h1>
        {employerID ? (
          <EmployeeEditLink id={id} />
        ) : (
          <EmployeeRegisterLink />
        )}
        <p>This page is only accessible to registered, signed in Employees.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.EMPLOYEE];

export default withAuthorization(condition)(Employee);

export { EmployeeRegister, EmployeeRegisterLink, EmployeeEdit, EmployeeEditLink };