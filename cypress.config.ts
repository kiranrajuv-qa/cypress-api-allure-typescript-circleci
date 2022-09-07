import { defineConfig } from 'cypress';
import * as fs from 'fs';

const allureWriter = require('@shelex/cypress-allure-plugin/writer');

export default defineConfig({
	defaultCommandTimeout: 20000,
	pageLoadTimeout: 60000,
	requestTimeout: 20000,
	responseTimeout: 30000,
	execTimeout: 30000,
	screenshotOnRunFailure: false,
	video: false,
	screenshotsFolder: 'results/screenshots',
	videosFolder: 'results/videos',
	downloadsFolder: 'results/downloads',
	retries: {
		runMode: 1,
		openMode: 0,
	},

	reporter: 'cypress-multi-reporters',
	reporterOptions: {
		configFile: 'reporter-config.json',
	},

	env: {
		allure: true,
		allureResultsPath: 'results/allure',
		allureAttachRequests: true,
		allureClearSkippedTests: true,
	},
	e2e: {
		setupNodeEvents(on, config) {
			on('before:run', () => {
				fs.writeFile('cypress/fixtures/temp.json', '{}', (err) => {
					if (err) console.log(err);
				});
			});
			on('after:run', () => {
				fs.unlink('cypress/fixtures/temp.json', (err) => {
					if (err) console.log(err);
				});
			});
			allureWriter(on, config);
			return config;
		},
	},
});
