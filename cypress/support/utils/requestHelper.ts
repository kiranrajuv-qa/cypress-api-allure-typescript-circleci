import resource_mappings = require('../../fixtures/rbac/resource_mappings.json');
import rolesList = require('../../fixtures/configs/roles.json');

let roleList: string[] = [];

export function getHeadersList(testDataRow: object) {
	let headers: string[];
	headers = Object.keys(testDataRow).filter((key) => {
		return (
			~key.indexOf('header_') &&
			testDataRow[key] != '' &&
			testDataRow[key] != null
		);
	});
	return headers;
}

export function prepareHeaderObj(testDataRow: object) {
	let headersObj: object = {};
	let headers: string[];
	headers = getHeadersList(testDataRow);
	headers.forEach((header) => {
		headersObj[header.substring(7, header.length)] =
			testDataRow['header_' + header.substring(7, header.length)];
	});
	return headersObj;
}

export function getRoles(testDataRow: object) {
	const roles: string = testDataRow['roles'];
	return (roleList = roles.split(','));
}

export function getFilteredRoles(testDataRow: object) {
	const roles: string = testDataRow['roles'];
	roleList = roles.split(',');
	let filteredRoles: string[];
	cy.fixture('configs/roles').then((desiredRoles: string[]) => {
		roleList.forEach((role) => {
			if (desiredRoles.includes(role)) filteredRoles.push(role);
		});
	});
	return filteredRoles;
}

export function getUniqueRoles(tests: object[]) {
	let uniqueRoles = new Set<string>();
	tests.forEach((testDataRow) => {
		getRoles(testDataRow).forEach((role) => {
			uniqueRoles.add(role);
		});
	});
	return Array.from(uniqueRoles);
}

export function filterIgnoredTests(tests: object[]) {
	return tests.filter(function (entry) {
		return entry['ignore'] != 'Y';
	});
}

export function getUrlWithoutQueryParams(url: string) {
	return url.substring(0, url.indexOf('?'));
}

export function preparePayload(payload: object, tmpData: object, role: string) {
	let payloadTxt = JSON.stringify(payload);
	payloadTxt = payloadTxt.replace(/__puid/g, tmpData[role].puid);
	payloadTxt = payloadTxt.replace(/__userId/g, tmpData[role].userId);
	payloadTxt = payloadTxt.replace(/__firstName/g, tmpData[role].firstName);
	payloadTxt = payloadTxt.replace(/__lastName/g, tmpData[role].lastName);
	payloadTxt = payloadTxt.replace(/__dateNowMillis/g, Date.now() + '');
	payload = JSON.parse(payloadTxt);
	return payload;
}

export function runTestsJWTTokenMissing(tests: object[], baseUrl: string) {
	tests.forEach((testDataRow) => {
		let headersObj = prepareHeaderObj(testDataRow);
		it(`${testDataRow['testName']} - Missing JWT Token`, () => {
			cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
				headersObj['puid'] = tmpData.pa_hcaas_st.puid;
				//cy.log(JSON.stringify(headersObj));
				cy.request({
					method: testDataRow['method'],
					url:
						Cypress.env('API_BASE_URL') +
						baseUrl +
						testDataRow['url'],
					headers: headersObj,
					auth: {
						bearer: '',
					},
					failOnStatusCode: false,
				}).then((response) => {
					expect(response.status).to.eq(500);
				});
			});
		});
	});
}

export function runTestsInvalidJWTToken(tests: object[], baseUrl: string) {
	tests.forEach((testDataRow) => {
		const headersObj = prepareHeaderObj(testDataRow);
		it(`${testDataRow['testName']} - Invalid JWT Token`, () => {
			cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
				headersObj['puid'] = tmpData.pa_hcaas_st.puid;
				//cy.log(JSON.stringify(headersObj));
				cy.request({
					method: testDataRow['method'],
					url:
						Cypress.env('API_BASE_URL') +
						baseUrl +
						testDataRow['url'],
					headers: headersObj,
					auth: {
						bearer: 'invalid_token',
					},
					failOnStatusCode: false,
				}).then((response) => {
					expect(response.status).to.eq(403);
				});
			});
		});
	});
}

export function runTestsAuthHeaderMissing(tests: object[], baseUrl: string) {
	tests.forEach((testDataRow) => {
		const headersObj = prepareHeaderObj(testDataRow);
		it(`${testDataRow['testName']} - Missing Authorization Header`, () => {
			cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
				headersObj['puid'] = tmpData.pa_hcaas_st.puid;
				//cy.log(JSON.stringify(headersObj));
				cy.request({
					method: testDataRow['method'],
					url:
						Cypress.env('API_BASE_URL') +
						baseUrl +
						testDataRow['url'],
					headers: headersObj,
					failOnStatusCode: false,
				}).then((response) => {
					expect(response.status).to.eq(401);
				});
			});
		});
	});
}

export function runTestsHeadersMissing(tests: object[], baseUrl: string) {
	tests.forEach((testDataRow) => {
		let headersList = getHeadersList(testDataRow);
		headersList.forEach((entry) => {
			let headersObj = prepareHeaderObj(testDataRow);
			delete headersObj[entry.substring(7, entry.length)];
			it(
				`${testDataRow['testName']} - Missing ` +
					entry.substring(7, entry.length) +
					` header`,
				() => {
					let paJwtToken: string;
					cy.readFile('cypress/fixtures/temp.json').then(
						(tmpData) => {
							paJwtToken = tmpData.pa_hcaas_st.jwtToken;
							if (headersObj['puid'])
								headersObj['puid'] = tmpData.pa_hcaas_st.puid;
							//cy.log(JSON.stringify(headersObj));
							cy.request({
								method: testDataRow['method'],
								url:
									Cypress.env('API_BASE_URL') +
									baseUrl +
									testDataRow['url'],
								headers: headersObj,
								auth: {
									bearer: paJwtToken,
								},
								failOnStatusCode: false,
							}).then((response) => {
								if (
									String(testDataRow['url']).includes(
										'learning',
									) ||
									String(testDataRow['url']).includes(
										'training',
									)
								)
									expect(response.status).to.eq(500);
								else expect(response.status).to.eq(400);
							});
						},
					);
				},
			);
		});
	});
}

export function runTestsInvalidHeaderValues(tests: object[], baseUrl: string) {
	tests.forEach((testDataRow) => {
		let headersList = getHeadersList(testDataRow);
		headersList.forEach((entry) => {
			let headersObj = prepareHeaderObj(testDataRow);
			headersObj[entry.substring(7, entry.length)] = '45255';
			it(
				`${testDataRow['testName']} - Invalid ` +
					entry.substring(7, entry.length),
				() => {
					let paJwtToken: string;
					cy.readFile('cypress/fixtures/temp.json').then(
						(tmpData) => {
							paJwtToken = tmpData.pa_hcaas_st.jwtToken;
							if (entry.substring(7, entry.length) != 'puid')
								headersObj['puid'] = tmpData.pa_hcaas_st.puid;
							//cy.log(JSON.stringify(headersObj));
							cy.request({
								method: testDataRow['method'],
								url:
									Cypress.env('API_BASE_URL') +
									baseUrl +
									testDataRow['url'],
								headers: headersObj,
								auth: {
									bearer: paJwtToken,
								},
								failOnStatusCode: false,
							}).then((response) => {
								if (
									entry.substring(7, entry.length) == 'puid'
								) {
									if (
										baseUrl.includes(
											'cxpp-training-enablement',
										)
									)
										expect(response.status).to.eq(403);
									else if (
										baseUrl.includes(
											'cxpp-customer-portal-mirror',
										)
									)
										expect(response.status).to.eq(401);
								} else expect(response.status).to.eq(200);
							});
						},
					);
				},
			);
		});
	});
}

export function runRBACTests(tests: object[], baseUrl: string, path: string) {
	tests.forEach((testDataRow) => {
		//getRoles(testDataRow);
		rolesList.forEach((role) => {
			if (testDataRow['payload'] == '') {
				const headersObj = prepareHeaderObj(testDataRow);
				it(`${testDataRow['testName']} - RBAC - ` + role, () => {
					let jwtToken: string;
					let resourceList: string[];
					cy.readFile('cypress/fixtures/temp.json').then(
						(tmpData) => {
							jwtToken = tmpData[role].jwtToken;
							resourceList = tmpData[role].resourceList;
							headersObj['puid'] = tmpData[role].puid;
							cy.request({
								method: testDataRow['method'],
								url:
									Cypress.env('API_BASE_URL') +
									baseUrl +
									testDataRow['url'],
								headers: headersObj,
								auth: {
									bearer: jwtToken,
								},
								failOnStatusCode: false,
							}).then((response) => {
								var exists = false;
								resourceList.forEach((resource) => {
									if (
										resource_mappings[resource] &&
										resource_mappings[resource].some(
											(item) =>
												testDataRow['url'].includes(
													item,
												),
										)
									) {
										exists = true;
									}
								});
								if (exists) expect(response.status).to.eq(200);
								else expect(response.status).to.eq(403);
							});
						},
					);
				});
			} else {
				const headersObj = prepareHeaderObj(testDataRow);
				headersObj['content-type'] = 'application/json';
				it(`${testDataRow['testName']} - RBAC - ` + role, () => {
					cy.fixture(path + testDataRow['payload']).then(
						(payload: object) => {
							let payloadTxt = JSON.stringify(payload);
							let jwtToken: string;
							let resourceList: string[];
							cy.readFile('cypress/fixtures/temp.json').then(
								(tmpData) => {
									jwtToken = tmpData[role].jwtToken;
									resourceList = tmpData[role].resourceList;
									headersObj['puid'] = tmpData[role].puid;
									payloadTxt = payloadTxt.replace(
										/__puid/g,
										tmpData[role].puid,
									);
									payloadTxt = payloadTxt.replace(
										/__userId/g,
										tmpData[role].userId,
									);
									payloadTxt = payloadTxt.replace(
										/__firstName/g,
										tmpData[role].firstName,
									);
									payloadTxt = payloadTxt.replace(
										/__lastName/g,
										tmpData[role].lastName,
									);
									payloadTxt = payloadTxt.replace(
										/__dateNowMillis/g,
										Date.now() + '',
									);
									payload = JSON.parse(payloadTxt);
									cy.request({
										method: testDataRow['method'],
										url:
											Cypress.env('API_BASE_URL') +
											baseUrl +
											testDataRow['url'],
										headers: headersObj,
										auth: {
											bearer: jwtToken,
										},
										body: payload,
										failOnStatusCode: false,
									}).then((response) => {
										var exists = false;
										resourceList.forEach((resource) => {
											if (
												resource_mappings[resource] &&
												resource_mappings[
													resource
												].some((item) =>
													testDataRow['url'].includes(
														item,
													),
												)
											) {
												exists = true;
											}
										});
										if (exists)
											expect(response.status).to.eq(200);
										else expect(response.status).to.eq(403);
									});
								},
							);
						},
					);
				});
			}
		});
	});
}

export function callApi(
	method: string,
	url: string,
	bodyObj: object,
	headersObj: object,
	token: string,
): Cypress.Chainable<Cypress.Response<any>> {
	return cy.request({
		method: method,
		url: Cypress.env('API_BASE_URL') + url,
		body: bodyObj,
		headers: headersObj,
		failOnStatusCode: false,
		auth: {
			bearer: token,
		},
	});
}
