'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { usePolkadotContext } from './PolkadotContext';
import { useSolanaContext } from './SolanaContext';


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


export function MixedProvider({ children }) {

    const { api, contract, signerAddress, sendTransaction,  ReadContractByQuery, getMessage, getQuery, getTX } = usePolkadotContext();;
    const { sol_api , sol_contract, sol_signerAddress, sol_sendTransaction,  sol_ReadContractByQuery, sol_getMessage, sol_getQuery, sol_getTX } = useSolanaContext();;

    const [_api, setAPI] = useState(null);
    const [_signerAddress, setSignerAddress] = useState(null);
    const [_contract, setContract] = useState(null);


    async function _sendTransaction(method, args = [], value = 0) {
        if (window.localStorage.getItem("type") === "polkadot") {
            return await sendTransaction(method, args,value);
        } else if (window.localStorage.getItem("type") === "solana") {
            return await sol_sendTransaction(method, args,value);
        }

    }

    async function _ReadContractByQuery(query, args = null) {
        if (window.localStorage.getItem("type") === "polkadot") {
            return await ReadContractByQuery(query, args);
        } else if (window.localStorage.getItem("type") === "solana") {
            return await sol_ReadContractByQuery(query, args);
        }


    }
   async function _getMessage(find_contract) {
        if (window.localStorage.getItem("type") === "polkadot") {
            return await getMessage(find_contract);
        } else if (window.localStorage.getItem("type") === "solana") {
            return await sol_getMessage(find_contract);
        }
    }

     function _getQuery(find_contract) {
        if (window.localStorage.getItem("type") === "polkadot") {
            return  getQuery(find_contract);
        } else if (window.localStorage.getItem("type") === "solana") {
            return  sol_getQuery(find_contract);
        }
    }
    async function _getTX(find_contract) {
        if (window.localStorage.getItem("type") === "polkadot") {
            return await getTX(find_contract);
        } else if (window.localStorage.getItem("type") === "solana") {
            return await sol_getTX(find_contract);
        }
    }

    async function _fetchData() {
        if (window.localStorage.getItem("type") === "polkadot") {
            setAPI(api);
            setSignerAddress(signerAddress);
            setContract(contract);
            window.ParseBigNum = ParseBigNumPolkadot;
            window.WrapBigNum = WrapBigNumPolkadot;
        } else if (window.localStorage.getItem("type") === "solana") {
            setAPI(sol_api);
            setSignerAddress(sol_signerAddress);
            setContract(sol_contract);
            window.ParseBigNum = ParseBigNumSolana;
            window.WrapBigNum = WrapBigNumSolana;
        }
    }


    useEffect(() => {
        _fetchData();
    }, [api,sol_api,signerAddress,sol_signerAddress,contract,sol_contract]);


    return <AppContext.Provider value={{
        api: _api,
        signerAddress: _signerAddress,
        contract: _contract,
        sendTransaction: _sendTransaction,
        ReadContractByQuery: _ReadContractByQuery,
        getMessage: _getMessage,
        getQuery: _getQuery,
        getTX: _getTX
    }} >{children}</AppContext.Provider>;

}
export const useMixedContext = () => useContext(AppContext);


export const ParseBigNumPolkadot = (num)=> {
  return  Number(num.toString().replaceAll(",",""))/1e18
}
export const ParseBigNumSolana = (num)=> {
  return  Number(num.toString().replaceAll(",",""))/1e9
}
export const WrapBigNumPolkadot = (num)=> {
  return  (Number(num)*1e18).toFixed(0)
}
export const WrapBigNumSolana = (num)=> {
  return  (Number(num)*1e9).toFixed(0)
}