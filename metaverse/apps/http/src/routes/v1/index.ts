import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { profilesRouter } from "./profiles";
import { aiRouter } from "./ai";
import { SigninSchema, SignupSchema } from "../../types";
import {hash, compare} from "../../scrypt";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

export const router = Router();

router.post("/signup", async (req, res) => {
    console.log("inside signup")
    // check the user
    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        })
        return
    }

    const hashedPassword = await hash(parsedData.data.password)

    try {
        // Check if user already exists
        const existingUser = await client.user.findFirst({
            where: {
                OR: [
                    { email: parsedData.data.email },
                    { username: parsedData.data.username }
                ]
            }
        })

        if (existingUser) {
            res.status(400).json({message: "User with this email or username already exists"})
            return
        }

        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                email: parsedData.data.email,
                password: hashedPassword,
                firstName: parsedData.data.firstName,
                lastName: parsedData.data.lastName,
                role: parsedData.data.type === "admin" ? "Admin" : "User",
                userType: parsedData.data.userType,
            }
        })

        // Generate JWT token
        const token = jwt.sign({
            userId: user.id,
            role: user.role,
            userType: user.userType
        }, JWT_PASSWORD);

        res.json({
            userId: user.id,
            token,
            userType: user.userType,
            message: "User created successfully"
        })
    } catch(e) {
        console.log("error thrown")
        console.log(e)
        res.status(500).json({message: "Internal server error"})
    }
})

router.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        })
        return
    }

    try {
        const user = await client.user.findUnique({
            where: {
                email: parsedData.data.email
            },
            include: {
                startupProfile: true,
                mentorProfile: true,
                investorProfile: true
            }
        })

        if (!user) {
            res.status(401).json({message: "Invalid email or password"})
            return
        }

        const isValid = await compare(parsedData.data.password, user.password)

        if (!isValid) {
            res.status(401).json({message: "Invalid email or password"})
            return
        }

        // Update last active timestamp
        await client.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() }
        })

        const token = jwt.sign({
            userId: user.id,
            role: user.role,
            userType: user.userType
        }, JWT_PASSWORD);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                isVerified: user.isVerified,
                profileImage: user.profileImage,
                hasStartupProfile: !!user.startupProfile,
                hasMentorProfile: !!user.mentorProfile,
                hasInvestorProfile: !!user.investorProfile
            }
        })
    } catch(e) {
        console.log("signin error:", e)
        res.status(500).json({message: "Internal server error"})
    }
})

router.get("/elements", async (req, res) => {
    const elements = await client.element.findMany()

    res.json({elements: elements.map(e => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static
    }))})
})

router.get("/avatars", async (req, res) => {
    const avatars = await client.avatar.findMany()
    res.json({avatars: avatars.map(x => ({
        id: x.id,
        imageUrl: x.imageUrl,
        name: x.name
    }))})
})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)
router.use("/profiles", profilesRouter)
router.use("/ai", aiRouter)
