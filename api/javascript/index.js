/**
 *  index.js
 *
 *  e-GP System API with Hyperledger Fabric
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
'use strict';

// hyperledger fabric-related dependencies
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// express.js dependencies
const express = require('express');
const app = express();

app.use(express.json()); // to support JSON-encoded bodies

// CORS on ExpressJS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// register user
async function createUser(uid) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(uid);
        if (userExists) {
            console.log('An identity for the user ' + uid + ' already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'procurement.staff', enrollmentID: uid, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: uid, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('ProcurementMSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import(uid, userIdentity);
        console.log('Successfully registered and enrolled user ' + uid + ' and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user ${uid}: ${error}`);
        process.exit(1);
    }
}

async function createTender(uid, tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(uid);
        if (!userExists) {
            console.log(`An identity for the user ${uid} does not exist in the wallet`);
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: uid, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('e-gp');

        // Evaluate the specified transaction.
        await contract.submitTransaction('createTender', tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod);

        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

async function updateTender(uid, tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(uid);
        if (!userExists) {
            console.log(`An identity for the user ${uid} does not exist in the wallet`);
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: uid, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('e-gp');

        // Evaluate the specified transaction.
        await contract.submitTransaction('updateTender', tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod);

        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

// create user on hyperledger fabric
app.post('/create-user', (req, res) => {
    let uid = req.body.uid;

    // echo user id
    console.log(uid);

    // create user
    createUser(uid);

    // give feedback
    res.json({ success: 'request posted' });

});

app.post('/create-tender', (req, res) => {
    let uid = req.body.uid;
    let tenderNumber = req.body.tenderNumber;
    let awardComment = req.body.awardComment ? req.body.awardComment : '';
    let awardedBy = req.body.awardedBy ? req.body.awardedBy : '';
    let awardedOn = req.body.awardedOn ? req.body.awardedOn : '';
    let awardedTo = req.body.awardedTo ? req.body.awardedTo : '';
    let budget = req.body.budget ? req.body.budget : '';
    let createdOn = req.body.createdOn ? req.body.createdOn : '';
    let description = req.body.description ? req.body.description : '';
    let evaluatedBy = req.body.evaluatedBy ? req.body.evaluatedBy : '';
    let evaluatedOn = req.body.evaluatedOn ? req.body.evaluatedOn : '';
    let evaluationCommitteeMembers = req.body.evaluationCommitteeMembers ? req.body.evaluationCommitteeMembers : '';
    let file = req.body.file ? req.body.file : '';
    let lastModified = req.body.lastModified ? req.body.lastModified : '';
    let number = req.body.number ? req.body.number : '';
    let openedBy = req.body.openedBy ? req.body.openedBy : '';
    let openedOn = req.body.openedOn ? req.body.openedOn : '';
    let openingCommitteeMembers = req.body.openingCommitteeMembers ? req.body.openingCommitteeMembers : '';
    let procuringEntityID = req.body.procuringEntityID ? req.body.procuringEntityID : '';
    let procuringEntityName = req.body.procuringEntityName ? req.body.procuringEntityName : '';
    let procuringEntityType = req.body.procuringEntityType ? req.body.procuringEntityType : '';
    let status = req.body.status ? req.body.status : '';
    let tenderAccountingOfficer = req.body.tenderAccountingOfficer ? req.body.tenderAccountingOfficer : '';
    let tenderEvaluationComment = req.body.tenderEvaluationComment ? req.body.tenderEvaluationComment : '';
    let tenderEvaluationReport = req.body.tenderEvaluationReport ? req.body.tenderEvaluationReport : '';
    let tenderEvaluationReportApprovals = req.body.tenderEvaluationReportApprovals ? req.body.tenderEvaluationReportApprovals : '';
    let tenderOpeningComment = req.body.tenderOpeningComment ? req.body.tenderOpeningComment : '';
    let tenderOpeningReport = req.body.tenderOpeningReport ? req.body.tenderOpeningReport : '';
    let tenderOpeningReportApprovals = req.body.tenderOpeningReportApprovals ? req.body.tenderOpeningReportApprovals : '';
    let validityPeriod = req.body.validityPeriod ? req.body.validityPeriod : '';

    // create tender
    createTender(uid, tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod);

    // give feedback
    res.json({ success: 'request posted' });
});

app.post('/update-tender', (req, res) => {
    let uid = req.body.uid;
    let tenderNumber = req.body.tenderNumber;
    let awardComment = req.body.awardComment ? req.body.awardComment : '';
    let awardedBy = req.body.awardedBy ? req.body.awardedBy : '';
    let awardedOn = req.body.awardedOn ? req.body.awardedOn : '';
    let awardedTo = req.body.awardedTo ? req.body.awardedTo : '';
    let budget = req.body.budget ? req.body.budget : '';
    let createdOn = req.body.createdOn ? req.body.createdOn : '';
    let description = req.body.description ? req.body.description : '';
    let evaluatedBy = req.body.evaluatedBy ? req.body.evaluatedBy : '';
    let evaluatedOn = req.body.evaluatedOn ? req.body.evaluatedOn : '';
    let evaluationCommitteeMembers = req.body.evaluationCommitteeMembers ? req.body.evaluationCommitteeMembers : '';
    let file = req.body.file ? req.body.file : '';
    let lastModified = req.body.lastModified ? req.body.lastModified : '';
    let number = req.body.number ? req.body.number : '';
    let openedBy = req.body.openedBy ? req.body.openedBy : '';
    let openedOn = req.body.openedOn ? req.body.openedOn : '';
    let openingCommitteeMembers = req.body.openingCommitteeMembers ? req.body.openingCommitteeMembers : '';
    let procuringEntityID = req.body.procuringEntityID ? req.body.procuringEntityID : '';
    let procuringEntityName = req.body.procuringEntityName ? req.body.procuringEntityName : '';
    let procuringEntityType = req.body.procuringEntityType ? req.body.procuringEntityType : '';
    let status = req.body.status ? req.body.status : '';
    let tenderAccountingOfficer = req.body.tenderAccountingOfficer ? req.body.tenderAccountingOfficer : '';
    let tenderEvaluationComment = req.body.tenderEvaluationComment ? req.body.tenderEvaluationComment : '';
    let tenderEvaluationReport = req.body.tenderEvaluationReport ? req.body.tenderEvaluationReport : '';
    let tenderEvaluationReportApprovals = req.body.tenderEvaluationReportApprovals ? req.body.tenderEvaluationReportApprovals : '';
    let tenderOpeningComment = req.body.tenderOpeningComment ? req.body.tenderOpeningComment : '';
    let tenderOpeningReport = req.body.tenderOpeningReport ? req.body.tenderOpeningReport : '';
    let tenderOpeningReportApprovals = req.body.tenderOpeningReportApprovals ? req.body.tenderOpeningReportApprovals : '';
    let validityPeriod = req.body.validityPeriod ? req.body.validityPeriod : '';

    // create tender
    updateTender(uid, tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod);

    // give feedback
    res.json({ success: 'request posted' });
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
