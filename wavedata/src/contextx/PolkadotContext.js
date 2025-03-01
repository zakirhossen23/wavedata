'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { options } from "@astar-network/astar-api";
import { getDecodedOutput } from "../contextx/polkadot/helpers";

import getContract from "../contextx/polkadot/getContract";
import { web3Enable, isWeb3Injected, web3Accounts } from "@polkadot/extension-dapp";



const WS_PROVIDER = "wss://rpc.shibuya.astar.network"; // shibuya
const CONTRACT_ADDRESS = "WBpjZoLDGrzB1Ev81vQkao8JK8UR5SBwpebR9xMdjTwLUTc"
const AppContext = createContext({
    api: null,
    signerAddress: null,
    contract: false,
    sendTransaction: async (method, args = [], value = 0) => { },
    ReadContractByQuery: async (query, args = null) => { },
    getMessage: async (find_contract) => { },
    getQuery:  (find_contract) => { },
    getTX: async (find_contract) => { },
    currentChain: null,

});


export function PolkadotProvider({ children }) {
    const [api, setAPI] = useState(null);
    const [signerAddress, setSignerAddress] = useState(null);
    const [contract, setContract] = useState(null);


    async function sendTransaction( method, args = [], value = 0) {
        let tx = getTX(method);
        let query = getQuery(method);
        let gasLimit;
        if (args.length > 0) {
            const { gasRequired, result, output } = await query(
                signerAddress,
                {
                    gasLimit: api.registry.createType("WeightV2", api.consts.system.blockWeights['maxBlock']),
                },
                ...args
            );
            gasLimit = api.registry.createType("WeightV2", gasRequired);
        } else {
            const { gasRequired, result, output } = await query(signerAddress, {
                gasLimit: api.registry.createType("WeightV2", api.consts.system.blockWeights['maxBlock']),
            });
            gasLimit = api.registry.createType("WeightV2", gasRequired);
        }

        const sendTX = new Promise(function executor(resolve) {
            tx({
                gasLimit: gasLimit,
                value: value
            },
                ...args)
                .signAndSend(signerAddress, async (res) => {
                    if (res.status.isInBlock) {
                        // console.log("in a block");
                        resolve("OK");
                    } else if (res.status.isFinalized) {
                        console.log("finalized");
                        resolve("OK");
                    }
                });
        });
        await sendTX;

    }


    async function ReadContractByQuery( query, args = null) {
        if (api === null) return;
        if (args) {
            const { gasRequired, result, output } = await query(
                signerAddress,
                {
                    gasLimit: api.registry.createType("WeightV2", api.consts.system.blockWeights['maxBlock']),
                    storageDepositLimit: null
                },
                ...args
            );
            return output.toHuman().Ok;
        } else {
            const { gasRequired, result, output } = await query(signerAddress, {
                gasLimit: api.registry.createType("WeightV2", api.consts.system.blockWeights['maxBlock']),
                storageDepositLimit: null
            });
            return output.toHuman().Ok;
        }
    }
    function getMessage(find_contract) {
        for (let i = 0; i < contract.abi.messages.length; i++) {
            if (find_contract == contract.abi.messages[i]["identifier"]) {
                return contract.abi.messages[i];
            }
        }
    }

    function getQuery(find_contract) {
        let messageName = "";
        for (let i = 0; i < contract.abi.messages.length; i++) {
            if (find_contract == contract.abi.messages[i]["identifier"]) {
                messageName = contract.abi.messages[i]["method"];
                return contract.query[messageName];
            }
        }
    }
    function getTX(find_contract) {
        let messageName = "";
        for (let i = 0; i < contract.abi.messages.length; i++) {
            if (find_contract == contract.abi.messages[i]["identifier"]) {
                messageName = contract.abi.messages[i]["method"];
                return contract.tx[messageName];
            }
        }
    }


    const fetchData = async () => {
        if (window.localStorage.getItem("type") === "polkadot") {
            try {
                const provider = new WsProvider(WS_PROVIDER);
                const _api = new ApiPromise(options({ provider }));

                await _api.isReady;
                const extension = await web3Enable("WaveData");
                const injectedAccounts = await web3Accounts();

                _api.setSigner(extension[0].signer)

                setAPI(_api);

                let _contract = await getContract(_api);
                setContract(_contract)

                setSignerAddress(injectedAccounts[0].address);
                window.AddressPolkadot = injectedAccounts[0].address;
                window.contract = _contract;

            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return <AppContext.Provider value={{
        api: api,
        signerAddress: signerAddress,
        contract: contract,
        sendTransaction: sendTransaction,
        ReadContractByQuery: ReadContractByQuery,
        getMessage: getMessage,
        getQuery: getQuery,
        getTX: getTX
    }}>{children}</AppContext.Provider>;

}
export const usePolkadotContext = () => useContext(AppContext);


