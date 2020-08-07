/**
 *  src/components/Employee/employeeRegister.js
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
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  procuringEntities: [],
  procuringEntityID: '',
  employeeID: '',
  employeeEmail: '',
  employeeStaffID: '',
  error: null,
}

class EmployeeRegisterBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          let employeeID = authUser.uid;
          let employeeEmail = authUser.email;

          this.props.firebase.procuringEntities().get()
            .then(querySnapshot => {
              let procuringEntities = [];

              querySnapshot.forEach(doc =>
                procuringEntities.push({ ...doc.data(), uid: doc.id }),
              );
              
              this.setState({ employeeID, employeeEmail, procuringEntities });
            })
            .catch(error => {
              this.setState({ error });
            });
        }
      }
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    const { procuringEntityID, employeeID, employeeEmail, employeeStaffID } = this.state;

    this.props.firebase.employee(procuringEntityID, employeeID).set({
        employeeEmail, 
        employeeStaffID,
      })
      .then(ref => {
        this.props.firebase.user(employeeID).update({
          employerID: procuringEntityID, // add employer id to user profile
        });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.EMPLOYEE);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  render() {
    const {
      procuringEntities,
      procuringEntityID,
      employeeStaffID,
      error,
    } = this.state;
    
    const isInvalid =
      procuringEntityID === '' ||
      employeeStaffID === '';

    return (
      <div>
        <h1>EmployeeRegister</h1>

        <form onSubmit={this.onSubmit}>
          Procuring Entity:
          <select
            name="procuringEntityID"
            onChange={this.onChange}
          >
            <option value={procuringEntityID}>Please select</option>
            {procuringEntities.map(procuringEntity => (
              <option  key={procuringEntity.uid} value={procuringEntity.uid}>{procuringEntity.entityName}</option>
            ))}
          </select>

          <input
            name="employeeStaffID"
            value={employeeStaffID}
            onChange={this.onChange}
            type="text"
            placeholder="Employee Staff ID"
          />
          
          <button disabled={isInvalid} type="submit">
            Register to Procuring Entity
          </button>

          {error && <p>{error.message}</p>}
        </form>

        <p>This page is only accessible to registered, signed in Employees.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.EMPLOYEE];

const EmployeeRegister = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
)(EmployeeRegisterBase);

export default EmployeeRegister;