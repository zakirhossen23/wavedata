
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) {}
  let {GetDescription} = await import ("../../../../../context/DBContext.js");
  let useContract = await import("../../../../../contract/useContractSolana.js");
  const {api,  signerAddress, sendTransaction, ReadContract} = await useContract.default();

  let Studys = [];
  let TotalStudys = await ReadContract(api, signerAddress, ("_StudyIds"));
  for (let i = 0; i < Number(TotalStudys); i++) {
    let study_element = await ReadContract(api, signerAddress, ("_studyMap"), [Number(i)]);

    var newStudy = {
      id: Number(study_element.studyId),
      title: study_element.title,
      image: study_element.image,
      description: await GetDescription(study_element.description),
      contributors: Number(study_element.contributors),
      audience: Number(study_element.audience),
      budget: Number(study_element.budget),
      permissions: await GetDescription(study_element.permission),
    };
    Studys.push(newStudy);
  }
  res.status(200).json({ value: JSON.stringify(Studys) })
}
