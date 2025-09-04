# Obscuron – Encrypted GitHub Bounty Dispenser  

[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-blue)](https://obscuron-d8my.vercel.app/)  
[![Solana Devnet](https://img.shields.io/badge/Program-Solana%20Devnet-9cf)](https://explorer.solana.com/address/6MUHFNw3WeuDP1Gm1UZR1yUouN6nVYguBEHEF2vmw5Dt?cluster=devnet)  

Obscuron is an **Arcium Fellowship project** that brings **confidential computing** to open-source funding.  
It enables GitHub maintainers to **fairly distribute bounties** across contributors while keeping the computation of rewards **encrypted and privacy-preserving**.  

With Obscuron, maintainers can:  
- 🔑 Log in with **GitHub**  
- 👀 View **open pull requests**  
- 📝 Assign qualitative metrics (**effort, quality, length**)  
- 🔐 Trigger **private MPC computation** via **Arcium’s MXE (Multiparty Execution Environment)**  
- 💸 Automatically **distribute rewards on Solana** using a secure smart contract  

---

## ✨ Key Features  

### 🔐 Arcium MPC Integration  
- Uses **Arcium MXE** for private bounty calculations.  
- Maintainers’ inputs (effort, quality, length) are **never exposed in plaintext**.  
- The MPC generates an **encrypted, verifiable bounty split**.  
- Guarantees **confidentiality**, **integrity**, and **trustlessness**.  

### 🌐 Web3 Backend (Solana)  
- Rewards distributed via a **Solana Program** on **Devnet**  
  [`6MUHFNw3WeuDP1Gm1UZR1yUouN6nVYguBEHEF2vmw5Dt`](https://explorer.solana.com/address/6MUHFNw3WeuDP1Gm1UZR1yUouN6nVYguBEHEF2vmw5Dt?cluster=devnet)  
- Maintainers fund a **treasury wallet**, payouts are automated after MPC results.  

### 🛠 Maintainer Workflow  
1. Authenticate with GitHub OAuth.  
2. Fetch and display open PRs.  
3. Assign evaluation metrics.  
4. Submit → **MPC computes encrypted payout**.  
5. Solana program distributes rewards to contributor wallets.  

---

## 🌍 Live Demo  

- Frontend: [https://obscuron-d8my.vercel.app/](https://obscuron-d8my.vercel.app/)  
- Solana Program: [View on Explorer](https://explorer.solana.com/address/6MUHFNw3WeuDP1Gm1UZR1yUouN6nVYguBEHEF2vmw5Dt?cluster=devnet)  

---

## 📂 Tech Stack  

- **Frontend**: Next.js, TailwindCSS, GitHub OAuth  
- **Backend**: Node.js, Express, Arcium MXE, Solana Web3.js  
- **Blockchain**: Solana Devnet Smart Contract  

---

## 🚀 Architecture  

```mermaid
flowchart TD
    A[Maintainer] -->|Login| B[GitHub OAuth]
    B --> C[View Open PRs]
    C --> D[Assign Metrics]
    D --> E[Encrypted Submission to Arcium MXE]
    E --> F[MPC Computation]
    F --> G[Backend Receives Result]
    G --> H[Solana Program]
    H --> I[Contributors Paid in Wallets]
