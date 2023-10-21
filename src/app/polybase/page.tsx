"use client"
import React, { useState, useEffect } from 'react'
import { signAuroMessage } from '@/utils/wallet'
import { Auth } from '@polybase/auth'
import { Polybase } from '@polybase/client'
import { atom, useAtom } from 'jotai'
import { walletAddressAtom } from "@/utils/state";

const auth = new Auth()

declare global {
    interface Window {
        mina: any;
    }
}

const polybase = () => {
    const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
    const [signMessage, setSignMessage] = useState();
    console.log("signMessage:", signMessage)
    console.log("auth:", auth)

    const [authSig, setAuthSig] = useState();

    // setting polybase constants
    const [polybaseDb, setPolygbaseDb] = useState() as any;
    const [defaultNamespace] = useState(
        'pk/0x0a4f8fcf98d7e5745ed5911b7c6f864e92a0016539d9ed46221d1e378ceb1e2498fc2390ee81ab65fd6a6e9255d334bcbed14f25db92faf2c7c4e785181675dc/TestTokens'
    );
    const [collectionReference] = useState('Keys');
    const [appId] = useState('hack-fs');

    // need signer in order to create Polybase records
    const [addedSigner, setAddedSigner] = useState(false);
    const [cards, setCards] = useState();
    const [filteredCards, setFilteredCards] = useState(cards);

    const [polybaseLoading, setPolybaseLoading] = useState(false);
    const [polybaseRetrying, setPolybaseRetrying] = useState(false);

    const deleteRecord = async id => {
        const record = await polybaseDb
            .collection(collectionReference)
            .record(id)
            .call('del');
        return record;
    };

    // main server side filter is user address so they only get their own records
    // note: they still wouldn't be able to decrypt other records
    const listRecordsWhereAppIdMatches = async (
        field = 'address',
        op = '==',
        val = address
    ) => {
        if (polybaseDb) {
            const records = await polybaseDb
                .collection(collectionReference)
                .where(field, op, val)
                .where('appId', '==', appId)
                .get();
            return records.data.map(d => d.data);
        } else {
            return [];
        }
    };

    // const createPolybaseRecord = async (service, account, secret) => {
    //     setPolybaseLoading(true);
    //     try {
    //         // schema creation types
    //         // id: string, appId: string, address: string, service: string, serviceKey: string,
    //         // account: string, accountKey: string, secret: string, secretKey: string
    //         const id = `encrypted${Date.now().toString()}`;

    //         const record = await polybaseDb
    //             .collection(collectionReference)
    //             .create([
    //                 id,
    //                 appId,
    //                 address,
    //                 service.encryptedString,
    //                 service.encryptedSymmetricKey,
    //                 account.encryptedString,
    //                 account.encryptedSymmetricKey,
    //                 secret.encryptedString,
    //                 secret.encryptedSymmetricKey,
    //             ]);

    //         setPolybaseRetrying(false);

    //         // update ui to show new card
    //         setCards(cards => [
    //             {
    //                 id,
    //                 service: service.service,
    //                 account: account.account,
    //                 secret: secret.secret,
    //             },
    //             ...cards,
    //         ]);
    //     } catch (err) {
    //         console.log(err);

    //         // error handling and retry
    //         // -32603 is the error code if user cancels tx
    //         if (err.code !== -32603) {
    //             // if Polybase error, retry post data
    //             createPolybaseRecord(service, account, secret);
    //             setPolybaseRetrying(true);
    //         }
    //     }
    //     setPolybaseLoading(false);
    // };


    // useEffect(() => {
    //     if (walletAddress) {
    //         const db = new Polybase({
    //             defaultNamespace,
    //         });

    //         const addSigner = async () => {
    //             setAddedSigner(true);
    //             db.signer(async data => {
    //                 // const accounts = await eth.requestAccounts();
    //                 // const account = accounts[0];
    //                 // const sig = await eth.sign(data, walletAddress);
    //                 const sig = await window.mina.signMessage(data, walletAddress);
    //                 return { h: 'eth-personal-sign', sig };
    //             });

    //             // const checkEns = async () => {
    //             //     if (publicClient && address) {
    //             //         try {
    //             //             const name = await publicClient.getEnsName({
    //             //                 address,
    //             //             });

    //             //             setEnsName(name);
    //             //             return name;
    //             //         } catch (err) {
    //             //             console.log(err);
    //             //         }
    //             //     }
    //             // };

    //             // const setAvatar = async name => {
    //             //     if (name) {
    //             //         const avatarSrc = await publicClient.getEnsAvatar({
    //             //             name,
    //             //         });
    //             //         setEnsAvatar(avatarSrc);
    //             //     }
    //             // };

    //             // const ensName = await checkEns().then(
    //             //     async name => await setAvatar(name)
    //             // );
    //             // const ava = await setAvatar(ensName);
    //             setPolygbaseDb(db);
    //         };

    //         addSigner();
    //     }
    // }, [walletAddress]);

    const polybaseSign = async () => {
        const authState = await auth.signIn()
        console.log("authState:", authState)
    }

    const signPolyMessage = async () => {
        console.log("signPolyMessage called", walletAddress)
        if (walletAddress) {
            // const db = new Polybase({
            //     defaultNamespace,
            // });
            const db = new Polybase({
                signer: async (data) => {
                    console.log("signature 1")

                    const signature = await window.mina.signMessage({ message: data })
                    console.log("signature 2:", signature)
                    return {
                        h: 'eth-personal-sign',
                        sig: signature
                    }
                }
            })
            console.log("db:", db);



            // const addSigner = async () => {
            //     setAddedSigner(true);
            //     console.log("addSigner called", db.signer)
            //     let sig = await (window as any).mina.signMessage({ message: data });
            //     console.log("sig:", sig)
            //     db.signer(async (data) => {
            //         console.log("db.signer data:", data);
            //         return { h: "eth-personal-sign", sig };
            //     });
            //     setPolygbaseDb(db);
            // };
            // addSigner();


        }
    }

    const signTest = async () => {
        const signature = await window.mina.signMessage({ message: "Hi" })
        console.log("signature:", signature)
    }

    // useEffect(() => {
    //     if (polybaseDb && addedSigner && litClient && authSig) {
    //         const getEncryptedDataFromPolybase = async () => {
    //             const records = await listRecordsWhereAppIdMatches();
    //             await timeout(1000);
    //             return records;
    //         };
    //         getEncryptedDataFromPolybase().then(async recs => {
    //             await decryptPolybaseRecs(recs).then(decryptedRecs => {
    //                 const serviceSortedRecs =
    //                     decryptedRecs &&
    //                     decryptedRecs.sort((a, b) => {
    //                         // if same service, alphabetize by account
    //                         if (a.service.toLowerCase() === b.service.toLowerCase()) {
    //                             return a.account.toLowerCase() > b.account.toLowerCase()
    //                                 ? 1
    //                                 : -1;
    //                         } else {
    //                             // alphabetize by service
    //                             return a.service.toLowerCase() > b.service.toLowerCase()
    //                                 ? 1
    //                                 : -1;
    //                         }
    //                     });
    //                 setCards(serviceSortedRecs);
    //             });
    //         });
    //     }
    // }, [addedSigner, litClient, authSig, polybaseDb]);

    // const shortAddress = addr => `${addr.slice(0, 5)}...${addr.slice(-4)}`;
    // const encodedNamespaceDb = encodeURIComponent(
    //     `${defaultNamespace}/${collectionReference}`
    // );

    return (
        <div className='h-screen'>
            <div>Page</div>
            {/* <button className='m-2 px-6 py-3 bg-white text-black' onClick={async () => {
                const signReturn = signAuroMessage("Hello, you are signing in the world of MinaAuth! ");
                setSignMessage(await signReturn);
            }}>Sign Message</button> */}

            <button className='m-2 px-6 py-3 bg-white text-black' onClick={signPolyMessage}>Sign Message</button>
            <button className='m-2 px-6 py-3 bg-white text-black' onClick={signTest}>Polybase Sign</button>
        </div>

    )
}

export default polybase