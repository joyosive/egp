/**
 *  src/components/Tender/tenderCreate.js
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
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  /* tender specific information */
  tenderId: '',
  tenderDocument: '',
  description: '',
  validityPeriod: '',
  budget: '',
  status: '',
  createdOn: '',
  lastModified: '',
  error: null,
}

class TenderCreateBase extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      /* procuring entity information */
      procuringEntityID: '',
      procuringEntityName: '',
      procuringEntityType: '',
      tenderAccountingOfficer: '',
      ...INITIAL_STATE,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          const { procuringEntityID, procuringEntityName, procuringEntityType } = this.props.location; // get procuring entity id, name, type
          let tenderAccountingOfficer = authUser.uid; // accounting officer id
          let status = 1;
          let createdOn = this.props.firebase.fieldValue.serverTimestamp();
          let lastModified = this.props.firebase.fieldValue.serverTimestamp();
          
          this.setState({ procuringEntityID, procuringEntityName, procuringEntityType, tenderAccountingOfficer, status, createdOn, lastModified });
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
    const { procuringEntityID, procuringEntityName, procuringEntityType, tenderAccountingOfficer, description, validityPeriod, budget, status, createdOn, lastModified } = this.state;

    this.props.firebase.tenders().add({
        procuringEntityID,
        procuringEntityName,
        procuringEntityType,
        tenderAccountingOfficer,
        description,
        validityPeriod,
        budget,
        status,
        createdOn,
        lastModified,
      })
      .then(ref => {
        this.props.firebase.tender(ref.id).update({
          tenderID: ref.id,
        })
        .then(() => {
          console.log('Created a new Tender with ID: ', ref.id);
        });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  render() {
    const {
      description,
      validityPeriod,
      budget,
      error,
    } = this.state;

    const isInvalid =
      description === '' ||
      validityPeriod === '' ||
      budget === '';

    return (
      <div>
        <h1>TenderCreate</h1>

        <form onSubmit={this.onSubmit}>
          <input
            name="description"
            value={description}
            onChange={this.onChange}
            type="text"
            placeholder="Description"
          />
          <input
            name="validityPeriod"
            value={validityPeriod}
            onChange={this.onChange}
            type="number"
            placeholder="Validity Period (In Days)"
          />
          <input
            name="budget"
            value={budget}
            onChange={this.onChange}
            type="number"
            placeholder="Budget (KES)"
          />
          
          <button disabled={isInvalid} type="submit">
            Create Tender
          </button>

          {error && <p>{error.message}</p>}
        </form>

        <p>This page is only accessible to registered, signed in Tenders.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !! authUser.roles[ROLES.PROCURING_ENTITY];

const TenderCreate = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
)(TenderCreateBase);

export default TenderCreate;