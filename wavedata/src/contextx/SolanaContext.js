'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import {
	establishConnection,
	checkProgram,
	SystemProgram,
	InitializeState,
	getOutput,
	UpdateOrInsertData,
	CreateNewPDA
} from './solana/client/wavedata.mjs';


const AppContext = createContext({
	sol_api: null,
	sol_signerAddress: null,
	sol_contract: false,
	sol_sendTransaction: async (method, args = [], value = 0) => { },
	sol_ReadContractByQuery: async (query, args = null) => { },
	sol_getMessage: async (find_contract) => { },
	sol_getQuery: (find_contract) => { return find_contract; },
	sol_getTX: async (find_contract) => { },
	sol_currentChain: null,

});


export function SolanaProvider({ children }) {
	const [signerAddress, setSignerAddress] = useState(null);
	const [contract, setContract] = useState(null);
	const [api, setApi] = useState(null);

	async function sendTransaction(method, args = []) {
		await CreateNewPDA();
		switch (method) {
			case "CreateAccount":
				await CreateAccount.apply(this, args)
				break;
			case "UpdatePrivatekey":
				await UpdatePrivatekey.apply(this, args);
				break;
			case "UpdateAccessToken":
				await UpdateAccessToken.apply(this, args);
				break;
			case "CreateStudy":
				await CreateStudy.apply(this, args);
				break;
			case "CreateSurvey":
				await CreateSurvey.apply(this, args);
				break;
			case "CreateOrSaveSections":
				await CreateOrSaveSections.apply(this, args);
				break;
			case "CreateSurveyCategory":
				await CreateSurveyCategory.apply(this, args);
				break;
			case "UpdateStudy":
				await UpdateStudy.apply(this, args);
				break;
			case "UpdateSurvey":
				await UpdateSurvey.apply(this, args);
				break;
			case "UpdateReward":
				await UpdateReward.apply(this, args);
				break;
			case "UpdateAudience":
				await UpdateAudience.apply(this, args);
				break;
			case "UpdateStudyAges":
				await UpdateStudyAges.apply(this, args);
				break;
			case "CreateOrSaveStudyTitle":
				await CreateOrSaveStudyTitle.apply(this, args);
				break;
			case "UpdateUser":
				await UpdateUser.apply(this, args);
				break;
			case "UpdateFhir":
				await UpdateFhir.apply(this, args);
				break;
			case "CreateOngoingStudy":
				await CreateOngoingStudy.apply(this, args);
				break;
			case "CreateCompletedSurveys":
				await CreateCompletedSurveys.apply(this, args);
				break;
			case "CreateCompletedInformedConsent":
	
				await CreateCompletedInformedConsent.apply(this, args);
				break;
		
		}

	}

	async function getMapsFromContract(mapName) {
		let db = await getOutput();
		return db.map.get(mapName) !== undefined ? JSON.parse(db.map.get(mapName)) : [];
	}
	//Not using in front
	async function ReadVariablesFromContract(variable) {
		switch (variable) {
			case "_UserIds":
				return (await getMapsFromContract("_userMap")).length;
			case "_StudyIds":
				let db = await getOutput();
				return (await getAllContainsMapKeys(db.map,"_studyMap[")).length;
			case "_SurveyIds":
				return (await getMapsFromContract("_surveyMap")).length;
			case "_SurveyCategoryIds":
				return (await getMapsFromContract("_categoryMap")).length;
			case "_OngoingIds":
				return (await getMapsFromContract("_ongoingMap")).length;
			case "_AnsweredIds":
				return (await getMapsFromContract("_questionanswerdMap")).length;

		}
	}

	//Not using in front
	async function ReadMapsByIdFromContract(variable, args = null) {
		let db, oldMaps, fullJSON;
		switch (variable) {
			case "_userMap":
				return (await getMapsFromContract("_userMap"))[args[0]];
			case "_studyMap":

				db = await getOutput();
				oldMaps = getAllContainsMapKeys(db.map, `_studyMap[${args[0]}]`);
				const mapName = oldMaps[0];
				let value = db.map.get(mapName)
				return  JSON.parse(value);
			case "_studyAudienceMap":
				let _studyAudienceMap = (await getMapsFromContract("_studyAudienceMap"));
				for (let i = 0; i < _studyAudienceMap.length; i++) {
					const element = _studyAudienceMap[i];
					if (args[0] === element.studyId) {
						return _studyAudienceMap[i].audienceInfo;
					}
				}
				return "[]";
			case "_surveyMap":
				return (await getMapsFromContract("_surveyMap"))[args[0]];
			case "_categoryMap":
				return (await getMapsFromContract("_categoryMap"))[args[0]];
			case "_sectionsMap":

				db = await getOutput();
				oldMaps = getAllContainsMapKeys(db.map, `_sectionsMap[${args[0]}]`);
				fullJSON = "";
				for (let i = 0; i < oldMaps.length; i++) {
					const mapName = oldMaps[i];
					let value = db.map.get(mapName)
					if (value !== "-1" || value !== null) {
						fullJSON += value;
					}
				}
				return fullJSON;
			case "_fhirMap":
				db = await getOutput();
				oldMaps = getAllContainsMapKeys(db.map, `_fhirMap[${args[0]}]`);
				fullJSON = "";
				for (let i = 0; i < oldMaps.length; i++) {
					const mapName = oldMaps[i];
					let value = db.map.get(mapName)
					if (value !== "-1" || value !== null) {
						fullJSON += value;
					}
				}
				return fullJSON;

			case "_ongoingMap":
				return (await getMapsFromContract("_ongoingMap"))[args[0]];
			case "_questionanswerdMap":
				return (await getMapsFromContract("_questionanswerdMap"))[args[0]];
			case "_completedsurveyMap":
				return (await getMapsFromContract("_completedsurveyMap"))[args[0]];

		}
	}

	//Using all here
	async function ReadContractByQuery(method, args = []) {

		if (args === null) {
			return await ReadVariablesFromContract(method);
		}

		switch (method) {
			case "CheckEmail":
				return await CheckEmail.apply(this, args)
				break;
			case "Login":
				return await Login.apply(this, args)
				break;
			case "getUserDetails":
				return await getUserDetails.apply(this, args)
				break;
			case "getAllSurveysIDByStudy":
				return await getAllSurveysIDByStudy.apply(this, args)
				break;
			case "GetOngoingStudy":
				return await GetOngoingStudy.apply(this, args)
				break;
			case "getAllCompletedSurveysIDByUser":
				return await getAllCompletedSurveysIDByUser.apply(this, args)
				break;
			default:
				return await ReadMapsByIdFromContract(method, args)
		}

	}
	function getQuery(find_contract) {
		return find_contract;
	}

	const fetchData = async () => {
		if (window.localStorage.getItem("type") === "solana") {
			try {
				await window.solflare.connect();
				// Establish connection to the cluster
				await establishConnection();

				// Check if the program has been deployed
				await checkProgram();

				let output = await getOutput();
				if (!output.initialized) {
					await InitializeState();
				}

				window.contract = true;
				setContract(true);
				setSignerAddress(window.solflare.publicKey.toBase58());
				setApi(true);

			} catch (error) {
				console.error(error);
			}
		}
	};
	useEffect(() => {

		setTimeout(() => {
			fetchData();
		}, 200)

	}, []);


	return <AppContext.Provider value={{ sol_signerAddress: signerAddress, sol_contract: contract, sol_api: api, sol_sendTransaction: sendTransaction, sol_ReadContractByQuery: ReadContractByQuery, sol_getQuery: getQuery }}>{children}</AppContext.Provider>;

}
export const useSolanaContext = () => useContext(AppContext);



//***************************************Get Functions***********************************//
export async function CheckEmail(email) {
	let db = await getOutput();
	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];
	for (let i = 0; i < _userMap.length; i++) {
		const element = _userMap[i];
		if (email === element.email) return element.userId;
	}
	return "False";
}

export async function Login(email, password) {
	let db = await getOutput();
	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];
	for (let i = 0; i < _userMap.length; i++) {
		const element = _userMap[i];
		if (email === element.email && password === element.password) return element.userId;
	}
	return "False";
}


export async function getUserDetails(userId) {
	let db = await getOutput();
	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];

	for (let i = 0; i < _userMap.length; i++) {
		const element = _userMap[i];
		if (userId === element.userId) return element;
	}
	return "False";
}


export async function getAllSurveysIDByStudy(studyId) {
	let db = await getOutput();
	let _surveyMap = db.map.get("_surveyMap") !== undefined ? JSON.parse(db.map.get("_surveyMap")) : [];
	let allSurveys = [];

	for (let i = 0; i < _surveyMap.length; i++) {
		const element = _surveyMap[i];
		if (studyId === element.studyId) allSurveys.push(element);
	}
	return allSurveys;
}


export async function GetOngoingStudy(userId) {
	let db = await getOutput();
	let _ongoingMap = db.map.get("_ongoingMap") !== undefined ? JSON.parse(db.map.get("_ongoingMap")) : [];

	for (let i = 0; i < _ongoingMap.length; i++) {
		const element = _ongoingMap[i];
		if (userId === element.userId) return element.studyId;
	}
	return "False";
}


export async function getAllCompletedSurveysIDByUser(userId) {
	let db = await getOutput();
	let _completedsurveyMap = db.map.get("_completedsurveyMap") !== undefined ? JSON.parse(db.map.get("_completedsurveyMap")) : [];
	let result = [];
	for (let i = 0; i < _completedsurveyMap.length; i++) {
		const element = _completedsurveyMap[i];
		if (userId === element.userId) {
			result.push(i);
		};
	}
	return result;
}
export async function getCompletedInformedConsentId(user_id, study_id) {
	let db = await getOutput();
	let _completedinformedMap = db.map.get("_completedinformedMap") !== undefined ? JSON.parse(db.map.get("_completedinformedMap")) : [];

	for (let i = 0; i < _completedinformedMap.length; i++) {
		const element = _completedinformedMap[i];
		if (user_id === element.user_id && study_id === element.study_id) return element;
	}
	return "False";
}

//*****************************Send Transaction Functions*********************************//
export async function CreateAccount(full_name, email, password) {
	let db = await getOutput();
	var obj = {
		userId: 0,
		name: full_name,
		email: email,
		password: password,
		walletaddress: window.solflare.publicKey.toBase58(),
		image: "https://i.postimg.cc/SsxGw5cZ/person.jpg",
		credits: 0,
		accesstoken: "",
		fhirid: 0

	}
	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];
	obj['userId'] = _userMap.length;
	_userMap.push(obj);
	await UpdateOrInsertData('_userMap', JSON.stringify(_userMap));
}

export async function UpdatePrivatekey(userid, privatekey) {
	let db = await getOutput();
	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];
	for (let i = 0; i < _userMap.length; i++) {
		const element = _userMap[i];
		if (userid === element.userId) {
			_userMap[i].privatekey = privatekey;
		}
	}
	await UpdateOrInsertData('_userMap', JSON.stringify(_userMap));

}

export async function UpdateAccessToken(userid, accesstoken) {
	let db = await getOutput();
	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];
	for (let i = 0; i < _userMap.length; i++) {
		const element = _userMap[i];
		if (userid === element.userId) {
			_userMap[i].accesstoken = accesstoken;
		}
	}
	await UpdateOrInsertData('_userMap', JSON.stringify(_userMap));

}

export async function CreateStudy(userId, image, title, description, permission, contributors, audience, budget) {
	let db = await getOutput();
	var obj = {
		studyId: 0,
		userId: userId,
		image: image,
		title: title,
		description: description,
		permission: permission,
		contributors: contributors,
		audience: audience,
		budget: budget,
		rewardType: "SOL",
		rewardPrice: 0,
		totalSpendingLimit: budget,
		ages: "",
		titles: "",
	}
	let oldMaps = getAllContainsMapKeys(db.map, `_studyMap[`);

	obj['studyId'] = oldMaps.length;
	await UpdateOrInsertData(`_studyMap[${oldMaps.length}]`, JSON.stringify(obj));
}
export async function CreateSurvey(studyId, userId, name, description, date, image, reward) {
	let db = await getOutput();
	var obj = {
		surveyId: 0,
		studyId: studyId,
		userId: userId,
		name: name,
		description: description,
		date: date,
		image: image,
		reward: reward,
		submission: 0,
	};
	let _surveyMap = db.map.get("_surveyMap") !== undefined ? JSON.parse(db.map.get("_surveyMap")) : [];
	obj['surveyId'] = _surveyMap.length;
	_surveyMap.push(obj);

	await UpdateOrInsertData('_surveyMap', JSON.stringify(_surveyMap), { send: true, lamports: reward });
}
export async function getCurrentStringSize(key, value) {

	let instruction_data = {
		"method": "UpdateOrInsert",
		"args": [key, value]
	}
	let buffer_instruction = Buffer.from(JSON.stringify(instruction_data), "utf-8");
	return buffer_instruction.length;


}
export function getSlicedData(totalSize, metadata) {
	let limit = 800;
	let currentPos = 0;
	let newStrArr = [];
	if (totalSize > limit) {
		for (let i = 0; totalSize > limit; i++) {
			newStrArr.push(metadata.slice(currentPos, (currentPos + limit)));
			totalSize -= limit;
			currentPos += limit;
		}
	}

	newStrArr.push(metadata.slice(currentPos, (currentPos + limit)));
	return newStrArr
}
export function getAllContainsMapKeys(mapData, keyname) {
	let allFoundKeys = [];
	let allkeys = Array.from(mapData.keys());
	for (let i = 0; i < allkeys.length; i++) {
		if (allkeys[i].includes(keyname)) {
			allFoundKeys.push(allkeys[i]);
		}
	}
	return allFoundKeys;
}
export async function CreateOrSaveSections(surveyId, metadata) {
	let db = await getOutput();
	let totalSize = await getCurrentStringSize("_sectionsMap", metadata);
	let metadatas = getSlicedData(totalSize, metadata);
	let oldMaps = getAllContainsMapKeys(db.map, "_sectionsMap[");

	if (oldMaps.length >= metadatas.length) {
		for (let i = 0; i < oldMaps.length; i++) {
			const data = metadatas.length > i ? metadatas[i] : "-1";
			let mapName = `_sectionsMap[${surveyId}][${i}]`;
			await UpdateOrInsertData(mapName, data);
		}
	} else {
		for (let i = 0; i < metadatas.length; i++) {
			const data = metadatas[i];
			let mapName = `_sectionsMap[${surveyId}][${i}]`;
			await UpdateOrInsertData(mapName, data);
		}
	}
}
export async function CreateSurveyCategory(name, image) {
	let db = await getOutput();
	var obj = { category_id: 0, name: name, image: image };
	let _categoryMap = db.map.get("_categoryMap") !== undefined ? JSON.parse(db.map.get("_categoryMap")) : [];
	obj['category_id'] = _categoryMap.length;
	_categoryMap.push(obj);
	await UpdateOrInsertData('_categoryMap', JSON.stringify(_categoryMap));
}
export async function UpdateStudy(studyId, image, title, description, budget) {
	let db = await getOutput();
	let _studyMap = db.map.get("_studyMap["+studyId+"]") !== undefined ? JSON.parse(db.map.get("_studyMap["+studyId+"]")) : [];
	
	_studyMap.image = image;
	_studyMap.title = title;
	_studyMap.description = description;
	_studyMap.budget = budget;
	
	await UpdateOrInsertData("_studyMap["+studyId+"]", JSON.stringify(_studyMap));

}

export async function UpdateSurvey(surveyId, name, description, image, reward) {
	let db = await getOutput();
	let _surveyMap = db.map.get("_surveyMap") !== undefined ? JSON.parse(db.map.get("_surveyMap")) : [];
	for (let i = 0; i < _surveyMap.length; i++) {
		const element = _surveyMap[i];
		if (surveyId === element.surveyId) {
			_surveyMap[i].name = name;
			_surveyMap[i].description = description;
			_surveyMap[i].image = image;
			_surveyMap[i].reward = reward;
		}
	}
	await UpdateOrInsertData("_surveyMap", JSON.stringify(_surveyMap));

}

export async function UpdateReward(studyId, rewardType, rewardPrice, totalSpendingLimit) {
	let db = await getOutput();
	let _studyMap = db.map.get("_studyMap["+studyId+"]") !== undefined ? JSON.parse(db.map.get("_studyMap["+studyId+"]")) : [];
	_studyMap.rewardType = rewardType;
	_studyMap.rewardPrice = rewardPrice;
	_studyMap.totalSpendingLimit = totalSpendingLimit;
	await UpdateOrInsertData("_studyMap["+studyId+"]", JSON.stringify(_studyMap));

}

export async function UpdateAudience(studyId, audienceInfo) {
	let db = await getOutput();
	let _studyAudienceMap = db.map.get("_studyAudienceMap") !== undefined ? JSON.parse(db.map.get("_studyAudienceMap")) : [];
	let found = false;
	for (let i = 0; i < _studyAudienceMap.length; i++) {
		const element = _studyAudienceMap[i];
		if (studyId === element.studyId) {
			_studyAudienceMap[i].audienceInfo = audienceInfo;
			found = true;
		}
	}
	if (!found) {
		var obj = {
			studyId: studyId,
			audienceInfo: audienceInfo
		};
		_studyAudienceMap.push(obj);

	}
	await UpdateOrInsertData('_studyAudienceMap', JSON.stringify(_studyAudienceMap));

}

export async function UpdateStudyAges(studyId, agesInfo) {
	let db = await getOutput();
	let _studyMap = db.map.get("_studyMap["+studyId+"]") !== undefined ? JSON.parse(db.map.get("_studyMap["+studyId+"]")) : [];
	_studyMap.ages = agesInfo;
	await UpdateOrInsertData("_studyMap["+studyId+"]", JSON.stringify(_studyMap));
}
export async function CreateOrSaveStudyTitle(studyId, titlesInfo) {
	let db = await getOutput();
	let _studyMap = db.map.get("_studyMap["+studyId+"]") !== undefined ? JSON.parse(db.map.get("_studyMap["+studyId+"]")) : [];
	_studyMap.titles = titlesInfo;
	await UpdateOrInsertData("_studyMap["+studyId+"]", JSON.stringify(_studyMap));
}
export async function UpdateUser(userId, image, credits) {
	let db = await getOutput();
	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];
	for (let i = 0; i < _userMap.length; i++) {
		const element = _userMap[i];
		if (userId === element.userId) {
			_userMap[i].image = image;
			_userMap[i].credits = credits;
		}
	}
	await UpdateOrInsertData('_userMap', JSON.stringify(_userMap));

}

export async function UpdateFhir(userId, familyName, givenName, identifier, phone, gender, about, patient_id) {
	let db = await getOutput();
	var obj = {
		fhir_id: 0,
		userId: userId,
		familyName: familyName,
		givenName: givenName,
		identifier: identifier,
		phone: phone,
		gender: gender,
		about: about,
		patientId: patient_id,
	};
	let _fhirMap = db.map.get("_fhirMap") !== undefined ? JSON.parse(db.map.get("_fhirMap")) : [];
	let fhirid = _fhirMap.length;
	obj['fhir_id'] = fhirid;
	_fhirMap.push(obj);
	await UpdateOrInsertData('_fhirMap', JSON.stringify(_fhirMap));


	let _userMap = db.map.get("_userMap") !== undefined ? JSON.parse(db.map.get("_userMap")) : [];
	for (let i = 0; i < _userMap.length; i++) {
		const element = _userMap[i];
		if (userId === element.userId) {
			_userMap[i].fhirid = fhirid;
		}
	}
	await UpdateOrInsertData('_userMap', JSON.stringify(_userMap));

}

export async function CreateOngoingStudy(studyId, userId, date, givenPermission) {
	let db = await getOutput();
	var obj = {
		ongoingId: 0,
		studyId: studyId,
		userId: userId,
		date: date,
		givenPermission: givenPermission,
	};
	let _ongoingMap = db.map.get("_ongoingMap") !== undefined ? JSON.parse(db.map.get("_ongoingMap")) : [];
	let ongoingId = _ongoingMap.length;
	obj['ongoingId'] = ongoingId;
	_ongoingMap.push(obj);
	await UpdateOrInsertData('_ongoingMap', JSON.stringify(_ongoingMap));



	let _studyMap = db.map.get("_studyMap["+studyId+"]") !== undefined ? JSON.parse(db.map.get("_studyMap["+studyId+"]")) : [];
	_studyMap.contributors += 1;
	await UpdateOrInsertData("_studyMap["+studyId+"]", JSON.stringify(_studyMap));


}
export async function CreateQuestionAnswer(studyId, userId, surveyId, sectionId, questionId, answer) {
	let db = await getOutput();
	var obj = {
		answer_id: 0,
		studyId: studyId,
		userId: userId,
		surveyId: surveyId,
		sectionId: sectionId,
		questionId: questionId,
		answer: answer,
	};
	let _questionanswerdMap = db.map.get("_questionanswerdMap") !== undefined ? JSON.parse(db.map.get("_questionanswerdMap")) : [];
	let answer_id = _questionanswerdMap.length;
	obj['answer_id'] = answer_id;
	_questionanswerdMap.push(obj);
	await UpdateOrInsertData('_questionanswerdMap', JSON.stringify(_questionanswerdMap));

}


export async function CreateCompletedSurveys(surveyId, userId, date, studyId) {
	let db = await getOutput();
	var obj = {
		completedSurveyId: 0,
		studyId: studyId,
		userId: userId,
		surveyId: surveyId,
		date: date.clone(),
	};
	let _completedsurveyMap = db.map.get("_completedsurveyMap") !== undefined ? JSON.parse(db.map.get("_completedsurveyMap")) : [];
	let completedSurveyId = _completedsurveyMap.length;
	obj['completedSurveyId'] = completedSurveyId;
	_completedsurveyMap.push(obj);
	await UpdateOrInsertData('_completedsurveyMap', JSON.stringify(_completedsurveyMap));



	let _surveyMap = db.map.get("_surveyMap") !== undefined ? JSON.parse(db.map.get("_surveyMap")) : [];
	for (let i = 0; i < _surveyMap.length; i++) {
		const element = _surveyMap[i];
		if (surveyId === element.surveyId) {
			_surveyMap[i].submission += 1;
			_surveyMap[i].date += date;
		}
	}
	await UpdateOrInsertData('_surveyMap', JSON.stringify(_surveyMap));


}

export async function CreateCompletedInformedConsent(user_id, date, study_id) {
	let db = await getOutput();
	var obj = {
		completed_informed_consent_id: 0,
		study_id: study_id,
		user_id: user_id,
		date: date,
	};
	let _completedinformedMap = db.map.get("_completedinformedMap") !== undefined ? JSON.parse(db.map.get("_completedinformedMap")) : [];
	let completed_informed_consent_id = _completedinformedMap.length;
	obj['completed_informed_consent_id'] = completed_informed_consent_id;
	_completedinformedMap.push(obj);
	await UpdateOrInsertData('_completedinformedMap', JSON.stringify(_completedinformedMap));



}

export function getArgs(args) {
	let NewargsList = [];
	for (let i = 0; i < args.length; i++) {
		if (typeof args[i] === "string") {
			NewargsList.push(`"${args[i]}"`);
		} else if (typeof args[i] === "number") {
			NewargsList.push(args[i]);
		}
	}
	return NewargsList;
}