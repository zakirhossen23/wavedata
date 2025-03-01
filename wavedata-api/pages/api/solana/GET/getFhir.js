export default async function handler(req, res) {
	try {
		let FixCors = await import("../../../../contract/fixCors.js");
		await FixCors.default(res);
	} catch (error) {}

	let useContractSolana = await import("../../../../contract/useContractSolana.js");
	let useContract = await import("../../../../contract/useContract");
	let {GetDescription} = await import("../../../../context/DBContext.js");
	const {  ReadContract} = await useContractSolana.default();
	const {api,  signerAddress,ReadContractByQuery,getQuery,contract} = await useContract.default();
	

	let  userdetails= await ReadContractByQuery(api, signerAddress, getQuery(contract,"getUserDetails"), [Number(req.query.userid)]);
	let fhir_element = ( await ReadContract(api, signerAddress, ("_fhirMap"), [Number(req.query.userid)]));
	
	var bDate = new Date(fhir_element.birthDate);
	var nDate =new Date()
	let currentAge = nDate.getFullYear()- bDate.getFullYear();


	var newFhir = {
		id: Number(fhir_element.userId),
		family_name: fhir_element.familyName,
		given_name: fhir_element.givenName,
		identifier: fhir_element.identifier,
		phone: fhir_element.phone,
		gender: fhir_element.gender,
		birth_date: fhir_element.birthDate,
		age:currentAge,
		about: fhir_element.about != null?await GetDescription(fhir_element.about):"",
		patient_id: fhir_element.patientId,
		privatekey: userdetails.privatekey,
		walletaddress: userdetails.walletaddress ,
		image: fhir_element.image,
		credits: fhir_element.credits
	};
	if (newFhir.patient_id === "") {
		newFhir = null;
	}

	res.status(200).json({value: newFhir});
}

