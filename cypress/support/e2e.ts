import '@shelex/cypress-allure-plugin';
import './commands';
import { userDetails } from './userDetails';
import { doLogin } from './utils/loginUtil';

before('Extract User Credentials', () => {
	/* cy.exec('npx ts-node cypress/support/utils/aws/getSecrets.ts', {
		log: true,
		failOnNonZeroExit: false,
	}).then((result) => {
		const aws_secrets = result.stdout;
		userDetails.pa.username = JSON.parse(aws_secrets).PA_USERNAME;
		userDetails.exec.username = JSON.parse(aws_secrets).EXEC_USERNAME;
		userDetails.pa.password = JSON.parse(aws_secrets).TESTPX_PASSWORD;
		userDetails.exec.password = JSON.parse(aws_secrets).CXPTEST_PASSWORD;
	}); */

	userDetails.pa_hcaas_st = Cypress.env('PA_ST_HCAAS_USER');
	userDetails.pa_hcaas_only = Cypress.env('PA_HCAAS_ONLY_USER');
	userDetails.pa_st_only = Cypress.env('PA_ST_ONLY_USER');
	userDetails.pa_lca = Cypress.env('PA_LCA_USER');
	userDetails.exec = Cypress.env('EXEC_USER');
	userDetails.password = Cypress.env('PORTAL_PASSWORD');

	cy.fixture('configs/roles').then((rolesList: string[]) => {
		cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
			rolesList.forEach((role) => {
				if (tmpData[role] == null || tmpData[role] == undefined)
					doLogin(role, userDetails[role], userDetails.password);
			});
		});
	});
});
