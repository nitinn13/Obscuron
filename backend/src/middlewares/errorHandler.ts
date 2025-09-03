import { Request, Response, NextFunction } from "express";

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error.name);

    if (error.name === "CastError") {
        return res.status(400).json({ message: "Malformatted Id" });
    } 
    else if (error.name === "JsonWebTokenError") {
        console.log(error);
        return res.status(400).json({ message: "Invalid token" });
    } 
    else {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export default errorHandler;