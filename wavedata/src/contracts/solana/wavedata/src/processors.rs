#![allow(unused_variables)]
use crate::{ wavedata::Wavedata};
use solana_program::{
    account_info::{ next_account_info, AccountInfo }, msg,entrypoint, entrypoint::ProgramResult,
    program_error::{  ProgramError }, pubkey::Pubkey,
};
use serde_json::{Result};


entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    // Iterating accounts is safer than indexing
    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;

    

    let data = match std::str::from_utf8(instruction_data) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
    };
    let parsed_data = match  serde_json::from_str(data){
        Result::Ok(val) => {val},
        Result::Err(err) => {
            msg!("parsing was unsuccessful => {:#?} !", data);
            serde_json::Value::Null
        }
    };
 
    Wavedata::process(program_id, &account, parsed_data);
    Ok(())
}