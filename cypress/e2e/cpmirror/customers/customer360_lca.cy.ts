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

import * as upath from 'upath';
let lcaTests: object[] = require('../../../fixtures/tests/cpmirror/customers/customer360_lca.json');

describe.skip('CUSTOMERS Facet - Customer 360 - LCA', () => {
	const filteredTests = filterIgnoredTests(lcaTests);
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
