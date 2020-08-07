/**
 *  src/components/Business/businessView.js
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

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  id: '',
  supplierName: '',
  pinNumber: '',
  businessRegistrationNumber: '',
  businessType: '',
  physicalAddress: '',
  dateRegistered: '',
  pinStatus: '',
  isVATRegistered: '',
  businessOwner: '',
  error: null,
}

class BusinessViewBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.firebase.business(id).get()
      .then(doc => {
        if (!doc.exists) {
          let error = []; 
          error.message = 'There is no such Business';
          this.setState({ error });
        } else {
          const data = doc.data();
          this.setState({
            supplierName: data.supplierName,
            pinNumber: data.pinNumber,
            businessRegistrationNumber: data.businessRegistrationNumber,
            businessType: data.businessType,
            physicalAddress: data.physicalAddress,
            dateRegistered: data.dateRegistered,
            pinStatus: data.pinStatus,
            isVATRegistered: data.isVATRegistered,
            businessOwner: data.businessOwner,
          });
        }    
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  render() {
    const {
      supplierName,
      pinNumber,
      businessRegistrationNumber,
      businessType,
      physicalAddress,
      dateRegistered,
      pinStatus,
      isVATRegistered,
      businessOwner,
      error,
    } = this.state;

    return(
      <div>
        <h1>BusinessView</h1>

        <section>
          <p>Supplier Name: {supplierName}</p>
          <p>Pin Number: {pinNumber}</p>
          <p>Business Registratin Number: {businessRegistrationNumber}</p>
          <p>Business Type: {businessType}</p>
          <p>Physical Address: {physicalAddress}</p>
          <p>Date Registered: {dateRegistered}</p>
          <p>PIN Status: {pinStatus}</p>
          <p>Is VAT Registered: {isVATRegistered}</p>
          <p>Business Owner: {businessOwner}</p>

          {error && <p>{error.message}</p>}
        </section>

        <p>This page is only accessible to registered, signed in Businesses.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.BUSINESS];

const BusinessView = compose(
  withFirebase,
  withAuthorization(condition),
)(BusinessViewBase);

export default BusinessView;