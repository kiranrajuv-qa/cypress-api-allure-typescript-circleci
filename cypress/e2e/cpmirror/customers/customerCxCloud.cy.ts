import { skipOn } from '@cypress/skip-test';
import * as upath from 'upath';
import { mirror_base_url } from '../../../support/constants/cpmirror/baseUrl';
import {
	ciscoPlusContract,
	offerDomains,
	partnerAccessStates,
	portalAccessStates,
	serviceTypes,
	successTracks,
	userAccessStates,
} from '../../../support/constants/cpmirror/customers';
import {
	getAccountFilterCountResponseSchema,
	getAccountsInfoResponseSchema,
} from '../../../support/schemas/cpmirror/customers';
import {
	isAscending,
	isDescending,
	validateResponseSchema,
	verifyDuplicates,
	verifyDuplicatesInArray,
} from '../../../support/utils/commonUtils';
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

let customerFacetTests: object[] = require('../../../fixtures/tests/cpmirror/customers/customerCxCloud.json');

describe('CUSTOMERS Facet - Customer CX Cloud', () => {
	const filteredTests = filterIgnoredTests(customerFacetTests);
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

	skipOn(customerFacetTests[0]['ignore'] == 'Y', () => {
		describe('Get Accounts Info', () => {
			it('Get Accounts Info - Without query params', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							customerFacetTests[0]['url'].substring(
								0,
								customerFacetTests[0]['url'].indexOf('?'),
							),
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						expect(response.body.customerAccountsInfoView).to.be
							.exist;
						expect(response.body.paginationResponse).to.be.null;
					});
				});
			});

			it('Get Accounts Info - Without query param (page)', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url + '/v1/partner/accounts/info?rows=25',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						expect(response.body.customerAccountsInfoView).to.be
							.exist;
						expect(response.body.paginationResponse).to.be.null;
					});
				});
			});

			it('Get Accounts Info - Without query param (rows)', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url + '/v1/partner/accounts/info?page=1',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						expect(response.body.customerAccountsInfoView).to.be
							.exist;
						expect(response.body.paginationResponse).to.be.null;
					});
				});
			});

			it('Get Accounts Info', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url + customerFacetTests[0]['url'],
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						validateResponseSchema(
							response.body,
							getAccountsInfoResponseSchema,
						);
						verifyDuplicates(
							response.body.customerAccountsInfoView,
							'customerid',
						);
						verifyDuplicates(
							response.body.customerAccountsInfoView,
							'cuid',
						);
						verifyDuplicates(
							response.body.customerAccountsInfoView,
							'customername',
						);
						response.body.customerAccountsInfoView.forEach(
							(customer) => {
								expect(customer.puid).to.eq(
									tmpData['pa_hcaas_st'].puid,
								);
								expect(customer.user_access_state).to.be.oneOf(
									userAccessStates,
								);
								if (
									customer.hcaasFlag &&
									!customer.successTrackFlag
								)
									expect(customer.user_access_state).to.eq(
										'na',
									);
								if (customer.partner_access_status !== null)
									expect(
										customer.partner_access_status,
									).to.be.oneOf(partnerAccessStates);
								if (customer.user_access_state == 'granted') {
									expect(customer.crossLaunchUrl).not.to.be
										.null;
									expect(customer.crossLaunchUrl).to.include(
										customer.customerid,
									);
								} else
									expect(customer.crossLaunchUrl).to.be.null;
								verifyDuplicatesInArray(
									customer.offerDomainList,
								);
								if (customer.hcaasFlag) {
									expect(customer.offerDomainList).to.include(
										ciscoPlusContract,
									);
									if (!customer.successTrackFlag) {
										expect(
											customer.offerDomainList,
										).to.have.length(1);
										customer.offerDomainList.forEach(
											(offerDomain) => {
												expect(
													offerDomain,
												).not.to.be.oneOf(
													successTracks,
												);
											},
										);
									}
								} else
									expect(
										customer.offerDomainList,
									).not.to.include(ciscoPlusContract);
								if (
									customer.successTrackFlag &&
									!customer.hcaasFlag
								)
									customer.offerDomainList.forEach(
										(offerDomain) => {
											expect(offerDomain).to.be.oneOf(
												successTracks,
											);
										},
									);
								if (
									customer.successTrackFlag &&
									customer.hcaasFlag &&
									customer.offerDomainList.length == 1
								)
									expect(customer.offerDomainList).to.include(
										ciscoPlusContract,
									);
								if (!customer.hcaasFlag)
									expect(
										customer.offerDomainList,
									).not.to.include(ciscoPlusContract);
								else
									expect(customer.offerDomainList).to.include(
										ciscoPlusContract,
									);
							},
						);
					});
				});
			});

			it('Get Accounts Info - (Default) Sort By Customer Name ASC', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							'/v1/partner/accounts/info?sortType=ASC&sortField=customername&search=&rows=25&page=1',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						const customerNames: string[] = [];
						response.body.customerAccountsInfoView.forEach(
							(customer, index) => {
								customerNames[index] = customer.customername;
							},
						);
						expect(isAscending(customerNames)).to.be.true;
					});
				});
			});

			it('Get Accounts Info - Sort By Customer Name DESC', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							'/v1/partner/accounts/info?sortType=DESC&sortField=customername&search=&rows=25&page=1',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						const customerNames: string[] = [];
						response.body.customerAccountsInfoView.forEach(
							(customer, index) => {
								customerNames[index] = customer.customername;
							},
						);
						expect(isDescending(customerNames)).to.be.true;
					});
				});
			});

			it('Get Accounts Info - Search with Customer Name', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							'/v1/partner/accounts/info?sortType=ASC&sortField=customername&search=INC&rows=25&page=1',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						response.body.customerAccountsInfoView.forEach(
							(customer) => {
								expect(customer.customername).to.include('INC');
							},
						);
					});
				});
			});

			it('Get Accounts Info - Filter with CX Cloud Access (Pending)', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							'/v1/partner/accounts/info?sortType=ASC&sortField=customername&search=&rows=25&page=1&filter=portalaccess%3Apending',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						response.body.customerAccountsInfoView.forEach(
							(customer) => {
								expect(customer.user_access_state).to.eq(
									'pending',
								);
								expect(customer.successTrackFlag).to.be.true;
							},
						);
					});
				});
			});

			it('Get Accounts Info - Filter Service Contracts with CX Cloud Access (Pending)', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							'/v1/partner/accounts/info?sortType=ASC&sortField=customername&search=&rows=25&page=1&filter=offertype%3AServices%20Contracts%3Bportalaccess%3Apending',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						response.body.customerAccountsInfoView.forEach(
							(customer) => {
								expect(customer.user_access_state).to.eq(
									'pending',
								);
								expect(customer.successTrackFlag).to.be.true;
							},
						);
					});
				});
			});

			it('Get Accounts Info - Filter Cisco+ Contracts', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							'/v1/partner/accounts/info?sortType=ASC&sortField=customername&search=&rows=25&page=1&filter=offertype%3ACisco%2B%20Contracts',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						response.body.customerAccountsInfoView.forEach(
							(customer) => {
								if (
									customer.hcaasFlag &&
									!customer.successTrackFlag
								)
									expect(customer.user_access_state).to.eq(
										'na',
									);
								expect(customer.hcaasFlag).to.be.true;
								expect(customer.offerDomainList).to.include(
									ciscoPlusContract,
								);
							},
						);
					});
				});
			});

			it('Get Accounts Info - Filter CX Cloud Access Granted for DCC Offer Domain', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[0]['method'],
						mirror_base_url +
							'/v1/partner/accounts/info?sortType=ASC&sortField=customername&search=&rows=25&page=1&filter=portalaccess%3Agranted%3Bofferdomain%3A50320048',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						response.body.customerAccountsInfoView.forEach(
							(customer) => {
								expect(customer.user_access_state).to.eq(
									'granted',
								);
								expect(customer.partner_access_status).to.eq(
									'APPROVED',
								);
								expect(customer.successTrackFlag).to.be.true;
								expect(customer.offerDomainList).to.include(
									'Data Center Compute',
								);
							},
						);
					});
				});
			});
		});
	});

	skipOn(customerFacetTests[1]['ignore'] == 'Y', () => {
		describe('Get Portal Access Count', () => {
			it('Get Portal Access Count', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[1]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[1]['method'],
						mirror_base_url + customerFacetTests[1]['url'],
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						validateResponseSchema(
							response.body,
							getAccountFilterCountResponseSchema,
						);
						response.body.data.forEach((status) => {
							expect(status.key).to.be.oneOf(portalAccessStates);
						});
						verifyDuplicates(response.body.data, 'key');
					});
				});
			});
		});
	});

	skipOn(customerFacetTests[2]['ignore'] == 'Y', () => {
		describe('Get Service Type Count', () => {
			it('Get Service Type Count', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[2]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[2]['method'],
						mirror_base_url + customerFacetTests[2]['url'],
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						validateResponseSchema(
							response.body,
							getAccountFilterCountResponseSchema,
						);
						response.body.data.forEach((serviceType) => {
							expect(serviceType.key).to.be.oneOf(serviceTypes);
						});
						verifyDuplicates(response.body.data, 'key');
					});
				});
			});
		});
	});

	skipOn(customerFacetTests[3]['ignore'] == 'Y', () => {
		describe('Get Offer Domain Count', () => {
			it('Get Offer Domain Count', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(customerFacetTests[3]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						customerFacetTests[3]['method'],
						mirror_base_url + customerFacetTests[3]['url'],
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						validateResponseSchema(
							response.body,
							getAccountFilterCountResponseSchema,
						);
						response.body.data.forEach((offerDomain) => {
							expect(offerDomain.key).to.be.oneOf(offerDomains);
						});
						verifyDuplicates(response.body.data, 'key');
						verifyDuplicates(response.body.data, 'keyId');
					});
				});
			});
		});
	});
});
