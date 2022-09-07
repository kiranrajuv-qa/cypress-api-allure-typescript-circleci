const tmpData = require('../../fixtures/temp.json');

export function getSTCustomers(role: string, accessState: string) {
	return tmpData[role].customerList.filter((customer) => {
		return (
			customer.successTrackFlag &&
			customer.user_access_state == accessState
		);
	});
}

export function getHCAASCustomers(role: string, accessState: string) {
	return tmpData[role].customerList.filter((customer) => {
		return customer.hcaasFlag && customer.user_access_state == accessState;
	});
}

export function getCuidSTGrantedCustomer(role: string) {
	return Number(Array.from(getSTCustomers(role, 'granted'))[0]['cuid']);
}
