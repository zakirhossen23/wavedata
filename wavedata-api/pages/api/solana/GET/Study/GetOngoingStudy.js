
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}

  let {GetDescription} = await import ("../../../../../context/DBContext.js");
  let useContract = await import("../../../../../contract/useContractSolana.js");
	const {api,  signerAddress, sendTransaction, ReadContract,ParseBigNum} = await useContract.default();

	let study_id = await ReadContract(api, signerAddress, ("GetOngoingStudy"), [Number(req.query.userid)]);
  if (study_id !== "False") {
    
    let study_element = await ReadContract(api, signerAddress, ("_studyMap"), [Number(study_id)]);
    var newStudy = {
      id: Number(study_element.studyId),
      title: study_element.title,
      image: study_element.image,
      description: await GetDescription(study_element.description),
      contributors: Number(study_element.contributors),
      audience: Number(study_element.audience),
      budget: Number(study_element.budget)
    };
    let all_surveys = await ReadContract(api, signerAddress, ("getAllSurveysIDByStudy"), [Number(study_id)]);

    let all_study_surveys = [];
    for (let i = 0; i < all_surveys.length; i++) {
      let survey_element =  await ReadContract(api, signerAddress, ("_surveyMap"), [Number(all_surveys[i].surveyId)]);

      var new_survey = {
        id: Number(survey_element.surveyId),
        study_id: Number(survey_element.studyId),
        user_id: Number(survey_element.userId),
        name: survey_element.name,
        description: await GetDescription(survey_element.description),
        date: survey_element.date,
        image: survey_element.image,
        reward: ParseBigNum(survey_element.reward),
        submission: Number(survey_element?.submission)
      };
      all_study_surveys.push(new_survey);
    }

    let all_completed_surveys = await ReadContract(api, signerAddress, ("getAllCompletedSurveysIDByUser"), [Number(req.query.userid)]);
    let all_study_completed_surveys = [];

    for (let i = 0; i < all_completed_surveys.length; i++) {
      let completed_survey_element = await ReadContract(api, signerAddress, ("_completedsurveyMap"), [Number(all_completed_surveys[i])]);
      var new_completed_survey = {
        id: Number(completed_survey_element.completedSurveyId),
        study_id: Number(completed_survey_element.studyId),
        user_id: Number(completed_survey_element.userId),
        survey_id: Number(completed_survey_element.surveyId),
        date: completed_survey_element.date,
      };
      if (new_completed_survey.study_id === Number(study_id)){
        all_study_completed_surveys.push(new_completed_survey);
      }
    } 
    

    let completed_informed_consent = await ReadContract(api, signerAddress, ("getCompletedInformedConsentId"), [Number(req.query.userid), Number(study_id)]);
   
    if (completed_informed_consent !== "False") {
     
      completed_informed_consent = {
        id: Number(completed_informed_consent.completedInformed_consentId),
        study_id: Number(completed_informed_consent.studyId),
        user_id: Number(completed_informed_consent.userId),
        date: completed_informed_consent.date,
      }
    }


    let finalObject={
      Study:newStudy,
      Survey: all_study_surveys,
      Completed: all_study_completed_surveys,
      CompletedInformed: completed_informed_consent
    }

    res.status(200).json({ status:200,value: JSON.stringify(finalObject) })
    return;
  }
  
  res.status(400).json({ status:400, value: "None" })

}
