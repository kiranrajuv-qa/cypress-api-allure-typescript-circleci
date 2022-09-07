import { skipOn } from '@cypress/skip-test';
import * as upath from 'upath';
import { mirror_base_url } from '../../../support/constants/cpmirror/baseUrl';
import { allSuccessTracks } from '../../../support/constants/cpmirror/customers';
import {
	getPitstopInfoResponseSchema,
	getSuccessTrackInfoResponseSchema,
} from '../../../support/schemas/cpmirror/customers';
import { validateResponseSchema } from '../../../support/utils/commonUtils';
import {
	callApi,
	filterIgnoredTests,
	prepareHeaderObj,
	runRBACTests,
	runTestsAuthHeaderMissing,
	runTestsHeadersMissing,
	runTestsInvalidHeaderValues,
	runTestsInvalidJWTToken,
	runTestsJWTTokenMissing,
} from '../../../support/utils/requestHelper';

let customerPortfolioOffersTests: object[] = require('../../../fixtures/tests/cpmirror/customers/customer360_portfolio_offers.json');

describe('CUSTOMERS Facet - Customer 360 - PORTFOLIO & OFFERS TABS', () => {
	const filteredTests = filterIgnoredTests(customerPortfolioOffersTests);
	runTestsJWTTokenMissing(filteredTests, mirror_base_url);
	runTestsInvalidJWTToken(filteredTests, mirror_base_url);
	runTestsAuthHeaderMissing(filteredTests, mirror_base_url);
	runTestsHeadersMissing(filteredTests, mirror_base_url);
	runTestsInvalidHeaderValues(filteredTests, mirror_base_url);
	runRBACTests(
		filteredTests,
		mirror_base_url,
		upath
			.normalizeSafe(__dirname)
			.replace('cypress' + upath.sep + 'e2e', 'testData') + upath.sep,
	);

	skipOn(customerPortfolioOffersTests[0]['ignore'] == 'Y', () => {
		describe('Get Pitstop Info', () => {
			it('Get Pitstop Info - without customerId query param', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(
						customerPortfolioOffersTests[0],
					);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerPortfolioOffersTests[0]['method'],
						mirror_base_url +
							customerPortfolioOffersTests[0]['url'].substring(
								0,
								customerPortfolioOffersTests[0]['url'].indexOf(
									'?',
								),
							),
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(400);
						expect(response.body.code).to.eq('PX_MIRROR_BAD_INPUT');
						expect(response.body.message).to.eq(
							"Required request parameter 'customerId' for method parameter type String is not present",
						);
					});
				});
			});

			it('Get Pitstop Info', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(
						customerPortfolioOffersTests[0],
					);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerPortfolioOffersTests[0]['method'],
						mirror_base_url +
							customerPortfolioOffersTests[0]['url'],
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						validateResponseSchema(
							response.body,
							getPitstopInfoResponseSchema,
						);
					});
				});
			});
		});
	});

	skipOn(customerPortfolioOffersTests[1]['ignore'] == 'Y', () => {
		describe('Get Success Track Info', () => {
			it('Get Success Track Info - without customerId query param', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(
						customerPortfolioOffersTests[1],
					);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerPortfolioOffersTests[1]['method'],
						mirror_base_url +
							customerPortfolioOffersTests[1]['url'].substring(
								0,
								customerPortfolioOffersTests[1]['url'].indexOf(
									'?',
								),
							),
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(400);
						expect(response.body.code).to.eq('PX_MIRROR_BAD_INPUT');
						expect(response.body.message).to.eq(
							"Required request parameter 'customerId' for method parameter type String is not present",
						);
					});
				});
			});

			it('Get Success Track Info', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(
						customerPortfolioOffersTests[1],
					);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerPortfolioOffersTests[1]['method'],
						mirror_base_url +
							customerPortfolioOffersTests[1]['url'],
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						validateResponseSchema(
							response.body,
							getSuccessTrackInfoResponseSchema,
						);
						response.body.forEach((successTrack) => {
							expect(successTrack.solutionName).to.be.oneOf(
								allSuccessTracks,
							);
							expect(successTrack.pxCloudEnabled).to.be.oneOf([
								true,
								false,
							]);
							expect(successTrack.accessProvided).to.be.oneOf([
								true,
								false,
							]);
							expect(successTrack.noOfUsecases).to.be.at.least(0);
							if (successTrack.solutionName == 'Campus Network') {
								expect(successTrack.solutionId).to.eq(
									'38396885',
								);
								expect(successTrack.pxCloudEnabled).to.be.true;
							} else if (successTrack.solutionName == 'WAN') {
								expect(successTrack.solutionId).to.eq(
									'40317380',
								);
								expect(successTrack.pxCloudEnabled).to.be.false;
								expect(successTrack.accessProvided).to.be.false;
							} else if (
								successTrack.solutionName == 'Cloud Network'
							) {
								expect(successTrack.solutionId).to.eq(
									'40485321',
								);
								expect(successTrack.pxCloudEnabled).to.be.false;
							} else if (
								successTrack.solutionName ==
								'Data Center Compute'
							) {
								expect(successTrack.solutionId).to.eq(
									'50320048',
								);
								expect(successTrack.pxCloudEnabled).to.be.false;
							} else if (
								successTrack.solutionName == 'Meraki Network'
							) {
								expect(successTrack.solutionId).to.eq(
									'52517223',
								);
								expect(successTrack.pxCloudEnabled).to.be.false;
								expect(successTrack.accessProvided).to.be.false;
							} else if (
								successTrack.solutionName ==
								'Integrated Secure Operations'
							) {
								expect(successTrack.solutionId).to.eq(
									'40636840',
								);
								expect(successTrack.pxCloudEnabled).to.be.false;
								expect(successTrack.accessProvided).to.be.false;
							} else if (
								successTrack.solutionName == 'Hybrid Cloud'
							) {
								expect(successTrack.solutionId).to.eq(
									'hybrid_cloud',
								);
							}
						});
					});
				});
			});
		});
	});

	skipOn(customerPortfolioOffersTests[2]['ignore'] == 'Y', () => {
		it('Sold Success Tracks', () => {
			cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
				const headersObj = prepareHeaderObj(
					customerPortfolioOffersTests[2],
				);
				const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
				headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
				callApi(
					customerPortfolioOffersTests[2]['method'],
					mirror_base_url + customerPortfolioOffersTests[2]['url'],
					null,
					headersObj,
					jwtToken,
				).then((response) => {
					expect(response.status).to.eq(200);
				});
			});
		});
	});

	skipOn(customerPortfolioOffersTests[3]['ignore'] == 'Y', () => {
		it('Upcoming ATX Sessions', () => {
			cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
				const headersObj = prepareHeaderObj(
					customerPortfolioOffersTests[3],
				);
				const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
				headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
				callApi(
					customerPortfolioOffersTests[3]['method'],
					mirror_base_url + customerPortfolioOffersTests[3]['url'],
					null,
					headersObj,
					jwtToken,
				).then((response) => {
					expect(response.status).to.eq(200);
				});
			});
		});
	});

	skipOn(customerPortfolioOffersTests[4]['ignore'] == 'Y', () => {
		it('Upcoming ACC Sessions', () => {
			cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
				const headersObj = prepareHeaderObj(
					customerPortfolioOffersTests[4],
				);
				const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
				headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
				callApi(
					customerPortfolioOffersTests[4]['method'],
					mirror_base_url + customerPortfolioOffersTests[4]['url'],
					null,
					headersObj,
					jwtToken,
				).then((response) => {
					expect(response.status).to.eq(200);
				});
			});
		});
	});
});
