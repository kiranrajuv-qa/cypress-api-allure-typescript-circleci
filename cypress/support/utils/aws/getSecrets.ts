const SecretsManager = require('./secretsManager.ts');

export async function getSecrets() {
	const secretName = 'test/automation';
	const region = 'us-west-2';
	var secrets = await SecretsManager.getSecret(secretName, region);
	console.log(secrets);
	return secrets;
}

getSecrets();
