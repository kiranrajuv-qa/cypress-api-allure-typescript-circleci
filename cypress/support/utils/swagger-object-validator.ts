import * as SwaggerValidator from 'swagger-object-validator';
const validator = new SwaggerValidator.Handler(process.argv[2]);

validator.validateModel(process.argv[3], process.argv[3], (err, result) => {
	console.log(result.humanReadable());
});
