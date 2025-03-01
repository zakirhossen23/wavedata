
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}

  
  let useContract = await import("../../../../contract/useContractSolana.js");
    const {api,  signerAddress, sendTransaction, ReadContract} = await useContract.default();
	
  const { email, password } = req.body;
	let output = await ReadContract(api, signerAddress, ("Login"), [email, password]);
  res.status(200).json({ status: 200, value: output.toString() })

}
