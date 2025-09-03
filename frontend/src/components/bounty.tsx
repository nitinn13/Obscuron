"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { AlertCircle, DollarSign, Send, CheckCircle, Coins } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

type BountyProps = {
    onSubmit?: (effort: number, quality: number) => void
    contributor: string
    reward: string | null
}

enum BountyStep {
    INPUT = 'input',
    REWARD_DISPLAY = 'reward_display',
    SENDING = 'sending',
    SUCCESS = 'success'
}

export function Bounty({ onSubmit, contributor, reward }: BountyProps) {
    const [effort, setEffort] = useState("")
    const [quality, setQuality] = useState("")
    const [error, setError] = useState("")
<<<<<<< HEAD
    const [comment, setComment] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [reward, setReward] = useState("")


=======
    const [comment, setComment] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [contributorAddress, setContributorAddress] = useState<string | null>(null)
    const [isAddressLoading, setIsAddressLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState<BountyStep>(BountyStep.INPUT)
    const [transactionHash, setTransactionHash] = useState<string | null>(null)
    
    const wallet = useWallet()
    const { connection } = useConnection()
>>>>>>> ee91aa3 (Update frontend code)

    useEffect(() => {
        const getContributorAddress = async () => {
            if (!contributor) {
                setContributorAddress(null)
                return
            }

            setIsAddressLoading(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASE_URL}/users/${contributor}`, {
                    headers: {
                        Authorization: JSON.parse(localStorage.getItem("token") as string)
                    }
                })
                setContributorAddress(response.data)
            } catch (error) {
                console.error("Failed to fetch contributor address:", error)
                setContributorAddress(null)
            } finally {
                setIsAddressLoading(false)
            }
        }

        if (isOpen) {
            getContributorAddress()
        }
    }, [contributor, isOpen])
    
    // Watch for reward calculation completion
    useEffect(() => {
        if (reward !== null && currentStep === BountyStep.INPUT) {
            setCurrentStep(BountyStep.REWARD_DISPLAY)
        }
    }, [reward, currentStep])

    const handleSubmit = async () => {
        setError("")

        const effortScore = Number.parseFloat(effort)
        const qualityScore = Number.parseFloat(quality)

        if (!effort || !quality) {
            setError("Please fill in both fields.")
            return
        }

        if (isNaN(effortScore) || isNaN(qualityScore)) {
            setError("Please enter valid numbers.")
            return
        }

        if (effortScore < 0 || effortScore > 10 || qualityScore < 0 || qualityScore > 10) {
            setError("Scores must be between 0 and 10.")
            return
        }

        // Call the onSubmit prop, which will trigger the reward calculation in the parent
        onSubmit?.(effortScore, qualityScore)
    }

    const handleSendToken = async () => {
        if (!reward || !contributorAddress || !wallet.publicKey) return

        setCurrentStep(BountyStep.SENDING)
        setError("")

        try {
            const amount = Number(reward)
            const transaction = new Transaction()
            transaction.add(SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(contributorAddress),
                lamports: amount * LAMPORTS_PER_SOL,
            }))

            const signature = await wallet.sendTransaction(transaction, connection)
            setTransactionHash(signature)
            setCurrentStep(BountyStep.SUCCESS)
        } catch (txError) {
            console.error("Transaction failed:", txError)
            setError("Transaction failed. Please try again.")
            setCurrentStep(BountyStep.REWARD_DISPLAY)
        }
    }

    const handleDialogClose = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            // Reset state when closing
            setCurrentStep(BountyStep.INPUT)
            setEffort("")
            setQuality("")
            setComment("")
            setError("")
            setTransactionHash(null)
        }
    }

    useEffect(() => {
        setError("")
    }, [isOpen])

    const renderStepContent = () => {
        switch (currentStep) {
            case BountyStep.INPUT:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-white text-lg font-medium">
                                <DollarSign className="h-5 w-5" />
                                Set Bounty Scores for {contributor}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-sm">
                                Rate the effort and quality to calculate the bounty amount. Scores range from 0-10.
                            </DialogDescription>
                        </DialogHeader>

                        {isAddressLoading && (
                            <Alert className="bg-gray-950/50 border-gray-800">
                                <AlertDescription className="text-gray-300">
                                    Fetching contributor's Solana address...
                                </AlertDescription>
                            </Alert>
                        )}

                        {contributorAddress && !isAddressLoading && (
                            <Alert className="bg-green-950/50 border-green-800">
                                <AlertDescription className="text-green-300">
                                    **Solana Address:** {contributorAddress}
                                </AlertDescription>
                            </Alert>
                        )}

                        {!contributorAddress && !isAddressLoading && (
                            <Alert className="bg-red-950/50 border-red-800">
                                <AlertDescription className="text-red-300 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Contributor address not found in the database.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="effort" className="text-white text-sm font-medium">
                                    Effort Score
                                </Label>
                                <Input
                                    id="effort"
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={effort}
                                    onChange={(e) => setEffort(e.target.value)}
                                    placeholder="e.g., 8.5"
                                    className="bg-[#2a2a2a] border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-0 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quality" className="text-white text-sm font-medium">
                                    Quality Score
                                </Label>
                                <Input
                                    id="quality"
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={quality}
                                    onChange={(e) => setQuality(e.target.value)}
                                    placeholder="e.g., 9.0"
                                    className="bg-[#2a2a2a] border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-0 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comment" className="text-white text-sm font-medium">
                                    Comment (optional)
                                </Label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment about the PR..."
                                    className="bg-[#2a2a2a] border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-500 focus:ring-0 rounded-lg w-full h-24 p-2 resize-none"
                                />
                            </div>

                            {error && (
                                <Alert className="bg-red-950/50 border-red-800">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    className="bg-[#2a2a2a] border-gray-600 text-white hover:bg-[#3a3a3a] hover:border-gray-500"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button 
                                onClick={handleSubmit} 
                                className="bg-[#6C45FF] text-white hover:bg-[#5d3dd1]"
                                disabled={isAddressLoading || !contributorAddress}
                            >
                                Calculate Reward
                            </Button>
                        </DialogFooter>
                    </>
                )

            case BountyStep.REWARD_DISPLAY:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-white text-lg font-medium">
                                <Coins className="h-5 w-5 text-yellow-500" />
                                Bounty Calculated
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-sm">
                                Review the calculated bounty amount and send tokens to {contributor}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            {/* Score Summary */}
                            <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                                <h3 className="text-white font-medium mb-3">Score Summary</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Effort Score:</span>
                                        <span className="text-white ml-2 font-medium">{effort}/10</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Quality Score:</span>
                                        <span className="text-white ml-2 font-medium">{quality}/10</span>
                                    </div>
                                </div>
                                {comment && (
                                    <div className="mt-3 pt-3 border-t border-gray-700">
                                        <span className="text-gray-400 text-sm">Comment:</span>
                                        <p className="text-white text-sm mt-1">{comment}</p>
                                    </div>
                                )}
                            </div>

                            {/* Reward Amount Display */}
                            <div className="bg-gradient-to-r from-[#6C45FF]/20 to-[#8B5CF6]/20 border border-[#6C45FF]/30 rounded-lg p-6 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <DollarSign className="h-8 w-8 text-[#6C45FF]" />
                                </div>
                                <div className="text-gray-400 text-sm mb-1">Calculated Bounty</div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    {reward} SOL
                                </div>
                                <div className="text-gray-400 text-xs">
                                    ≈ ${(Number(reward) * 150).toFixed(2)} USD
                                </div>
                            </div>

                            {/* Recipient Info */}
                            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-gray-400 text-xs mb-1">Recipient</div>
                                <div className="text-white text-sm font-mono break-all">
                                    {contributorAddress}
                                </div>
                            </div>

                            {error && (
                                <Alert className="bg-red-950/50 border-red-800 mt-4">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(BountyStep.INPUT)}
                                className="bg-[#2a2a2a] border-gray-600 text-white hover:bg-[#3a3a3a] hover:border-gray-500"
                            >
                                Back to Edit
                            </Button>
                            <Button 
                                onClick={handleSendToken}
                                className="bg-[#6C45FF] text-white hover:bg-[#5d3dd1] gap-2"
                            >
                                <Send className="h-4 w-4" />
                                Send Tokens
                            </Button>
                        </DialogFooter>
                    </>
                )

            case BountyStep.SENDING:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-white text-lg font-medium">
                                <Send className="h-5 w-5 animate-pulse text-[#6C45FF]" />
                                Sending Transaction
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-sm">
                                Please confirm the transaction in your wallet...
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C45FF] mx-auto mb-4"></div>
                            <p className="text-white mb-2">Processing transaction...</p>
                            <p className="text-gray-400 text-sm">Sending {reward} SOL to {contributor}</p>
                        </div>
                    </>
                )

            case BountyStep.SUCCESS:
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-white text-lg font-medium">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Transaction Successful
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 text-sm">
                                Bounty has been sent successfully to {contributor}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 text-center">
                            <div className="bg-green-950/30 border border-green-800 rounded-lg p-6">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <div className="text-white text-lg font-medium mb-2">
                                    {reward} SOL Sent Successfully!
                                </div>
                                <div className="text-gray-400 text-sm mb-4">
                                    Transaction has been confirmed on the blockchain
                                </div>
                                {transactionHash && (
                                    <div className="text-xs text-gray-500 font-mono break-all bg-gray-900 p-2 rounded">
                                        {transactionHash}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={() => handleDialogClose(false)}
                                className="w-full bg-[#6C45FF] text-white hover:bg-[#5d3dd1]"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </>
                )

            default:
                return null
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button variant="default" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    Set Bounty
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-[#1a1a1a] border-gray-800">
                {renderStepContent()}
            </DialogContent>
        </Dialog>
    )
}