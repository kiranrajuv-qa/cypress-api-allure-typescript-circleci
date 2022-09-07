const { uniq } = Cypress._;
const equal = require('deep-equal');
const matcher = require('match-schema');
const validate = require('jsonschema').validate;

export function verifyDuplicates(responseObj: Array<object>, key: string) {
	const duplicateIds = responseObj
		.map((v) => v[key])
		.filter((v, i, vIds) => vIds.indexOf(v) !== i);
	const duplicates = responseObj.filter((obj) =>
		duplicateIds.includes(obj[key]),
	);
	if (duplicates.length != 0)
		cy.log('Duplicates Found: ' + JSON.stringify(duplicates));
	expect(duplicates.length, 'Duplicate count').to.eq(0);
}

export function verifyDuplicatesInArray(list: string[]) {
	const distinct = uniq(list);
	expect(distinct, 'All items are unique').to.have.length(list.length);
}

export function deepEqual(actual: any, expected: any) {
	return equal(actual, expected);
}

export function deepEqualWithKeys(
	actual: Array<object>,
	keyActual: string,
	expected: Array<object>,
	keyExpected: string,
) {
	const sortedActual = actual.sort((a, b) => {
		return a[keyActual].localeCompare(b[keyActual]);
	});

	const sortedExpected = expected.sort((a, b) => {
		return a[keyExpected].localeCompare(b[keyExpected]);
	});

	return equal(sortedActual, sortedExpected);
}

export function matchWithSchema(json, schema) {
	const { matched, errorKey } = matcher.match(json, schema);
	if (!matched) cy.log('Response Schema Not Matched. Failed at', errorKey);
	expect(matched, 'Match Response Schema').to.be.true;
}

export function validateResponseSchema(responseObj, responseSchema) {
	const result = validate(responseObj, responseSchema);
	const err: number = result.errors.length;
	if (err > 0)
		cy.log('Response Schema Not Matched', JSON.stringify(result.errors));
	expect(err, 'Response Schema Error Count').to.be.eq(0);
}

export function isAscending(list: string[]) {
	return list.slice(1).every((e, i) => e > list[i]);
}

export function isDescending(list: string[]) {
	return list.slice(1).every((e, i) => e < list[i]);
}

export function generateRandomNumber(max: number) {
	// generate random number
	let rand = Math.random();
	// multiply with max
	rand = Math.floor(rand * max);
	return rand;
}

export function generateRandomString(max: number) {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~^!#$%&()*"+,\'-./:;?@_{}|[]\\=';
	const charactersLength = characters.length;
	for (let i = 0; i < max; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		);
	}
	return result;
}
