
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}



  let useContract = await import("../../../../../../contract/useContract");
  let useContractSolana = await import("../../../../../../contract/useContractSolana");
  const {api, contract, signerAddress, sendTransaction, ReadContractByQuery,ParseBigNum, getMessage, getQuery} = await useContract.default();
  const solanaContract = await useContractSolana.default();
    
  if (req.method !== 'POST') {
    res.status(405).json({ status: 405, error: "Method must have POST request" })
    return;
  }

  const { userid,amount,walletAddress } = req.body;

  await solanaContract.sendTransaction(solanaContract.api,solanaContract.signerAddress, "transfer",[ (Number(amount) * 1e9).toFixed(0),walletAddress]);
  
  let details_element = await ReadContractByQuery(api, signerAddress, getQuery(contract,"getUserDetails"), [Number(userid)]);
  let image =  details_element[0];
  await sendTransaction(api,contract,signerAddress, "UpdateUser",[Number(userid), image, ((ParseBigNum(details_element[1]) - amount) * 1e9).toFixed(0)]);
  
  res.status(200).json({ status: 200, value: "Updated" })

}
