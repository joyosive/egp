/**
 *  src/components/Tender/tenderList.js
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

import TenderEditLink from './tenderEditLink';
import TenderViewLink from './tenderViewLink';

import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

const TenderList = (props) => (
  <ul>
    {props.tenders.map(tender => (
      <li key={tender.uid}>
        <span>
          <strong>Tender Ref. ID:</strong> {tender.uid}
        </span>
        <span>
          <strong>Tender Description:</strong> {tender.description}
        </span>
        <span>
          <TenderEditLink id={tender.uid} />
        </span>
        <span>
          <TenderViewLink id={tender.uid} />
        </span>
      </li>
    ))}
  </ul>
);

const condition = authUser =>
  authUser && !! authUser.roles[ROLES.PROCURING_ENTITY];

export default withAuthorization(condition)(TenderList);