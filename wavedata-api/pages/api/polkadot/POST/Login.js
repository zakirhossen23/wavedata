
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}

  
  let useContract = await import("../../../../contract/useContract.ts");
  const {api, contract, signerAddress, sendTransaction, ReadContractByQuery, getMessage, getQuery} = await useContract.default();
	
  const { email, password } = req.body;
	let output = await ReadContractByQuery(api, signerAddress, getQuery(contract,"Login"), [email, password]);
  let details_element = await ReadContractByQuery(api, signerAddress, getQuery(contract,"getUserDetails"), [Number(output)]);
  console.log(details_element)

  res.status(200).json({ status: 200, value: output,"blockcahin":details_element[5] })

}
