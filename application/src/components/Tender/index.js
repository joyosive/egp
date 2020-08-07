/**
 *  src/components/Tender/index.js
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

import TenderList from './tenderList';
import TenderCreate from './tenderCreate';
import TenderCreateLink from './tenderCreateLink';
import TenderEdit from './tenderEdit';
import TenderEditLink from './tenderEditLink';
import TenderView from './tenderView';
import TenderViewLink from './tenderViewLink';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

class TenderBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tenders: [],
      error: null,
    };
  }

  render() {
    const{ tenders } = this.state;
    const { procuringEntityID, procuringEntityName, procuringEntityType } = this.props;

    // get all tenders belonging to this procuring entity
    this.props.firebase.tenders().where('procuringEntityID', '==', procuringEntityID).get()
    .then(querySnapshot => {
      let tenders = [];

      querySnapshot.forEach(doc =>
        tenders.push({ ...doc.data(), uid: doc.id }),
      );

      this.setState({ tenders });
    })
    .catch(error => {
      this.setState({ error });
    });
    
    return(
      <div>
        <h1>Tender</h1>
        <TenderCreateLink procuringEntityID={procuringEntityID} procuringEntityName={procuringEntityName} procuringEntityType={procuringEntityType} />
        <TenderList tenders={tenders} />
        <p>This page is only accessible to registered, signed in Procuring Entites.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !! authUser.roles[ROLES.PROCURING_ENTITY];

const Tender = compose(
  withFirebase,
  withAuthorization(condition),
)(TenderBase);

export default Tender;

export { TenderCreate, TenderCreateLink, TenderEdit, TenderEditLink, TenderView, TenderViewLink };