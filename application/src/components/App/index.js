/**
 *  src/components/App/index.js
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
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import Home from '../Home';
import Account from '../Account';
import ProcuringEntity, { ProcuringEntityCreate, ProcuringEntityEdit, ProcuringEntityView } from '../ProcuringEntity';
import Business, { BusinessCreate, BusinessEdit, BusinessView } from '../Business';
import Employee, { EmployeeRegister, EmployeeEdit} from '../Employee';
import Tender, { TenderCreate, TenderEdit, TenderView } from '../Tender';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import PasswordForget from '../PasswordForget';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <Navigation />
    <hr />
    <Route exact path={ROUTES.HOME} component={Home} />
    <Route path={ROUTES.ACCOUNT} component={Account} />
    <Route path={ROUTES.PROCURING_ENTITY} component={ProcuringEntity} />
    <Route path={ROUTES.PROCURING_ENTITY_CREATE} component={ProcuringEntityCreate} />
    <Route path={ROUTES.PROCURING_ENTITY_EDIT + '/:id'} component={ProcuringEntityEdit} />
    <Route path={ROUTES.PROCURING_ENTITY_VIEW + '/:id'} component={ProcuringEntityView} />
    <Route path={ROUTES.BUSINESS} component={Business} />
    <Route path={ROUTES.BUSINESS_CREATE} component={BusinessCreate} />
    <Route path={ROUTES.BUSINESS_EDIT + '/:id'} component={BusinessEdit} />
    <Route path={ROUTES.BUSINESS_VIEW + '/:id'} component={BusinessView} />
    <Route path={ROUTES.EMPLOYEE} component={Employee} />
    <Route path={ROUTES.EMPLOYEE_REGISTER} component={EmployeeRegister} />
    <Route path={ROUTES.EMPLOYEE_EDIT + '/:id'} component={EmployeeEdit} />
    <Route path={ROUTES.TENDER} component={Tender} />
    <Route path={ROUTES.TENDER_CREATE} component={TenderCreate} />
    <Route path={ROUTES.TENDER_EDIT + '/:id'} component={TenderEdit} />
    <Route path={ROUTES.TENDER_VIEW + '/:id'} component={TenderView} />
    <Route path={ROUTES.SIGN_UP} component={SignUp} />
    <Route path={ROUTES.SIGN_IN} component={SignIn} />
    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
  </Router>
);

export default withAuthentication(App);