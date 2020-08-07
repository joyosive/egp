/**
 *  src/components/Tender/tenderView.js
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
  tenderID: '',
  tenderDocument: '',
  description: '',
  validityPeriod: '',
  budget: '',
  status: '',
  createdOn: '',
  lastModified: '',
  error: null,
}

class TenderViewBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.unixTime = this.unixTime.bind(this);
  }

  unixTime(unixtime) {
    // format time
    var u = new Date(unixtime*1000);

    return u.getUTCFullYear() +
      '-' + ('0' + u.getUTCMonth()).slice(-2) +
      '-' + ('0' + u.getUTCDate()).slice(-2) + 
      ' ' + ('0' + u.getUTCHours()).slice(-2) +
      ':' + ('0' + u.getUTCMinutes()).slice(-2) +
      ':' + ('0' + u.getUTCSeconds()).slice(-2) +
      '.' + (u.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) 
  };


  componentDidMount() {
    const { id } = this.props.match.params;

    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          this.props.firebase.tender(id).get()
            .then(doc => {
              if (!doc.exists) {
                let error = []; 
                error.message = 'There is no such Tender';
                this.setState({ error });
              } else {
                const data = doc.data();

                let createdOnTimestamp = new Date(data.createdOn.seconds);
                let createdOn = this.unixTime(createdOnTimestamp);
                console.log(createdOn);

                let lastModifiedTimestamp = new Date(data.createdOn.seconds);
                let lastModified = this.unixTime(lastModifiedTimestamp);
                console.log(lastModified);
                
                this.setState({
                  tenderID: data.tenderID,
                  tenderDocument: '',
                  description: data.description,
                  validityPeriod: data.validityPeriod,
                  budget: data.budget,
                  status: data.status,
                  createdOn,
                  lastModified,
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

  render() {
    const {
      // tenderDocument,
      tenderID,
      tenderDocument,
      description,
      validityPeriod,
      budget,
      status,
      createdOn,
      lastModified,
      error,
    } = this.state;

    return (
      <div>
        <h1>TenderView</h1>

        <p>Tender ID: {tenderID}</p>
        <p>Tender Document: {tenderDocument}</p>
        <p>Description: {description}</p>
        <p>Validity Period: {validityPeriod}</p>
        <p>Budget: {budget}</p>
        <p>Status: {status}</p>
        <p>Created On: {createdOn}</p>
        <p>Last Modified On: {lastModified}</p>

        {error && <p>{error.message}</p>}

        <p>This page is only accessible to registered, signed in Tenders.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !! authUser.roles[ROLES.PROCURING_ENTITY];

const TenderView = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
)(TenderViewBase);

export default TenderView;