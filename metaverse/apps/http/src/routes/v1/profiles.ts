import { Router } from "express";
import client from "@repo/db/client";
import { userMiddleware, founderMiddleware, mentorMiddleware, investorMiddleware } from "../../middleware/user";
import { 
    CreateStartupProfileSchema, 
    UpdateStartupProfileSchema,
    CreateMentorProfileSchema,
    UpdateMentorProfileSchema,
    CreateInvestorProfileSchema,
    UpdateInvestorProfileSchema
} from "../../types";

export const profilesRouter = Router();

// Get current user's profile
profilesRouter.get("/me", userMiddleware, async (req, res) => {
    try {
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: {
                startupProfile: true,
                mentorProfile: true,
                investorProfile: true,
                avatar: true
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                profileImage: user.profileImage,
                userType: user.userType,
                isVerified: user.isVerified,
                joinedAt: user.joinedAt,
                lastActive: user.lastActive,
                avatar: user.avatar,
                startupProfile: user.startupProfile,
                mentorProfile: user.mentorProfile,
                investorProfile: user.investorProfile
            }
        });
    } catch (e) {
        console.log("Get profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update basic user profile
profilesRouter.put("/me", userMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, bio, profileImage } = req.body;
        
        const user = await client.user.update({
            where: { id: req.userId },
            data: {
                firstName,
                lastName,
                bio,
                profileImage
            }
        });

        res.json({ 
            message: "Profile updated successfully",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });
    } catch (e) {
        console.log("Update profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

// STARTUP PROFILE ROUTES
profilesRouter.post("/startup", founderMiddleware, async (req, res) => {
    const parsedData = CreateStartupProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        });
        return;
    }

    try {
        // Check if startup profile already exists
        const existingProfile = await client.startupProfile.findUnique({
            where: { userId: req.userId }
        });

        if (existingProfile) {
            res.status(400).json({ message: "Startup profile already exists" });
            return;
        }

        const startupProfile = await client.startupProfile.create({
            data: {
                userId: req.userId!,
                ...parsedData.data
            }
        });

        res.json({
            message: "Startup profile created successfully",
            profile: startupProfile
        });
    } catch (e) {
        console.log("Create startup profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

profilesRouter.put("/startup", founderMiddleware, async (req, res) => {
    const parsedData = UpdateStartupProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        });
        return;
    }

    try {
        const startupProfile = await client.startupProfile.update({
            where: { userId: req.userId },
            data: parsedData.data
        });

        res.json({
            message: "Startup profile updated successfully",
            profile: startupProfile
        });
    } catch (e) {
        console.log("Update startup profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

// MENTOR PROFILE ROUTES
profilesRouter.post("/mentor", mentorMiddleware, async (req, res) => {
    const parsedData = CreateMentorProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        });
        return;
    }

    try {
        const existingProfile = await client.mentorProfile.findUnique({
            where: { userId: req.userId }
        });

        if (existingProfile) {
            res.status(400).json({ message: "Mentor profile already exists" });
            return;
        }

        const mentorProfile = await client.mentorProfile.create({
            data: {
                userId: req.userId!,
                ...parsedData.data
            }
        });

        res.json({
            message: "Mentor profile created successfully",
            profile: mentorProfile
        });
    } catch (e) {
        console.log("Create mentor profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

profilesRouter.put("/mentor", mentorMiddleware, async (req, res) => {
    const parsedData = UpdateMentorProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        });
        return;
    }

    try {
        const mentorProfile = await client.mentorProfile.update({
            where: { userId: req.userId },
            data: parsedData.data
        });

        res.json({
            message: "Mentor profile updated successfully",
            profile: mentorProfile
        });
    } catch (e) {
        console.log("Update mentor profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

// INVESTOR PROFILE ROUTES
profilesRouter.post("/investor", investorMiddleware, async (req, res) => {
    const parsedData = CreateInvestorProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        });
        return;
    }

    try {
        const existingProfile = await client.investorProfile.findUnique({
            where: { userId: req.userId }
        });

        if (existingProfile) {
            res.status(400).json({ message: "Investor profile already exists" });
            return;
        }

        const investorProfile = await client.investorProfile.create({
            data: {
                userId: req.userId!,
                ...parsedData.data
            }
        });

        res.json({
            message: "Investor profile created successfully",
            profile: investorProfile
        });
    } catch (e) {
        console.log("Create investor profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

profilesRouter.put("/investor", investorMiddleware, async (req, res) => {
    const parsedData = UpdateInvestorProfileSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: parsedData.error.errors
        });
        return;
    }

    try {
        const investorProfile = await client.investorProfile.update({
            where: { userId: req.userId },
            data: parsedData.data
        });

        res.json({
            message: "Investor profile updated successfully",
            profile: investorProfile
        });
    } catch (e) {
        console.log("Update investor profile error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get public profiles for discovery
profilesRouter.get("/startups", userMiddleware, async (req, res) => {
    try {
        const startups = await client.startupProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        isVerified: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ startups });
    } catch (e) {
        console.log("Get startups error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

profilesRouter.get("/mentors", userMiddleware, async (req, res) => {
    try {
        const mentors = await client.mentorProfile.findMany({
            where: { isAvailable: true },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        isVerified: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ mentors });
    } catch (e) {
        console.log("Get mentors error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

profilesRouter.get("/investors", userMiddleware, async (req, res) => {
    try {
        const investors = await client.investorProfile.findMany({
            where: { isAvailable: true },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        isVerified: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ investors });
    } catch (e) {
        console.log("Get investors error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});
