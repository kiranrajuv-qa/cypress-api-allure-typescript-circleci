import { skipOn } from '@cypress/skip-test';
import * as upath from 'upath';
import { mirror_base_url } from '../../../support/constants/cpmirror/baseUrl';
import { getAllNotesResponseSchema } from '../../../support/schemas/cpmirror/customers';
import {
	generateRandomString,
	validateResponseSchema,
	verifyDuplicates,
} from '../../../support/utils/commonUtils';
import {
	callApi,
	filterIgnoredTests,
	prepareHeaderObj,
	preparePayload,
	runRBACTests,
	runTestsAuthHeaderMissing,
	runTestsHeadersMissing,
	runTestsInvalidHeaderValues,
	runTestsInvalidJWTToken,
	runTestsJWTTokenMissing,
} from '../../../support/utils/requestHelper';

let notesTests: object[] = require('../../../fixtures/tests/cpmirror/customers/customer360_notes.json');

function addNote(notesContent: string, expectedResponseCode: number) {
	cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
		const headersObj = prepareHeaderObj(notesTests[1]);
		headersObj['content-type'] = 'application/json';
		headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
		const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
		cy.fixture(
			upath
				.normalizeSafe(__dirname)
				.replace('cypress' + upath.sep + 'e2e', 'testData') +
				upath.sep +
				notesTests[1]['payload'],
		).then((payload: object) => {
			payload = preparePayload(payload, tmpData, 'pa_hcaas_st');
			payload['note'] = notesContent;
			callApi(
				notesTests[1]['method'],
				mirror_base_url + notesTests[1]['url'],
				payload,
				headersObj,
				jwtToken,
			).then((response) => {
				expect(response.status).to.eq(expectedResponseCode);
			});
		});
	});
}

function editNote(
	noteId: number,
	notesContent: string,
	expectedResponseCode: number,
) {
	cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
		const headersObj = prepareHeaderObj(notesTests[2]);
		headersObj['content-type'] = 'application/json';
		headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
		const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
		cy.fixture(
			upath
				.normalizeSafe(__dirname)
				.replace('cypress' + upath.sep + 'e2e', 'testData') +
				upath.sep +
				notesTests[2]['payload'],
		).then((payload: object) => {
			payload = preparePayload(payload, tmpData, 'pa_hcaas_st');
			payload['noteid'] = noteId;
			payload['note'] = notesContent;
			callApi(
				notesTests[2]['method'],
				mirror_base_url + notesTests[2]['url'],
				payload,
				headersObj,
				jwtToken,
			).then((response) => {
				expect(response.status).to.eq(expectedResponseCode);
			});
		});
	});
}

describe('CUSTOMERS Facet - Customer 360 - NOTES', () => {
	const filteredTests = filterIgnoredTests(notesTests);
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

	let otherNoteId: number;

	skipOn(notesTests[0]['ignore'] == 'Y', () => {
		describe('Get All Notes', () => {
			it('Get All Notes - without query params', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(notesTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						notesTests[0]['method'],
						mirror_base_url +
							notesTests[0]['url'].substring(
								0,
								notesTests[0]['url'].indexOf('?'),
							),
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						expect(response.body.notes).to.be.exist;
						expect(response.body.paginationResponse).to.be.null;
					});
				});
			});

			it('Get All Notes - without query param (page)', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(notesTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						notesTests[0]['method'],
						mirror_base_url + '/v1/partner/racetrack/notes?rows=10',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						expect(response.body.notes).to.be.exist;
						expect(response.body.paginationResponse).to.be.null;
					});
				});
			});

			it('Get All Notes - without query param (rows)', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(notesTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						notesTests[0]['method'],
						mirror_base_url + '/v1/partner/racetrack/notes?page=1',
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						expect(response.body.notes).to.be.exist;
						expect(response.body.paginationResponse).to.be.null;
					});
				});
			});

			it('Get All Notes', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(notesTests[0]);
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					callApi(
						notesTests[0]['method'],
						mirror_base_url + notesTests[0]['url'],
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
						validateResponseSchema(
							response.body,
							getAllNotesResponseSchema,
						);
						verifyDuplicates(response.body.notes, 'noteid');
						response.body.notes.forEach((noteItem) => {
							expect(noteItem.cuid).to.eq(headersObj['cuid']);
							expect(noteItem.puid).to.eq(headersObj['puid']);
							expect(noteItem.note).to.have.length.of.at.least(3);
							expect(noteItem.note).to.have.length.of.at.most(
								520,
							);
						});
						expect(response.body.paginationResponse.page).to.eq(1);
						expect(response.body.paginationResponse.rows).to.eq(10);

						const otherUserNotes = response.body.notes.filter(
							(noteItem) =>
								noteItem.userid !=
								tmpData['pa_hcaas_st'].userid,
						);
						otherNoteId = otherUserNotes[0].noteid;
					});
				});
			});
		});
	});

	let noteId: number;
	skipOn(notesTests[1]['ignore'] == 'Y', () => {
		describe('Add Note', () => {
			it('Add Note', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(notesTests[1]);
					headersObj['content-type'] = 'application/json';
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					cy.fixture(
						upath
							.normalizeSafe(__dirname)
							.replace(
								'cypress' + upath.sep + 'e2e',
								'testData',
							) +
							upath.sep +
							notesTests[1]['payload'],
					).then((payload: object) => {
						payload = preparePayload(
							payload,
							tmpData,
							'pa_hcaas_st',
						);
						callApi(
							notesTests[1]['method'],
							mirror_base_url + notesTests[1]['url'],
							payload,
							headersObj,
							jwtToken,
						).then((response) => {
							expect(response.status).to.eq(200);
							noteId = response.body.noteid;
							//cy.log('Note ID: ' + noteId);
							expect(response.body.title).to.eq(payload['title']);
							expect(response.body.note).to.eq(payload['note']);
							expect(response.body.puid + '').to.eq(
								payload['puid'],
							);
							expect(response.body.cuid).to.eq(payload['cuid']);
							expect(response.body.userid).to.eq(
								payload['userid'],
							);
							expect(response.body.username).to.eq(
								payload['username'],
							);
							expect(response.body.creation).to.be.exist;
							expect(response.body.edited).to.be.false;
						});
					});
				});
			});

			it('Add Note with max length', () => {
				addNote(generateRandomString(520), 200);
			});

			it('Add Note with min length', () => {
				addNote(generateRandomString(3), 200);
			});

			it('Add Note with note length more than allowed limit', () => {
				addNote(generateRandomString(521), 500);
			});

			it('Add Note with note length less than allowed limit', () => {
				addNote(generateRandomString(2), 500);
			});

			it('Add Note with empty note', () => {
				addNote('', 400);
			});

			it('Add Note with only spaces', () => {
				addNote('   ', 400);
			});

			it('Add Note with only new line characters', () => {
				addNote('\n\n\n', 400);
			});

			it('Add Note with multiple lines', () => {
				addNote(
					'this note contains multiple lines\n\nthis note contains multiple lines\n\nthis note contains multiple lines',
					200,
				);
			});

			it('Add Note with html tags', () => {
				addNote('<img>', 400);
			});
		});
	});

	skipOn(notesTests[2]['ignore'] == 'Y', () => {
		describe('Edit Note', () => {
			it('Edit Note', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(notesTests[2]);
					headersObj['content-type'] = 'application/json';
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					cy.fixture(
						upath
							.normalizeSafe(__dirname)
							.replace(
								'cypress' + upath.sep + 'e2e',
								'testData',
							) +
							upath.sep +
							notesTests[2]['payload'],
					).then((payload: object) => {
						payload['noteid'] = noteId;
						payload = preparePayload(
							payload,
							tmpData,
							'pa_hcaas_st',
						);
						callApi(
							notesTests[2]['method'],
							mirror_base_url + notesTests[2]['url'],
							payload,
							headersObj,
							jwtToken,
						).then((response) => {
							expect(response.status).to.eq(200);
							expect(response.body.title).to.eq(payload['title']);
							expect(response.body.note).to.eq(payload['note']);
							expect(response.body.puid + '').to.eq(
								payload['puid'],
							);
							expect(response.body.cuid).to.eq(payload['cuid']);
							expect(response.body.userid).to.eq(
								payload['userid'],
							);
							expect(response.body.username).to.eq(
								payload['username'],
							);
							expect(response.body.noteid).to.eq(
								payload['noteid'],
							);
							expect(response.body.creation).to.be.null;
							expect(response.body.edited).to.be.true;
						});
					});
				});
			});

			it('Edit Note with max length', () => {
				editNote(noteId, generateRandomString(520), 200);
			});

			it('Edit Note with min length', () => {
				editNote(noteId, generateRandomString(3), 200);
			});

			it('Edit Note with note length more than allowed limit', () => {
				editNote(noteId, generateRandomString(521), 500);
			});

			it('Edit Note with note length less than allowed limit', () => {
				editNote(noteId, generateRandomString(2), 500);
			});

			it('Edit Note with only spaces', () => {
				editNote(noteId, '   ', 400);
			});

			it('Edit Note with only new line characters', () => {
				editNote(noteId, '\n\n\n', 400);
			});

			it('Edit Note with multiple lines', () => {
				editNote(
					noteId,
					'this note contains multiple lines\n\nthis note contains multiple lines\n\nthis note contains multiple lines',
					200,
				);
			});

			it('Edit Note with html tags', () => {
				editNote(noteId, '<img>', 400);
			});

			it.skip('Edit Note of another user', () => {
				editNote(otherNoteId, generateRandomString(3), 401);
			});
		});
	});

	skipOn(notesTests[3]['ignore'] == 'Y', () => {
		describe('Delete Note', () => {
			it('Delete Note', () => {
				cy.readFile('cypress/fixtures/temp.json').then((tmpData) => {
					const headersObj = prepareHeaderObj(notesTests[3]);
					headersObj['content-type'] = 'application/json';
					headersObj['puid'] = tmpData['pa_hcaas_st'].puid;
					const jwtToken: string = tmpData['pa_hcaas_st'].jwtToken;
					callApi(
						notesTests[3]['method'],
						mirror_base_url +
							notesTests[3]['url'].replace('__noteId', noteId),
						null,
						headersObj,
						jwtToken,
					).then((response) => {
						expect(response.status).to.eq(200);
					});
				});
			});

			it.skip('Delete Note of another user', () => {});
		});
	});
});
