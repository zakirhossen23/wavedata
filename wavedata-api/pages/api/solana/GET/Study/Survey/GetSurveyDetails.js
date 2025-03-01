export default async function handler(req, res) {
	try {
		let FixCors = await import("../../../../../../contract/fixCors.js");
		await FixCors.default(res);
	} catch (error) {}

	let useContract = await import("../../../../../../contract/useContractSolana.js");
	let {GetDescription} = await import("../../../../../../context/DBContext.js");
	const {api,  signerAddress, sendTransaction, ReadContract} = await useContract.default();

	let survey_element = await ReadContract(api, signerAddress, "_surveyMap", [Number(req.query.surveyid)]);
	var new_survey = {
		id: Number(survey_element.surveyId),
		study_id: Number(survey_element.studyId),
		user_id: Number(survey_element.userId),
		name: survey_element.name,
		description: await GetDescription(survey_element.description),
		date: survey_element.date,
		image: survey_element.image,
		reward: Number(survey_element.reward),
		submission: Number(survey_element?.submission)
	};
	let allCategory = [];

	let totalCategories = await ReadContract(api, signerAddress, ( "_SurveyCategoryIds"));
	for (let i = 0; i < Number(totalCategories); i++) {
		let element = await ReadContract (api, signerAddress, ( "_categoryMap"), [Number(i)]);
		allCategory.push({
			name: element.name,
			image: element.image
		});
	}

	let secionElement = await ReadContract(api, signerAddress, ( "_sectionsMap"), [Number(req.query.surveyid)]);
	let final = {
		Survey: new_survey,
		Sections: JSON.parse(secionElement),
		Categories: allCategory
	};

	res.status(200).json({status: 200, value: final});
	return;
}

