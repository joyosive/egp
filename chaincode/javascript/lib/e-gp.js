/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class EGp extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const tenders = [
            {
                /* tender status */
                status: 'AWARDED',
                lastModified: '1560341304741',
                /* tender creation - STATUS: CREATED */
                procuringEntityID: '001',
                procuringEntityName: 'Nairobi County',
                procuringEntityType: 'County',
                number: 'NCC/EDU/T/459/2018-2019',
                description: 'Suspendisse tristique, lorem ac lobortis volutpat, massa augue lobortis dui, non gravida quam purus in ligula. Pellentesque congue mauris nec semper placerat.',
                budget: '35000000',
                validityPeriod: '80',
                file: 'https://example.com/file',
                createdOn: '1560341225920',
                tenderAccountingOfficer: 'zmzed7enEUTfykf2zBahLVOiY8K2',
                /* tender opening - STATUS: OPENED */
                tenderOpeningReport: 'https://example.com/file',
                tenderOpeningComment: 'Suspendisse tristique, lorem ac lobortis volutpat, massa augue lobortis dui, non gravida quam purus in ligula. Pellentesque congue mauris nec semper placerat.',
                openingCommitteeMembers: ['Uw2ttsTzHIP1iOelkyEgg1bWg2v2', 'abDDGLeM8gT0Ii1CDbS0L6jSCNx2', 'ik2M5SsPudYHS6cC43nduD33EHr1'],
                tenderOpeningReportApprovals: ['Uw2ttsTzHIP1iOelkyEgg1bWg2v2', 'abDDGLeM8gT0Ii1CDbS0L6jSCNx2', 'ik2M5SsPudYHS6cC43nduD33EHr1'],
                openedOn: '1560341238735',
                openedBy: 'zmzed7enEUTfykf2zBahLVOiY8K2',
                /* tender evaluation - STATUS: EVALUATED */
                tenderEvaluationReport: 'https://example.com/file',
                tenderEvaluationComment: 'Suspendisse tristique, lorem ac lobortis volutpat, massa augue lobortis dui, non gravida quam purus in ligula. Pellentesque congue mauris nec semper placerat.',
                evaluationCommitteeMembers: ['Uw2ttsTzHIP1iOelkyEgg1bWg2v2', 'abDDGLeM8gT0Ii1CDbS0L6jSCNx2', 'ik2M5SsPudYHS6cC43nduD33EHr1'],
                tenderEvaluationReportApprovals: ['Uw2ttsTzHIP1iOelkyEgg1bWg2v2', 'abDDGLeM8gT0Ii1CDbS0L6jSCNx2', 'ik2M5SsPudYHS6cC43nduD33EHr1'],
                evaluatedOn: '1560341268045',
                evaluatedBy: 'zmzed7enEUTfykf2zBahLVOiY8K2',
                /* tender awarding - STATUS: AWARDED */
                awardedTo: 'Jenga Consulting Ltd',
                awardComment: 'Suspendisse tristique, lorem ac lobortis volutpat, massa augue lobortis dui, non gravida quam purus in ligula. Pellentesque congue mauris nec semper placerat.',
                awardedOn: '1560341279674',
                awardedBy: 'zmzed7enEUTfykf2zBahLVOiY8K2',
            }
        ];

        for (let i = 0; i < tenders.length; i++) {
            tenders[i].docType = 'tender';
            await ctx.stub.putState('TENDER' + i, Buffer.from(JSON.stringify(tenders[i])));
            console.info('Added <--> ', tenders[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async createTender(ctx, tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod) {
        console.info('============= START : Create Tender ===========');
        const tender = {
            docType: 'tender',
            awardComment,
            awardedBy,
            awardedOn,
            awardedTo,
            budget,
            createdOn,
            description,
            evaluatedBy,
            evaluatedOn,
            evaluationCommitteeMembers,
            file,
            lastModified,
            number,
            openedBy,
            openedOn,
            openingCommitteeMembers,
            procuringEntityID,
            procuringEntityName,
            procuringEntityType,
            status,
            tenderAccountingOfficer,
            tenderEvaluationComment,
            tenderEvaluationReport,
            tenderEvaluationReportApprovals,
            tenderOpeningComment,
            tenderOpeningReport,
            tenderOpeningReportApprovals,
            validityPeriod,
        };
        await ctx.stub.putState(tenderNumber, Buffer.from(JSON.stringify(tender)));
        console.info('============= END : Create Tender ===========');
    }

    async updateTender(ctx, tenderNumber, awardComment, awardedBy, awardedOn, awardedTo, budget, createdOn, description, evaluatedBy, evaluatedOn, evaluationCommitteeMembers, file, lastModified, number, openedBy, openedOn, openingCommitteeMembers, procuringEntityID, procuringEntityName, procuringEntityType, status, tenderAccountingOfficer, tenderEvaluationComment, tenderEvaluationReport, tenderEvaluationReportApprovals, tenderOpeningComment, tenderOpeningReport, tenderOpeningReportApprovals, validityPeriod) {
        console.info('============= START : updateTender ===========');

        const tenderAsBytes = await ctx.stub.getState(tenderNumber); // get the tender from chaincode state
        if (!tenderAsBytes || tenderAsBytes.length === 0) {
            throw new Error(`${tenderNumber} does not exist`);
        }
        const tender = JSON.parse(tenderAsBytes.toString());

        /* tender status */
        tender.status = status;
        tender.lastModified = lastModified,
        /* tender creation - STATUS: CREATED */
        tender.procuringEntityID = procuringEntityID;
        tender.procuringEntityName = procuringEntityName;
        tender.procuringEntityType = procuringEntityType;
        tender.number = number;
        tender.description = description;
        tender.budget = budget;
        tender.validityPeriod = validityPeriod;
        tender.file = file;
        tender.createdOn = createdOn;
        tender.tenderAccountingOfficer = tenderAccountingOfficer;
        /* tender opening - STATUS: OPENED */
        tender.tenderOpeningReport = tenderOpeningReport;
        tender.tenderOpeningComment = tenderOpeningComment;
        tender.openingCommitteeMembers = openingCommitteeMembers;
        tender.tenderOpeningReportApprovals = tenderEvaluationReportApprovals;
        tender.openedOn = openedOn;
        tender.openedBy = openedBy;
        /* tender evaluation - STATUS: EVALUATED */
        tender.tenderEvaluationReport = tenderEvaluationReport;
        tender.tenderEvaluationComment = tenderEvaluationComment;
        tender.evaluationCommitteeMembers = evaluationCommitteeMembers;
        tender.tenderEvaluationReportApprovals = tenderEvaluationReportApprovals;
        tender.evaluatedOn = evaluatedOn;
        tender.evaluatedBy = evaluatedBy;
        /* tender awarding - STATUS: AWARDED */
        tender.awardedTo = awardedTo;
        tender.awardComment = awardComment;
        tender.awardedOn = awardedOn;
        tender.awardedBy = awardedBy;

        await ctx.stub.putState(tenderNumber, Buffer.from(JSON.stringify(tender)));
        console.info('============= END : updateTender ===========');
    }

    async queryTender(ctx, tenderNumber) {
        const tenderAsBytes = await ctx.stub.getState(tenderNumber);
        if (!tenderAsBytes || tenderAsBytes.length === 0) {
            throw new Error(`${tenderNumber} does not exist`);
        }
        console.log(tenderAsBytes.toString());
        return tenderAsBytes.toString();
    }

}

module.exports = EGp;
