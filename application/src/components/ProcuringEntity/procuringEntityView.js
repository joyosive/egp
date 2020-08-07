/**
 *  src/components/ProcuringEntity/procuringEntityView.js
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
import { compose } from 'recompose';

import Tender from '../Tender';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
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
  error: null,
}

class ProcuringEntityViewBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.firebase.procuringEntity(id).get()
      .then(doc => {
        if (!doc.exists) {
          let error = []; 
          error.message = 'There is no such Procuring Entity';
          this.setState({ error });
        } else {
          const data = doc.data();
          this.setState({
            id,
            entityName: data.entityName,
            entityType: data.entityType,
            physicalAddress: data.physicalAddress,
            telephone: data.telephone,
            postalAddress: data.postalAddress,
            emailAddress: data.emailAddress,
            websiteURL: data.websiteURL,
            accountingOfficer: data.accountingOfficer,
          });
        }    
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  render() {
    const {
      id,
      entityName,
      entityType,
      physicalAddress,
      telephone,
      postalAddress,
      emailAddress,
      websiteURL,
      accountingOfficer,
      error,
    } = this.state;

    return(
      <div>
        <h1>ProcuringEntityView</h1>

        <section>
          <p>Entity Name: {entityName}</p>
          <p>Entity Type: {entityType}</p>
          <p>Physical Address: {physicalAddress}</p>
          <p>Telephone: {telephone}</p>
          <p>Postal Address: {postalAddress}</p>
          <p>Email Address: {emailAddress}</p>
          <p>Website URL: {websiteURL}</p>
          <p>Accounting Officer: {accountingOfficer}</p>

          <Tender procuringEntityID={id} procuringEntityName={entityName} procuringEntityType={entityType} />

          {error && <p>{error.message}</p>}
        </section>

        <p>This page is only accessible to registered, signed in Procuring Entities.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.PROCURING_ENTITY];

const ProcuringEntityView = compose(
  withFirebase,
  withAuthorization(condition),
)(ProcuringEntityViewBase);

export default ProcuringEntityView;