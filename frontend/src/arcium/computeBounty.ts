// /services/arcium-bounty.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  getMXEPublicKey,
  getComputationAccAddress,
  getMXEAccAddress,
  getMempoolAccAddress,
  getExecutingPoolAccAddress,
  getCompDefAccAddress,
  getCompDefAccOffset,
  getArciumEnv,
  x25519,
  RescueCipher,
  deserializeLE,
} from "@arcium-hq/client";
import { randomBytes as naclRandomBytes } from 'tweetnacl'; // Use a browser-compatible crypto library

// You will need to import your program's IDL
import { Computebounty } from "./compute_bounty"
import idl from "./computebounty.json"

// const arciumEnv = getArciumEnv();

// Helper function to generate random bytes
function randomBytes(length: number): Uint8Array {
  return naclRandomBytes(length);
}

export async function computeBounty(
  provider: anchor.AnchorProvider,
  programId: PublicKey,
  quality: number,
  effort: number
): Promise<string> {
  try {
    const program = new Program<Computebounty>(idl as Computebounty, provider);
    
    // These functions are already from @arcium-hq/client, which should be browser compatible
    const mxePublicKey = await getMXEPublicKey(provider, programId);
    console.log("MXE x25519 pubkey is", mxePublicKey);

    const privateKey = x25519.utils.randomPrivateKey();
    const publicKey = x25519.getPublicKey(privateKey);
    
    // Handle the case where mxePublicKey might be null
    if (!mxePublicKey) {
      throw new Error("MXE public key not found");
    }
    
    const sharedSecret = x25519.getSharedSecret(privateKey, mxePublicKey);
    const cipher = new RescueCipher(sharedSecret);

    const plaintext = [BigInt(quality), BigInt(effort)];

    const nonce = randomBytes(16);
    const ciphertext = cipher.encrypt(plaintext, nonce);

    // Validate ciphertext before using
    if (!ciphertext || ciphertext.length < 2) {
      throw new Error("Failed to encrypt plaintext - invalid ciphertext");
    }

    const computationOffset = new anchor.BN(randomBytes(8), "hex");

    console.log("Sending bounty transaction...");
    
    // Validate array conversions
    const effort_array = Array.from(ciphertext[0]);
    const quality_array = Array.from(ciphertext[1]);
    const pubkey_array = Array.from(publicKey);
    
    if (effort_array.length !== 32 || quality_array.length !== 32 || pubkey_array.length !== 32) {
      throw new Error("Invalid array lengths for transaction parameters");
    }

    const queueSig = await program.methods
      .bounty(
        computationOffset,
        effort_array,
        quality_array,
        pubkey_array,
        new anchor.BN(deserializeLE(nonce).toString())
      )
      .accountsPartial({
        computationAccount: getComputationAccAddress(program.programId, computationOffset),
        clusterAccount: arciumEnv.arciumClusterPubkey,
        mxeAccount: getMXEAccAddress(program.programId),
        mempoolAccount: getMempoolAccAddress(program.programId),
        executingPool: getExecutingPoolAccAddress(program.programId),
        compDefAccount: getCompDefAccAddress(
          program.programId,
          Buffer.from(getCompDefAccOffset("bounty")).readUInt32LE()
        ),
      })
      .rpc({ commitment: "confirmed" });

    console.log("🚀 Transaction sent with signature:", queueSig);

    // For now, just return the queue signature without waiting for finalization
    // to avoid long wait times in the UI
    return queueSig;
    
  } catch (error) {
    console.error("Error in computeBounty:", error);
    throw error;
  }
}