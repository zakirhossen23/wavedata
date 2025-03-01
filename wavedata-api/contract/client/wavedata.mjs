// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Message,
  SYSTEM_INSTRUCTION_LAYOUTS,
  Keypair,


} from '@solana/web3.js';
import bs58 from "bs58";

//   import fs from 'mz/fs.js';
//   import path from 'path';

import { deserializeUnchecked } from 'borsh';

import { createKeypairFromFile, getPayerFromFile } from './utils.mjs';

/**
 * Connection to the network
 */
let connection;


// Derive the address (public key) of a user account from the program so that it's easy to find later.
const SEED = "Wavedata";

/**
 * Our program id
 */
let programId;
let BackendKeyPair;


/**
 * The public key of the user account
 */
let userPubkey;
let BaseUserPubkey;


// Flexible class that takes properties and imbues them
// to the object instance
class Assignable {
  constructor(properties) {
    Object.keys(properties).map((key) => {
      return (this[key] = properties[key]);
    });
  }
}

export class AccoundData extends Assignable { }

const dataSchema = new Map([
  [
    AccoundData,
    {
      kind: "struct",
      fields: [
        ["initialized", "u8"],
        ["tree_length", "u32"],
        ["map", { kind: 'map', key: 'string', value: 'string' }]
      ]
    }
  ]
]);
/**
* Establish a connection to the cluster
*/
export async function establishConnection() {
  let rpc = "https://nd-579-723-764.p2pify.com/5dc1aedbd31cca7d6cc1c8520d0822f4";
  let ws = "wss://ws-nd-579-723-764.p2pify.com/5dc1aedbd31cca7d6cc1c8520d0822f4";
  connection = new Connection(rpc, { wsEndpoint: ws });
}


/**
 * Check if the program has been deployed
 */
export async function checkProgram() {
  // Read program id from keypair file
  try {
    const programKeypair = await createKeypairFromFile();
    BackendKeyPair = await getPayerFromFile();
    programId = programKeypair.publicKey;
  } catch (err) {
    console.error(err);


  }
  
  await CreateNewPDA();


}
export async function getTransferMessage() {


  const type = SYSTEM_INSTRUCTION_LAYOUTS.Transfer;
  const data = Buffer.alloc(type.layout.span);
  const layoutFields = Object.assign({ instruction: type.index });
  type.layout.encode(layoutFields, data);

  const recentBlockhash = await connection.getLatestBlockhash();

  const messageParams = {
    accountKeys: [
      BackendKeyPair.publicKey.toString(),
      BackendKeyPair.publicKey.toString(),
      SystemProgram.programId.toString(),
    ],
    header: {
      numReadonlySignedAccounts: 0,
      numReadonlyUnsignedAccounts: 1,
      numRequiredSignatures: 1,
    },
    instructions: [
      {
        accounts: [0, 1],
        data: bs58.encode(data),
        programIdIndex: 2,
      },
    ],
    recentBlockhash: recentBlockhash.blockhash,
  };

  const message = new Message(messageParams);
  return message;
}




export async function CreateNewPDA() {



  userPubkey = await PublicKey.createWithSeed(
    BackendKeyPair.publicKey,
    SEED,
    programId,
  );
}




export async function getAccountData(connection, account) {
  let nameAccount = await connection.getAccountInfo(
    account,
    'processed'
  );
  return deserializeUnchecked(dataSchema, AccoundData, nameAccount.data);
}



/**
 * Get Output
 */
export async function getOutput() {
  const account = await getAccountData(connection, userPubkey);
  return account;

}



/**
 * Update Data Inside Program
 */
export async function UpdateOrInsertData(key, value, extraArgs = {}) {

  let instruction_data = {
    "method": "UpdateOrInsert",
    "args": [key, value]
  }
  let buffer_instruction = Buffer.from(JSON.stringify(instruction_data), "utf-8");


  const instruction = new TransactionInstruction({
    programId: programId,
    keys: [
      { pubkey: userPubkey, isSigner: false, isWritable: true },
      { pubkey: BaseUserPubkey, isSigner: true, isWritable: false },
    ],
    data: Uint8Array.from(buffer_instruction), // All instructions are hellos
  });
  const transaction = new Transaction().add(instruction);


  if (extraArgs.send == true) {

    const params = {
      fromPubkey: BaseUserPubkey,
      toPubkey: userPubkey,
      lamports: extraArgs.lamports,
    };
    transaction.add(SystemProgram.transfer(params));

  }
  let { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = BaseUserPubkey;

  await sendAndConfirmTransaction(connection, transaction, [BackendKeyPair]);

}

export async function Transfer(transferAmount, receiver) {


  // Create a transfer instruction for transferring SOL from wallet_1 to wallet_2
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: BackendKeyPair.publicKey,
    toPubkey: new PublicKey(receiver),
    lamports: transferAmount , // Convert transferAmount to lamports
  });


  // Add the transfer instruction to a new transaction
  const transaction = new Transaction().add(transferInstruction);

  await sendAndConfirmTransaction(connection, transaction, [BackendKeyPair]);


}
