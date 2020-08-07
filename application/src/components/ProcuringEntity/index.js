/**
 *  src/components/ProcuringEntity/index.js
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

import ProcuringEntityList from './procuringEntityList';
import ProcuringEntityCreate from './procuringEntityCreate';
import ProcuringEntityCreateLink from './procuringEntityCreateLink';
import ProcuringEntityEdit from './procuringEntityEdit';
import ProcuringEntityEditLink from './procuringEntityEditLink';
import ProcuringEntityView from './procuringEntityView';
import ProcuringEntityViewLink from './procuringEntityViewLink';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

class ProcuringEntityBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      procuringEntites: [],
      error: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          this.props.firebase.procuringEntities().where('accountingOfficer', '==', authUser.uid).get()
            .then(querySnapshot => {
              let procuringEntites = [];

              querySnapshot.forEach(doc =>
                procuringEntites.push({ ...doc.data(), uid: doc.id }),
              );

              this.setState({ procuringEntites });
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
    const{ procuringEntites } = this.state;
    return(
      <div>
        <h1>ProcuringEntity</h1>
        <ProcuringEntityCreateLink />
        <ProcuringEntityList procuringEntites={procuringEntites} />
        <p>This page is only accessible to registered, signed in Procuring Entities.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.PROCURING_ENTITY];

const ProcuringEntity = compose(
  withFirebase,
  withAuthorization(condition),
)(ProcuringEntityBase);

export default ProcuringEntity;

export { ProcuringEntityCreate, ProcuringEntityCreateLink, ProcuringEntityEdit, ProcuringEntityEditLink, ProcuringEntityView, ProcuringEntityViewLink };