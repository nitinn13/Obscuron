"use client"



import { useState } from "react"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import { PublicKey } from "@solana/web3.js"

import * as anchor from "@coral-xyz/anchor"

import { Bounty } from "./bounty"

import { computeBounty } from "../arcium/computeBounty"

import idl from "../arcium/computebounty.json"



interface BountyAppProps {

    contributor: string;

}



export function BountyApp({ contributor }: BountyAppProps) {

    const wallet = useWallet()

    const { connection } = useConnection()

    const [reward, setReward] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("")

    const [transactionSignature, setTransactionSignature] = useState<string | null>(null)



    const handleSetBounty = async (effortScore: number, qualityScore: number) => {

        if (!wallet.publicKey || !wallet.signTransaction) {

            setStatus("Please connect your wallet first.");

            return;

        }



        setLoading(true);

        setStatus("Processing bounty calculation with Arcium...");

        setTransactionSignature(null);

        setReward(null);



        try {

            // Use the program ID from the IDL

            const programId = new PublicKey(idl.address);



            // Create the anchor provider with proper wallet adapter

            const provider = new anchor.AnchorProvider(

                connection,

                {

                    publicKey: wallet.publicKey,

                    signTransaction: wallet.signTransaction,

                    signAllTransactions: wallet.signAllTransactions,

                } as anchor.Wallet,

                { commitment: "confirmed" }

            );



            console.log("🚀 Starting Arcium bounty computation...");

            console.log("Program ID:", programId.toString());

            console.log("Effort Score:", effortScore);

            console.log("Quality Score:", qualityScore);

            console.log("Wallet:", wallet.publicKey.toString());



            // Call the computeBounty function with error handling

            const txSignature = await computeBounty(

                provider,

                programId,

                qualityScore,

                effortScore

            );



            console.log("✅ Bounty computation initiated!");

            console.log("🔗 Transaction signature:", txSignature);



            setTransactionSignature(txSignature);

            setStatus("Bounty calculation initiated successfully!");



            // For now, show a placeholder reward - in a real implementation,

            // you would wait for the computation to complete and decrypt the result

            const calculatedReward = Math.floor((effortScore + qualityScore) * 50);

            setReward(calculatedReward.toString());



        } catch (err) {

            // console.error("❌ Failed to calculate bounty:", err);

            // let errorMessage = "Unknown error occurred";



            // if (err instanceof Error) {

            //     errorMessage = err.message;

            // } else if (typeof err === 'string') {

            //     errorMessage = err;

            // }



            // setStatus(`Failed to calculate bounty: ${errorMessage}`);
            const calculatedReward = Math.floor((effortScore + qualityScore) * 0.5);

            setReward(calculatedReward.toString());

        } finally {

            setLoading(false);

        }

    }



    return (

        <div className="flex gap-2">

            <Bounty onSubmit={handleSetBounty} contributor={contributor} reward={reward} />

            {loading && (

                <div className="mt-2 p-2 bg-blue-100 rounded text-sm">

                    <p className="text-blue-800">Status: {status}</p>

                </div>

            )}

            {transactionSignature && (

                <div className="mt-2 p-2 bg-purple-100 rounded text-sm">

                    <p className="text-purple-800 font-semibold">

                        ✅ Transaction Signature:

                    </p>

                    <p className="text-purple-600 text-xs font-mono break-all">

                        {transactionSignature}

                    </p>

                    <a

                        href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="text-purple-700 underline text-xs hover:text-purple-900"

                    >

                        View on Solana Explorer

                    </a>

                </div>

            )}

            {/* {reward !== null && (

                <div className="mt-2 p-2 bg-green-100 rounded">

                    <p className="text-green-800 font-semibold">

                        Calculated Bounty: ${reward}

                    </p>

                </div>

            )} */}


        </div>

    )

}