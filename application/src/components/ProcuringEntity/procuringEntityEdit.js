/**
 *  src/components/ProcuringEntity/procuringEntityEdit.js
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
  id: '',
  entityName: '',
  entityType: '',
  physicalAddress: '',
  telephone: '',
  postalAddress: '',
  emailAddress: '',
  websiteURL: '',
  accountingOfficer: '',
  authUserUID: '',
  error: null,
}

class ProcuringEntityEditBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          this.props.firebase.procuringEntity(id).get()
            .then(doc => {
              if (!doc.exists) {
                let error = []; 
                error.message = 'There is no such Procuring Entity';
                this.setState({ error });
              } else {
                const data = doc.data();

                this.setState({
                  entityName: data.entityName,
                  entityType: data.entityType,
                  physicalAddress: data.physicalAddress,
                  telephone: data.telephone,
                  postalAddress: data.postalAddress,
                  emailAddress: data.emailAddress,
                  websiteURL: data.websiteURL,
                  accountingOfficer: data.accountingOfficer,
                  authUserUID: authUser.uid,
                });
              }    
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
    const { id } = this.props.match.params;
    const { entityName, entityType, physicalAddress, telephone, postalAddress, emailAddress, websiteURL, accountingOfficer, authUserUID } = this.state;

    if (accountingOfficer === authUserUID) { // if user has permission to edit ...
      this.props.firebase.procuringEntity(id).update({
        entityName,
        entityType,
        physicalAddress,
        telephone,
        postalAddress,
        emailAddress,
        websiteURL,
      })
      .then(() => {
        console.log('Updated Procuring Entity.');
      })
      .then(() => {
        this.props.history.push(ROUTES.PROCURING_ENTITY);
      })
      .catch(error => {
        this.setState({ error });
      });
    } else {
      let error = []; 
      error.message = 'You do not have permission to edit this Procuring Entity';
      this.setState({ error });
    }

    event.preventDefault();
  }

  render() {
    const {
      entityName,
      entityType,
      physicalAddress,
      telephone,
      postalAddress,
      emailAddress,
      websiteURL,
      accountingOfficer, 
      authUserUID,
      error,
    } = this.state;

    const isInvalid =
      entityName === '' ||
      entityType === '' ||
      accountingOfficer !== authUserUID;
    
    return (
      <div>
        <h1>ProcuringEntityEdit</h1>

        <form onSubmit={this.onSubmit}>
          <input
            name="entityName"
            value={entityName}
            onChange={this.onChange}
            type="text"
            placeholder="Entity Name"
          />
          <input
            name="entityType"
            value={entityType}
            onChange={this.onChange}
            type="text"
            placeholder="Entity Type"
          />
          <input
            name="physicalAddress"
            value={physicalAddress}
            onChange={this.onChange}
            type="text"
            placeholder="Physical Address"
          />
          <input
            name="telephone"
            value={telephone}
            onChange={this.onChange}
            type="text"
            placeholder="Telephone"
          />
          <input
            name="postalAddress"
            value={postalAddress}
            onChange={this.onChange}
            type="text"
            placeholder="Postal Address"
          />
          <input
            name="emailAddress"
            value={emailAddress}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <input
            name="websiteURL"
            value={websiteURL}
            onChange={this.onChange}
            type="text"
            placeholder="websiteURL"
          />
          
          <button disabled={isInvalid} type="submit">
            Update Procuring Entity
          </button>

          {error && <p>{error.message}</p>}
        </form>

        <p>This page is only accessible to registered, signed in Procuring Entities.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.PROCURING_ENTITY];

const ProcuringEntityEdit = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
)(ProcuringEntityEditBase);

export default ProcuringEntityEdit;