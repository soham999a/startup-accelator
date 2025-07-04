
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if (!token) {
        res.status(401).json({message: "Authorization token required"})
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as {
            role: string,
            userId: string,
            userType: string
        }
        req.userId = decoded.userId
        req.role = decoded.role as "Admin" | "User"
        req.userType = decoded.userType as "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN"
        next()
    } catch(e) {
        res.status(401).json({message: "Invalid or expired token"})
        return
    }
}

// Middleware for specific user types
export const founderMiddleware = (req: Request, res: Response, next: NextFunction) => {
    userMiddleware(req, res, () => {
        if (req.userType !== "FOUNDER" && req.role !== "Admin") {
            res.status(403).json({message: "Founder access required"})
            return
        }
        next()
    })
}

export const mentorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    userMiddleware(req, res, () => {
        if (req.userType !== "MENTOR" && req.role !== "Admin") {
            res.status(403).json({message: "Mentor access required"})
            return
        }
        next()
    })
}

export const investorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    userMiddleware(req, res, () => {
        if (req.userType !== "INVESTOR" && req.role !== "Admin") {
            res.status(403).json({message: "Investor access required"})
            return
        }
        next()
    })
}