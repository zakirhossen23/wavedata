
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}



  let useContractSolana = await import("../../../../../../contract/useContractSolana.js");
  let useContract = await import("../../../../../../contract/useContract.ts");
  const {api,  signerAddress, sendTransaction, ReadContract} = await useContractSolana.default();
  const polkaContract = await useContract.default();
    
  if (req.method !== 'POST') {
    res.status(405).json({ status: 405, error: "Method must have POST request" })
    return;
  }

  const { surveyid, userid, date, studyid } = req.body;

	let survey_element = await ReadContract(api, signerAddress, ("_surveyMap"), [Number(surveyid)]);
  
	let details_element = await polkaContract.ReadContractByQuery(polkaContract.api, polkaContract.signerAddress, polkaContract.getQuery("getUserDetails"), [Number(userid)]);
  
  
  let credits = Number(details_element[1]) + Number(survey_element.reward)

  
  await polkaContract.sendTransaction(polkaContract.api,polkaContract.signerAddress, "UpdateUser",[Number(userid), details_element[0], Number(credits)]);
  
  await sendTransaction(api,signerAddress, "CreateCompletedSurveys",[Number(surveyid), Number(userid), date, Number(studyid)]);

  res.status(200).json({ status: 200, value: "Created" })

}
