import * as upath from 'upath';
import { mirror_base_url } from '../../../support/constants/cpmirror/baseUrl';
import {
	filterIgnoredTests,
	runRBACTests,
	runTestsAuthHeaderMissing,
	runTestsHeadersMissing,
	runTestsInvalidHeaderValues,
	runTestsInvalidJWTToken,
	runTestsJWTTokenMissing,
} from '../../../support/utils/requestHelper';

let engagementDashboardTests: object[] = require('../../../fixtures/tests/cpmirror/today/engagement_dashboard.json');

describe('TODAY Facet - Success Track Lifecycle Insights', () => {
	const filteredTests = filterIgnoredTests(engagementDashboardTests);
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
});
