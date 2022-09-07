import { tmpData } from '../userDetails';

export function doLogin(role: string, username: string, password: string) {
	cy.intercept('GET', '**/user/details').as('userDetails');
	cy.intercept('GET', '**/accounts/info?*').as('customerAccounts');
	cy.visit('/');
	// cy.get('body')
	// 	.then(($body) => {
	// 		if ($body.find('#userInput').length > 0) return '#userInput';
	// 		else return '#idp-discovery-username';
	// 	})
	// 	.then((selector) => {
	// 		cy.get(selector, { timeout: 2000 }).fill(username).type('{enter}');
	// 	});
	cy.get('#idp-discovery-username').as('userNameBox');
	cy.wait(2000);
	cy.get('@userNameBox').fill(username).type('{enter}');
	cy.log('Entered User Name');
	cy.wait(2000);
	cy.get('#okta-signin-password').as('passwordBox');
	cy.get('@passwordBox').type(password, { log: false });
	cy.log('Entered Password');
	cy.get('#okta-signin-submit').click();
	cy.wait('@userDetails').then((xhr) => {
		tmpData[role].jwtToken = xhr.request.headers['authorization']
			.toString()
			.slice(7);
		tmpData[role].puid = xhr.response.body.companyList[0].puid;
		tmpData[role].userId = xhr.response.body.ciscoUserProfileSchema.userId;
		tmpData[role].firstName =
			xhr.response.body.ciscoUserProfileSchema.firstName;
		tmpData[role].lastName =
			xhr.response.body.ciscoUserProfileSchema.lastName;
		tmpData[role].resourceList =
			xhr.response.body.companyList[0].roleList[0].resourceList;
		cy.writeFile('cypress/fixtures/temp.json', tmpData);
	});

	if (role != 'pa_hcaas_only') {
		cy.get('[data-auto-id="Facet-Customers"]').click();
		cy.wait('@customerAccounts').then((xhr) => {
			tmpData[role].customerList =
				xhr.response.body.customerAccountsInfoView;
			cy.writeFile('cypress/fixtures/temp.json', tmpData);
		});
	}

	cy.window().then((win) => {
		win.sessionStorage.clear();
		win.localStorage.clear();
	});
	cy.clearLocalStorage();
	cy.clearCookies();
}
