/**
 *  src/components/Business/businessList.js
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
import React from 'react';

import BusinessEditLink from './businessEditLink';
import BusinessViewLink from './businessViewLink';

import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

const BusinessList = (props) => (
  <ul>
    {props.businesses.map(business => (
      <li key={business.uid}>
        <span>
          <strong>Business Name:</strong> {business.supplierName}
        </span>
        <span>
          <strong>Business Type:</strong> {business.businessType}
        </span>
        <span>
          <BusinessEditLink id={business.uid} />
        </span>
        <span>
          <BusinessViewLink id={business.uid} />
        </span>
      </li>
    ))}
  </ul>
);

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.BUSINESS];

export default withAuthorization(condition)(BusinessList);