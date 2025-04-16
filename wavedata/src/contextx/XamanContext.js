'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { Xumm } from "xumm"

const XUMM_KEY= 'afbb0a76-5598-4447-ab13-47830d3f3b41';
const XUMM_SECRET= '008cbfd3-2467-4195-8f6e-d042b6d84b36';



const Sdk = new Xumm(XUMM_KEY)
const AppContext = createContext({
    SignInXaman: async () => {},
    wallet: null
});



export function XamanProvider({ children }) {

    const [pong, setPong] = useState(null);
    const [wallet, setWallet] = useState(null);
    async function SignInXaman() {
        Sdk.authorize();
    }
    async function fetchData(){
        window.Sdk = Sdk;
        const pongSDK = await Sdk?.ping()
        setPong(pongSDK);
        if (await Sdk?.user?.account) {
            setWallet(await Sdk?.user?.account);
        }
        window.WrapBigNum  =(amount)=>  1e6 * amount;
    }
    useEffect(() => {
        fetchData();
    },[]);

     return <AppContext.Provider value={{
        SignInXaman,wallet
    }}>{children}</AppContext.Provider>;

}
export const useXamanContext = () => useContext(AppContext);


