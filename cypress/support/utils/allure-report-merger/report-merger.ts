import { PythonShell } from 'python-shell';

PythonShell.run(
	'cypress/support/utils/allure-report-merger/report-merger.py',
	null,
	function (err) {
		if (err) throw err;
		console.log(
			'Allure Report Merged to single file - results/allure-report/allure-report.html',
		);
	},
);
