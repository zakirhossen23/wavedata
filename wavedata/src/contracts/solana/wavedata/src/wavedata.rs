#![allow(non_snake_case)]
#![allow(non_camel_case_types)]
#![allow(dead_code)]
#![allow(unused_imports)]
#![allow(unused_must_use)]
#![allow(unused_mut)]
use borsh::{ BorshDeserialize, BorshSerialize };
use serde_json::{ Result, Value };
use solana_program::{ account_info::{ next_account_info, AccountInfo }, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,  program_error::{ PrintProgramError, ProgramError } };
use core::mem::size_of;
use solana_program::program_pack::Pack;
use crate::{ account_state::ProgramAccountState, error::SampleError };
use solana_program::program_pack::IsInitialized;



#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Wavedata {}

impl Wavedata {

  /// Initialize the programs account, which is the first in accounts
  pub fn initialize_account(account: &AccountInfo) -> ProgramResult {
    msg!("Initialize account");
    let program_account = account;
    let mut account_data = program_account.data.borrow_mut();
    // Just using unpack will check to see if initialized and will
    // fail if not
    let mut account_state = ProgramAccountState::unpack_unchecked(&account_data)?;
    // Where this is a logic error in trying to initialize the same
    // account more than once
    if account_state.is_initialized() {
      return Err(SampleError::AlreadyInitializedState.into());
    } else {
      account_state.set_initialized();
    }

    ProgramAccountState::pack(account_state, &mut account_data).unwrap();
    Ok(())
  }



  pub fn process(_program_id: &Pubkey, account: &AccountInfo, input: Value) {
    let inputmethod = input["method"].as_str().unwrap();

    match inputmethod {
      "Initialize" => {
        Self::initialize_account(&account);
      }
      "UpdateOrInsert" => {
        let mut account_data =account.data.borrow_mut();
        let mut account_state = ProgramAccountState::unpack(&account_data).unwrap();

        let args = input["args"].as_array().unwrap();
        let key = &args[0].as_str().unwrap().to_string();
        let value = &args[1].as_str().unwrap().to_string();
        account_state.add(key.to_string(), value.to_string());

        Pack::pack(account_state,&mut account_data);

      }
      "Get" => {
        let mut account_data =account.data.borrow_mut();
        let mut account_state = ProgramAccountState::unpack(&account_data).unwrap();

        let args = input["args"].as_array().unwrap();
        let key = &args[0].as_str().unwrap();
        
        msg!(account_state.btree_storage.get(&key.to_string()).unwrap());
      }
      _ => panic!("Wrong Method!"),
    }
  }
}