import {
	allSolutionIds,
	allSuccessTracks,
	cxLevels,
	pitstopIds,
	pitstopStages,
	usecaseIds,
	usecases,
} from '../../constants/cpmirror/customers';

export const getAllNotesResponseSchema = {
	type: 'object',
	notes: {
		type: 'array',
		items: [
			{
				type: 'object',
				title: {
					type: 'string',
				},
				note: {
					type: 'string',
				},
				creation: {
					type: 'string',
				},
				puid: {
					type: 'number',
				},
				cuid: {
					type: 'number',
				},
				userid: {
					type: 'string',
				},
				username: {
					type: 'string',
				},
				edited: {
					type: 'boolean',
				},
				noteid: {
					type: 'number',
				},
			},
		],
	},
	paginationResponse: {
		type: 'object',
		page: {
			type: 'number',
		},
		pages: {
			type: 'number',
		},
		rows: {
			type: 'number',
		},
		total: {
			type: 'number',
		},
	},
};

export const getAccountsInfoResponseSchema = {
	type: 'object',
	customerAccountsInfoView: {
		type: 'array',
		items: [
			{
				type: 'object',
				partnerid: {
					type: 'number',
				},
				customerid: {
					type: 'string',
				},
				customername: {
					type: 'string',
				},
				puid: {
					type: 'number',
				},
				cuid: {
					type: 'number',
				},
				country: {
					type: 'string',
				},
				region: {
					type: 'string',
				},
				partner_access_status: {
					type: 'string',
				},
				cxp_onboarded: {
					type: 'boolean',
				},
				cp_access_requested_by: {
					type: 'string',
				},
				cxp_onboarded_date: {
					type: 'string',
				},
				hcaasFlag: {
					type: 'boolean',
				},
				successTrackFlag: {
					type: 'boolean',
				},
				user_access_state: {
					type: 'string',
				},
				crossLaunchUrl: {
					type: 'string',
				},
				offerDomainList: {
					type: 'array',
					element: {
						type: 'string',
					},
				},
			},
		],
	},
	paginationResponse: {
		type: 'object',
		page: {
			type: 'number',
		},
		pages: {
			type: 'number',
		},
		rows: {
			type: 'number',
		},
		total: {
			type: 'number',
		},
	},
};

export const getAccountFilterCountResponseSchema = {
	type: 'object',
	data: {
		type: 'array',
		items: [
			{
				type: 'object',
				key: {
					type: 'string',
				},
				count: {
					type: 'number',
				},
				keyId: {
					type: 'string',
				},
			},
		],
	},
};

export const getSuccessTrackInfoResponseSchema = {
	type: 'array',
	items: [
		{
			type: 'object',
			solutionName: {
				type: 'string',
			},
			pxCloudEnabled: {
				type: 'boolean',
			},
			accessProvided: {
				type: 'boolean',
			},
			solutionId: {
				type: 'string',
			},
			noOfUsecases: {
				type: 'number',
			},
		},
	],
};

export const getPitstopInfoResponseSchema = {
	$ref: '#/definitions/PitstopResponse',
	definitions: {
		PitstopResponse: {
			type: 'object',
			additionalProperties: false,
			properties: {
				buId: {
					type: 'string',
					format: 'integer',
				},
				cavId: {
					type: 'string',
					format: 'integer',
				},
				createdDate: {
					type: 'null',
				},
				processedOn: {
					type: 'string',
					format: 'date-time',
				},
				customerId: {
					type: 'string',
				},
				updatedDate: {
					type: 'string',
					format: 'date-time',
				},
				manual: {
					type: 'boolean',
				},
				items: {
					type: 'array',
					items: {
						$ref: '#/definitions/Item',
					},
				},
				buName: {
					type: 'string',
				},
			},
			title: 'PitstopResponse',
		},
		Item: {
			type: 'object',
			additionalProperties: false,
			properties: {
				cxLevel: {
					type: 'integer',
					enum: cxLevels,
				},
				hasSubscriptions: {
					type: 'null',
				},
				name: {
					type: 'string',
					enum: allSuccessTracks,
					uniqueItems: true,
				},
				description: {
					type: 'string',
				},
				isPXCloudEnabled: {
					type: 'boolean',
				},
				solutionId: {
					type: 'string',
					enum: allSolutionIds,
					uniqueItems: true,
				},
				accessProvided: {
					type: 'boolean',
				},
				usecases: {
					type: 'array',
					items: {
						$ref: '#/definitions/Usecase',
					},
				},
				percentCoveredAssets: {
					anyOf: [
						{
							type: 'integer',
						},
						{
							type: 'null',
						},
					],
				},
			},
			title: 'Item',
		},
		Usecase: {
			type: 'object',
			additionalProperties: false,
			properties: {
				lastUpdatedTimestamp: {
					type: 'integer',
				},
				cxLevel: {
					type: 'integer',
					enum: cxLevels,
				},
				bypassCoveredAssetsThreshold: {
					type: 'boolean',
				},
				adoptionPercentage: {
					type: 'integer',
					minimum: 0,
					maximum: 100,
				},
				lastProgressionTimestamp: {
					type: 'integer',
				},
				useCaseId: {
					type: 'string',
					format: 'integer',
					enum: usecaseIds,
					uniqueItems: true,
				},
				name: {
					type: 'string',
					enum: usecases,
					uniqueItems: true,
				},
				description: {
					type: 'string',
				},
				pitstops: {
					type: 'array',
					items: {
						$ref: '#/definitions/Pitstop',
					},
				},
				currentPitstopId: {
					type: 'string',
					enum: pitstopStages,
				},
				realCurrentPitstopId: {
					type: 'string',
					enum: pitstopIds,
				},
				currentPitstop: {
					type: 'string',
					enum: pitstopStages,
				},
			},
			title: 'Usecase',
		},
		Pitstop: {
			type: 'object',
			additionalProperties: false,
			properties: {
				pitstopActions: {
					type: 'array',
					items: {
						$ref: '#/definitions/PitstopAction',
					},
				},
				completionPercentage: {
					type: 'integer',
					minimum: 0,
					maximum: 100,
				},
				sequence: {
					type: 'integer',
					uniqueItems: true,
				},
				lastUpdatedTimestamp: {
					anyOf: [
						{
							type: 'integer',
						},
						{
							type: 'null',
						},
					],
				},
				name: {
					type: 'string',
				},
				description: {
					type: 'string',
				},
				pitstopId: {
					type: 'string',
				},
				pitstopComplete: {
					type: 'boolean',
				},
			},
			title: 'Pitstop',
		},
		PitstopAction: {
			type: 'object',
			additionalProperties: false,
			properties: {
				completeManual: {
					type: 'boolean',
				},
				pitstopActionId: {
					type: 'string',
					uniqueItems: true,
				},
				sequenceNumber: {
					type: 'integer',
					uniqueItems: true,
				},
				lastUpdatedTimestamp: {
					anyOf: [
						{
							type: 'integer',
						},
						{
							type: 'null',
						},
					],
				},
				name: {
					type: 'string',
					uniqueItems: true,
				},
				description: {
					type: 'string',
					uniqueItems: true,
				},
				trackedViaTelemetry: {
					type: 'boolean',
				},
				complete: {
					type: 'boolean',
				},
				taskTypeName: {
					$ref: '#/definitions/TaskTypeName',
				},
				tooltips: {
					type: 'array',
					items: {
						$ref: '#/definitions/Tooltip',
					},
				},
				completeAuto: {
					type: 'boolean',
				},
			},
			title: 'PitstopAction',
		},
		Tooltip: {
			type: 'object',
			additionalProperties: false,
			properties: {
				sequence: {
					type: 'integer',
					uniqueItems: true,
				},
				tooltip: {
					type: 'string',
					uniqueItems: true,
				},
				label: {
					type: 'string',
					uniqueItems: true,
				},
			},
			title: 'Tooltip',
		},
		TaskTypeName: {
			type: 'string',
			enum: ['Auto', 'Recommended'],
			title: 'TaskTypeName',
		},
	},
};
