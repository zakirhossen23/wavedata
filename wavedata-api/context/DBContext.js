

import Airtable from 'airtable';


const Token = "patQvXPSOwdPxJ37f.246be6a5d6659407e4e40a4dc35095c7c9ddc312fd981f2d5b0305dc8dd48e12";
var base = new Airtable({ apiKey: Token }).base('appdP1KvBGkbsess3');

export async function GetDescription(id){
    const descriptionTable = base('descriptions');

    const record = await descriptionTable.find(id);

    return record.get("description");
}


export async function CreateDescription(description,id="") {

    if (id != ""){
       return await UpdateDescription(id,description);
    }
    const descriptionTable = base('descriptions');
    try {
        const record = await descriptionTable.create({
            "description": description
        });

        return record.getId();
    } catch (error) {
        throw error;
    }
}