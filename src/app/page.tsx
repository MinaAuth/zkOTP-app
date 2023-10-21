"use client"
import Image from 'next/image'
import InstructionsComponent from '@/components/InstructionsComponent'
import { useEffect } from 'react'
import { PolybaseProvider } from '@polybase/react'
import polybase from '@/config/polybase'

export default function Home() {

  useEffect(() => {
    (async () => {
      const { Mina, PublicKey } = await import('o1js');

      // add contract build here
      // const { Add } = await import('../../../contracts/build/src/');

      // Update this to use the address (public key) for your zkApp account.
      // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
      // Berkeley Testnet B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA.
      const zkAppAddress = '';
      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qkwohsqTBPsvhYE8cPZSpzJMgoKn4i1LQRuBAtVXWpaT4dgH6WoA'
        );
      }
      //const zkApp = new Add(PublicKey.fromBase58(zkAppAddress))
    })();
  }, []);

  return (
    <PolybaseProvider polybase={polybase}>
      <div className='min-h-screen'>
        <InstructionsComponent />
      </div>
    </PolybaseProvider>

  )
}
