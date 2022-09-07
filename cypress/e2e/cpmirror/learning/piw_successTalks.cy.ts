import * as upath from 'upath';
import { learning_base_url } from '../../../support/constants/cpmirror/baseUrl';
import {
	filterIgnoredTests,
	runRBACTests,
	runTestsAuthHeaderMissing,
	runTestsHeadersMissing,
	runTestsInvalidHeaderValues,
	runTestsInvalidJWTToken,
	runTestsJWTTokenMissing,
} from '../../../support/utils/requestHelper';

let piwSuccessTalksTests: object[] = require('../../../fixtures/tests/cpmirror/learning/piw_successTalks.json');

describe('LEARNING Facet - PIWs / Success Talks', () => {
	const filteredTests = filterIgnoredTests(piwSuccessTalksTests);
	runTestsJWTTokenMissing(filteredTests, learning_base_url);
	runTestsInvalidJWTToken(filteredTests, learning_base_url);
	runTestsAuthHeaderMissing(filteredTests, learning_base_url);
	runTestsHeadersMissing(filteredTests, learning_base_url);
	runTestsInvalidHeaderValues(filteredTests, learning_base_url);
	runRBACTests(
		filteredTests,
		learning_base_url,
		upath
			.normalizeSafe(__dirname)
			.replace('cypress' + upath.sep + 'e2e', 'testData') + upath.sep,
	);
});
