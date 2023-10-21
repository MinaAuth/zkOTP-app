"use client"
import React, { useState, useEffect } from 'react'
import { signAuroMessage } from '@/utils/wallet'
import { Auth } from '@polybase/auth'
import { Polybase } from '@polybase/client'

const auth = new Auth()

const polybase = () => {
    const [signMessage, setSignMessage] = useState();
    console.log("signMessage:", signMessage)
    console.log("auth:", auth)

    const [authSig, setAuthSig] = useState();
    const [polybaseLoading, setPolybaseLoading] = useState(false);
    const [polybaseRetrying, setPolybaseRetrying] = useState(false);

    useEffect(() => {
        if (isConnected && address) {
            const db = new Polybase({
                defaultNamespace,
            });

            const addSigner = async () => {
                setAddedSigner(true);
                db.signer(async data => {
                    const accounts = await eth.requestAccounts();
                    const account = accounts[0];
                    const sig = await eth.sign(data, account);
                    return { h: 'eth-personal-sign', sig };
                });

                const checkEns = async () => {
                    if (publicClient && address) {
                        try {
                            const name = await publicClient.getEnsName({
                                address,
                            });

                            setEnsName(name);
                            return name;
                        } catch (err) {
                            console.log(err);
                        }
                    }
                };

                const setAvatar = async name => {
                    if (name) {
                        const avatarSrc = await publicClient.getEnsAvatar({
                            name,
                        });
                        setEnsAvatar(avatarSrc);
                    }
                };

                const ensName = await checkEns().then(
                    async name => await setAvatar(name)
                );
                // const ava = await setAvatar(ensName);
                setPolygbaseDb(db);
            };

            addSigner();
        }
    }, [isConnected, address]);

    const polybaseSign = async () => {
        const authState = await auth.signIn()
        console.log("authState:", authState)
    }

    return (
        <div className='h-screen'>
            <div>Page</div>
            <button className='m-2 px-6 py-3 bg-white text-black' onClick={async () => {
                const signReturn = signAuroMessage("Hello, you are signing in the world of MinaAuth! ");
                setSignMessage(await signReturn);
            }}>Sign Message</button>

            <button className='m-2 px-6 py-3 bg-white text-black' onClick={polybaseSign}>Polybase Sign</button>
        </div>

    )
}

export default polybase