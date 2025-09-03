// "use client"

// import { useEffect, useState, useMemo } from "react"
// import { PublicKey, Connection } from "@solana/web3.js"
// import { Program, AnchorProvider, BN } from "@coral-xyz/anchor"
// import { useWallet, useConnection } from "@solana/wallet-adapter-react"
// import { Bounty } from "./bounty"
// import { Buffer } from "buffer"
// import { RescueCipher, getArciumEnv, x25519 } from "@arcium-hq/client";

// if (typeof window !== 'undefined') {
//   (window as any).Buffer = Buffer;
// }

// import idl from "../arcium/computebounty.json"

// type ComputeBounty = Program<typeof idl>

// const PROGRAM_ID = new PublicKey(idl.address)

<<<<<<< HEAD
// export function BountyApp() {
//     const wallet = useWallet()
//     const { connection } = useConnection()
//     const [program, setProgram] = useState<ComputeBounty | null>(null)
//     const [reward, setReward] = useState<string | null>(null)
//     const [loading, setLoading] = useState(false)
//     const [status, setStatus] = useState("")
    
//     const [mxePublicKey, setMxePublicKey] = useState<Buffer | null>(null);
//     const clientKeyPair = useMemo(() => x25519.utils.randomPrivateKey(), []);

//     useEffect(() => {
//         if (wallet.connected && connection) {
//             const provider = new AnchorProvider(connection, wallet as any, {})
//             const programClient = new Program(idl as any, PROGRAM_ID, provider) as ComputeBounty
//             setProgram(programClient)
            
//             // Fetch the MXE x25519 public key from the Arcium environment
//             getArciumEnv(provider as any, programClient.programId).then(env => {
//                 const mxeKey = (env.mxeAccount.x25519Pubkey as any).set;
//                 setMxePublicKey(mxeKey);
//             }).catch(e => {
//                 console.error("Failed to fetch MXE public key:", e);
//                 setStatus("Failed to fetch MXE public key.");
//             });
=======
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
>>>>>>> ee91aa3 (Update frontend code)

//             const listenerId = programClient.addEventListener("BountyEvent", (event, _slot) => {
//                 setStatus("BountyEvent received! Decrypting reward...");
//                 const encryptedReward = event.result;
//                 const nonce = event.nonce;

//                 if (!mxePublicKey) {
//                     setStatus("MXE public key not available for decryption.");
//                     return;
//                 }

<<<<<<< HEAD
//                 try {
//                     // Derive the shared secret using the client's private key and the MXE public key.
//                     const clientPublicKey = x25519.getPublicKey(clientKeyPair);
//                     const sharedSecret = x25519.getSharedSecret(clientKeyPair, mxePublicKey);
                    
//                     // Initialize the cipher with the shared secret.
//                     const cipher = new RescueCipher(sharedSecret);
                    
//                     // Decrypt the ciphertext using the cipher and nonce.
//                     const decryptedPlaintext = cipher.decrypt(encryptedReward, nonce);
                    
//                     // The decrypted value is a BigInt, convert it to a string for display
//                     const rewardAmount = decryptedPlaintext.toString();
                    
//                     setReward(rewardAmount);
//                     setStatus("Reward amount successfully decrypted!");
//                 } catch (e) {
//                     console.error("Decryption failed:", e);
//                     setStatus("Failed to decrypt reward amount.");
//                 }
                
//                 setLoading(false);
//             });

//             return () => {
//                 programClient.removeEventListener(listenerId);
//             }
//         } else {
//             setProgram(null);
//             setReward(null);
//         }
//     }, [wallet.connected, connection, clientKeyPair, mxePublicKey]);

//     const handleSetBounty = async (effortScore: number, qualityScore: number) => {
//         if (!program || !wallet.publicKey || !mxePublicKey) {
//             setStatus("Wallet not connected, program not initialized, or MXE key not fetched.");
//             return;
//         }

//         setLoading(true);
//         setStatus("Sending transaction to compute bounty...");

//         try {
//             const clientPublicKey = x25519.getPublicKey(clientKeyPair);
//             const nonce = new BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
            
//             // The IDL expects u64 values as 32-byte arrays.
//             const effortBuffer = Buffer.alloc(32);
//             effortBuffer.writeBigUInt64LE(BigInt(Math.floor(effortScore * 10)), 0);
            
//             const qualityBuffer = Buffer.alloc(32);
//             qualityBuffer.writeBigUInt64LE(BigInt(Math.floor(qualityScore * 10)), 0);

//             const [mxeAccount] = PublicKey.findProgramAddressSync([Buffer.from("mxe")], PROGRAM_ID);
//             const [compDefAccount] = PublicKey.findProgramAddressSync([Buffer.from("comp_def")], PROGRAM_ID);
//             const [executingPool] = PublicKey.findProgramAddressSync([Buffer.from("executing_pool")], PROGRAM_ID);
//             const [clusterAccount] = PublicKey.findProgramAddressSync([Buffer.from("cluster")], PROGRAM_ID);

//             const tx = await program.methods
//                 .bounty(
//                     new BN(100),
//                     Array.from(effortBuffer),
//                     Array.from(qualityBuffer),
//                     Array.from(clientPublicKey),
//                     new BN(nonce.toBuffer()),
//                 )
//                 .accounts({
//                     payer: wallet.publicKey,
//                     mxeAccount,
//                     mempoolAccount: PublicKey.unique(),
//                     executingPool,
//                     computationAccount: PublicKey.unique(),
//                     compDefAccount,
//                     clusterAccount,
//                     poolAccount: new PublicKey("7MGSS4iKNM4sVib7bDZDJhVqB6EcchPwVnTKenCY1jt3"),
//                     clockAccount: new PublicKey("FHriyvoZotYiFnbUzKFjzRSb2NiaC8RPWY7jtKuKhg65"),
//                     systemProgram: new PublicKey("11111111111111111111111111111111"),
//                     arciumProgram: new PublicKey("BKck65TgoKRokMjQM3datB9oRwJ8rAj2jxPXvHXUvcL6"),
//                 })
//                 .rpc();

//             setStatus(`Transaction sent: ${tx}. Waiting for event...`);

//         } catch (err) {
//             console.error("Failed to send transaction:", err);
//             setStatus(`Failed to send transaction: ${err instanceof Error ? err.message : String(err)}`);
//             setLoading(false);
//         }
//     }

//     return (
//         <div>
//             <Bounty onSubmit={handleSetBounty} contributor="Contributor Name" />
//             {loading && <p>Status: {status}</p>}
//             {reward !== null && (
//                 <p>
//                     Decrypted Reward Amount: <pre>{reward}</pre>
//                 </p>
//             )}
//         </div>
//     )
// }
=======
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
            )}
             */}
        </div>
    )
}
>>>>>>> ee91aa3 (Update frontend code)
