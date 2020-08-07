/**
 *  src/components/Navigation/index.js
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
import { Link } from 'react-router-dom';

import SignOut from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <React.Fragment>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  </React.Fragment>
);

const NavigationAuth = ({ authUser }) => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      {authUser.roles[ROLES.PROCURING_ENTITY] && (
        <li>
          <Link to={ROUTES.PROCURING_ENTITY}>Manage Procuring Entity</Link>
        </li>
      )}
      {authUser.roles[ROLES.BUSINESS] && (
        <li>
          <Link to={ROUTES.BUSINESS}>Manage Business</Link>
        </li>
      )}
      {authUser.roles[ROLES.EMPLOYEE] && (
        <li>
          <Link to={ROUTES.EMPLOYEE}>Employee Details</Link>
        </li>
      )}
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <SignOut />
      </li>
    </ul>
  </div>
);

const NavigationNonAuth = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  </div>
);

export default Navigation;