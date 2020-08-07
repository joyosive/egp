/**
 *  src/components/Business/businessCreate.js
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
  supplierName: '',
  pinNumber: '',
  businessRegistrationNumber: '',
  businessType: 'Private',
  physicalAddress: '',
  dateRegistered: '',
  pinStatus: 'Active',
  isVATRegistered: 'Yes',
  businessOwner: '',
  error: null,
}

class BusinessCreateBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          this.setState({
            businessOwner: authUser.uid,
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
    const { supplierName, pinNumber, businessRegistrationNumber, businessType, physicalAddress, dateRegistered, pinStatus, isVATRegistered, businessOwner } = this.state;

    this.props.firebase.businesses().add({
        supplierName,
        pinNumber,
        businessRegistrationNumber,
        businessType,
        physicalAddress,
        dateRegistered,
        pinStatus,
        isVATRegistered,
        businessOwner,
      })
      .then(ref => {
        console.log('Created a new Business with ID: ', ref.id);
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.BUSINESS);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
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
      error,
    } = this.state;

    const isInvalid =
      supplierName === '' ||
      pinNumber === '';

    return (
      <div>
        <h1>BusinessCreate</h1>

        <form onSubmit={this.onSubmit}>
          <input
            name="supplierName"
            value={supplierName}
            onChange={this.onChange}
            type="text"
            placeholder="Supplier Name"
          />
          <input
            name="pinNumber"
            value={pinNumber}
            onChange={this.onChange}
            type="text"
            placeholder="Pin Number"
          />
          <input
            name="businessRegistrationNumber"
            value={businessRegistrationNumber}
            onChange={this.onChange}
            type="text"
            placeholder="Business Registration Number"
          />
          Business Type
          <select
            name="businessType"
            onChange={this.onChange}
          >
            {/* if business type is PRIVATE */}
            {businessType === 'Private' &&
              <React.Fragment>
                <option value="Private" selected>Private</option>
                <option value="Public" >Public</option>
              </React.Fragment>
            }
            {/* if business type is PUBLIC */}
            {businessType === 'Public' &&
              <React.Fragment>
                <option value="Private">Private</option>
                <option value="Public" selected >Public</option>
              </React.Fragment>
            }
          </select>
          <input
            name="physicalAddress"
            value={physicalAddress}
            onChange={this.onChange}
            type="text"
            placeholder="Physical Address"
          />
          <input
            name="dateRegistered"
            value={dateRegistered}
            onChange={this.onChange}
            type="text"
            placeholder="Date Registered"
          />
          Pin Status
          <select
            name="pinStatus"
            onChange={this.onChange}
          >
            {/* if pin status is active */}
            {pinStatus === 'Active' &&
              <React.Fragment>
                <option value="Active" selected>Active</option>
                <option value="Inactive" >Inactive</option>
              </React.Fragment>
            }
            {/* if pin status is NOT active */}
            {pinStatus === 'Inactive' &&
              <React.Fragment>
                <option value="Active">Active</option>
                <option value="Inactive" selected >Inactive</option>
              </React.Fragment>
            }
          </select>
          Is VAT Registered?
          <select
            name="isVATRegistered"
            onChange={this.onChange}
          >
            {/* if is VAT registered */}
            {isVATRegistered === 'Yes' &&
              <React.Fragment>
                <option value="Yes" selected>Yes</option>
                <option value="No" >No</option>
              </React.Fragment>
            }
            {/* if is NOT VAT registered */}
            {isVATRegistered === 'No' &&
              <React.Fragment>
                <option value="Yes">Yes</option>
                <option value="No" selected >No</option>
              </React.Fragment>
            }
          </select>
          
          <button disabled={isInvalid} type="submit">
            Create Business
          </button>

          {error && <p>{error.message}</p>}
        </form>

        <p>This page is only accessible to registered, signed in Businesses.</p>
      </div>
    );
  }
}

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.BUSINESS];

const BusinessCreate = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
)(BusinessCreateBase);

export default BusinessCreate;