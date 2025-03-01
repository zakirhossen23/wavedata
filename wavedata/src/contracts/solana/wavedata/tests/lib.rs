use borsh::BorshDeserialize;
use wavedata::processors::{ process_instruction };
use solana_program_test::*;
use solana_sdk::{ message::Message, account::Account, instruction::{ AccountMeta, Instruction }, pubkey::Pubkey, signature::Signer, transaction::Transaction };
use std::mem;
use serde::Serialize;
use sol_template_shared::{ unpack_from_slice, ACCOUNT_STATE_SPACE };

#[tokio::test]
async fn test_wavedata() {
  let program_id = Pubkey::new_unique();
  let account_pubkey = Pubkey::new_unique();
  let mut program_test = ProgramTest::new(
    "Wavedata", // Run the BPF version with `cargo test-bpf`
    program_id,
    processor!(process_instruction) // Run the native version with `cargo test`
  );

  program_test.add_account(account_pubkey, Account {
    lamports: 5,
    data: vec![0_u8; ACCOUNT_STATE_SPACE],
    owner: program_id,
    ..Account::default()
  });
  let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

  let data = *b"{\"method\":\"Initialize\"}";

  //Intialize State
  let mut tx = Transaction::new_with_payer(
    &[
      Instruction::new_with_bincode(
        program_id,
        &data, // ignored but makes the instruction unique in the slot
        vec![AccountMeta::new(account_pubkey, false)]
      ),
    ],
    Some(&payer.pubkey())
  );

  tx.sign(&[&payer], recent_blockhash);
  banks_client.process_transaction(tx).await.unwrap();

  println!("Initialized!");
  // Verify account is not yet initialized
  let (is_initialized, _btree_map) = match banks_client.get_account(account_pubkey).await.unwrap() {
    Some(account) => unpack_from_slice(&account.data).unwrap(),
    None => panic!(),
  };
  assert!(is_initialized);


  let data2 = "{'method':'UpdateOrInsert','args':['_userMap','_userMapValue']}";
  let  buf = data2.as_bytes();


  //Intialize State
  let mut tx2 = Transaction::new_with_payer(
    &[
      Instruction::new_with_borsh(
        program_id,
        &buf, // ignored but makes the instruction unique in the slot
        vec![AccountMeta::new(account_pubkey, false)]
      ),
    ],
    Some(&payer.pubkey())
  );

  tx2.sign(&[&payer], recent_blockhash);
  banks_client.process_transaction(tx2).await.unwrap();


  // Check the data
  let (is_initialized, btree_map) = match banks_client.get_account(account_pubkey).await.unwrap()
  {
      Some(account) => unpack_from_slice(&account.data).unwrap(),
      None => panic!(),
  };
  assert!(btree_map.contains_key((&"_userMap".to_string())));
}