
import { Abi, ContractPromise } from '@polkadot/api-contract'

import abiData from '../../contracts/wavedata/target/ink/wavedata.json';


const CONTRACT_ADDRESS = 'WBpjZoLDGrzB1Ev81vQkao8JK8UR5SBwpebR9xMdjTwLUTc'//smart contract deployed address 
	
export default async function getContract(api) {


    const abi = new Abi(abiData, api.registry.getChainProperties())

    const contract = new ContractPromise(api, abi, CONTRACT_ADDRESS)

	return contract
  }
  