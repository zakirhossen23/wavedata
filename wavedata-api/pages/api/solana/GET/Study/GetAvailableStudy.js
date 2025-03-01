
export default async function handler(req, res) {
  try {
    let FixCors = await import("../../../../../contract/fixCors.js");
    await FixCors.default(res);
  } catch (error) { }

  let { GetDescription } = await import("../../../../../context/DBContext.js");
  let useContract = await import("../../../../../contract/useContractSolana.js");
  const { api, signerAddress, ParseBigNum, ReadContract } = await useContract.default();
  let study_id = await ReadContract(api, signerAddress, "GetOngoingStudy", [Number(req.query.userid)]);
  let totalStudys = await ReadContract(api, signerAddress, ("_StudyIds"));

  let all_available_studies = [];
  for (let i = 0; i < Number(totalStudys); i++) {
    let study_element = await ReadContract(api, signerAddress, ("_studyMap"), [Number(i)]);
    let ages_groups = {};
    if (study_element.ages != "") {
      try {
        ages_groups = JSON.parse(await GetDescription(study_element.ages));
      } catch (e) {
        ages_groups = {};
      }
    }


    let allTitles = { ages_ans: {} };


    if (study_element.titles != "") {
      try {
        allTitles.ages_ans = JSON.parse(await GetDescription(study_element.titles));
      } catch (e) {
        allTitles = { ages_ans: {} };
      }
    }

    const totalSubjects = await ReadContract(api, signerAddress, ("_StudySubjectsIds"));
    let draft_subjects = [];
    try {
      for (let i = 0; i < Number(totalSubjects); i++) {
        let subject_element = await ReadContract(api, signerAddress, ("_studySubjectMap"), [i]);


        var new_subject = {
          subject_id: Number(subject_element.subjectId),
          study_id: Number(subject_element.studyId),
          subject_index_id: (subject_element.subjectIndexId),
          title: subject_element.title,
          ages_ans: JSON.parse(subject_element.agesAns),
        };
        if (study_element.studyId === new_subject.study_id) {
          draft_subjects.push(new_subject)
        }
      }
    } catch (ex) { }



    if (study_element != {}) {
      if (study_element.studyId != null) {


        var newStudy = {
          id: Number(study_element.studyId),
          title: study_element.title,
          image: study_element.image,
          description: study_element.description.toString().length > 3 ? await GetDescription(study_element.description) : "",
          contributors: Number(study_element.contributors),
          audience: Number(study_element.audience),
          budget: ParseBigNum(study_element.budget),
          permissions: study_element.permission.toString().length > 3 ? await GetDescription(study_element.permission) : "",
          study_title: study_element.title,
          subjects: draft_subjects,
          ages_groups: ages_groups
        };
        if (study_id !== "False") {
          if (Number(study_id) !== newStudy.id)
            all_available_studies.push(newStudy);
        } else {
          all_available_studies.push(newStudy);
        }
      }
    }
  }

  res.status(200).json({ status: 200, value: JSON.stringify(all_available_studies) })
  return;

}
