export async function GenerateAccessToken(fullname) {
	return "daf69cba6bb256a687c8c73e229f54d3";
}
export default async function handler(req, res) {
	try {
		let FixCors = await import("../../../../contract/fixCors.js");
		await FixCors.default(res);
	} catch (error) {}

	let useContract = await import("../../../../contract/useContractSolana.js");
		const {api,  signerAddress, sendTransaction, ReadContract} = await useContract.default();
	if (req.method !== "POST") {
		res.status(405).json({status: 405, error: "Register must have POST request"});
		return;
	}
	const {fullname, email, password} = req.body;
	const result = await ReadContract(api,signerAddress, ("CheckEmail"),[email])
    
	if (result !== "False") {
		res.status(403).json({status: 403, error: "Account already exists!"});
		return;
	}
	let accessToken = await GenerateAccessToken(fullname);
	
	 await sendTransaction(api,signerAddress, "CreateAccount",[fullname, email, password,accessToken]);
	res.status(200).json({status: 200, value: "Registered!"});
}

