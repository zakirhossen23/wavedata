/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {Keypair} from '@solana/web3.js';
import secretKeyString from '../contracts/dist/wavedata-keypair.json';
import PayerKeyString from '../contracts/payer/payer-keypair.json';


/**
 * Create a Keypair from a secret key stored in file as bytes' array
 */
export async function getPayerFromFile() {
  const secretKey = Uint8Array.from(PayerKeyString);
  return Keypair.fromSecretKey(secretKey);
}


/**
 * Create a Keypair from a secret key stored in file as bytes' array
 */
export async function createKeypairFromFile() {
  const secretKey = Uint8Array.from(secretKeyString);
  return Keypair.fromSecretKey(secretKey);
}
