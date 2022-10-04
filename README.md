# cypress-api-allure-typscript-circleci

## Prerequisite

1. Install Node.js Latest LTS Version from https://nodejs.org/en/download/
2. Install VS Code from https://code.visualstudio.com/download
3. Follow the installation steps in https://github.com/MihanEntalpo/allure-single-html-file#installation to merge allure report to single file

## First Time Setup

-	Clone the repo
-	Run `npm ci` command to install all dependencies

## Formatting files with Prettier

-   To auto-format the files <br /> `npx prettier --write .`
-   To check the file format <br /> `npx prettier --check .`

## Writing the tests

-	Add API configuration in cypress/fixtures/tests folder which has below params
	-	API/Test Name
	-	Comma separated roles
	-	API Method
	-	API URI
	-	Headers
	-	API Payload as JSON file which is under cypress/fixtures/testData folder
	-	Ignore flag
-	Configure the API base URL in cypress/support/constants/<track_name>/baseUrl.ts
-	Configure the roles in cypress/fixtures/configs/roles.json
-	Add RBAC resource mapping in cypress/fixtures/rbac/resource_mappings.json
-	Create test spec file in cypress/e2e folder
	-	Import methods from requestHelper.ts which would run and validate generic tests by default
	-	Add API specific tests using [cy.request()](https://docs.cypress.io/api/commands/request)

## Running the tests

-   Set the environment and user credentials by setting below environment variables <br />

	| Variable                   | Sample Value                         |
	| -------------------------- | ------------------------------------ |
	| CYPRESS_BASE_URL           | https://cloud-dev.test.com        |
	| CYPRESS_API_BASE_URL       | https://ui.api.cloud-dev.test.com |
	| CYPRESS_PA_ST_HCAAS_USER   | pa_st_hcaas@test.awsapps.com       |
	| CYPRESS_PA_ST_ONLY_USER    | pa_st_only@test.awsapps.com        |
	| CYPRESS_PA_HCAAS_ONLY_USER | pa_hcaas_only@test.awsapps.com     |
	| CYPRESS_PA_LCA_USER        | pa_lca@test.awsapps.com            |
	| CYPRESS_PORTAL_PASSWORD    | P@ssw0rd                             |

-   Run below command to run the tests in CI mode <br />
    `npm run cy:test -- -b chrome`
## Utility Functions

-	APP
	-	Login to the app and extract JWT token
	-	Extract user details from /user/details API
	-	Extract customer contracts from /accounts/info API

-	Common
	-	Verify duplicates in an array of strings/objects
	-	Match API response with JSON schema
	-	(Deep) compare JSON objects
	-	Verify the list of strings are in ascending/descending order
	-	Generate random number
	-	Generate random string

-	API Requests (from JSON test template)
	-	Prepare Request Headers dynamically
	-	Prepare Request Payload dynamically
	-	Generate dynamic tests for Missing JWT Token
	-	Generate dynamic tests for Invalid JWT token
	-	Generate dynamic tests for Missing Authorization Header
	-	Generate dynamic tests for Missing puid/cuid/customerId headers
	-	Generate dynamic tests for Invalid puid/cuid/customerId header values
	-	Generate dynamic tests for RBAC Tests
## Allure Reports

-   Clear Report <br /> `npm run report:clear`
-   Generate Report <br /> `npm run report:generate`
-   Open Report <br /> `npm run report:open`
