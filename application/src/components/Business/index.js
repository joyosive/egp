/**
 *  src/components/Business/index.js
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

import BusinessList from './businessList';
import BusinessCreate from './businessCreate';
import BusinessCreateLink from './businessCreateLink';
import BusinessEdit from './businessEdit';
import BusinessEditLink from './businessEditLink';
import BusinessView from './businessView';
import BusinessViewLink from './businessViewLink';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

class BusinessBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      businesses: [],
      error: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          this.props.firebase.businesses().where('businessOwner', '==', authUser.uid).get()
            .then(querySnapshot => {
              let businesses = [];

              querySnapshot.forEach(doc =>
                businesses.push({ ...doc.data(), uid: doc.id }),
              );

              this.setState({ businesses });
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
    const{ businesses } = this.state;
    return(
      <div>
        <h1>Business</h1>
        <BusinessCreateLink />
        <BusinessList businesses={businesses} />
        <p>This page is only accessible to registered, signed in Businesses.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.BUSINESS];

const Business = compose(
  withFirebase,
  withAuthorization(condition),
)(BusinessBase);

export default Business;

export { BusinessCreate, BusinessCreateLink, BusinessEdit, BusinessEditLink, BusinessView, BusinessViewLink };