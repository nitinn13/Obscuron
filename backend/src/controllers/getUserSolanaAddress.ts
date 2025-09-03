import { Response } from "express";
import { AccessRequest } from "../types";
import axios from "axios";

const getUserSolanaAddress = async (req: AccessRequest, res: Response) => {
    const access_token = req.access_token;
    const { username } = req.params;

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/json"
            }
        });

        const result = await response.data;
        const bio: string = result.bio;
        console.log(bio);

        // This is the new regular expression for a Solana address
        const address = bio.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g);

        console.log(address)

        if(!address) {
            return res.status(400).json({ message: `${username} has not added a Solana address in their bio` });
        }
        else {
            return res.status(200).json(address?.[0]);
        }
    }
    catch(error) {
        res.status(500).json({ message: "Failed extraction of user Solana address" });
    }
}

export default getUserSolanaAddress;