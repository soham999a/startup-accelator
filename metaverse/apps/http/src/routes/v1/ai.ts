import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { AIService } from "../../services/aiService";
import client from "@repo/db/client";

export const aiRouter = Router();

// AI Matching Routes
aiRouter.get("/matches/mentors", userMiddleware, async (req, res) => {
    try {
        // Get user's startup profile
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: { startupProfile: true }
        });

        if (!user?.startupProfile) {
            res.status(400).json({ 
                message: "Startup profile required for mentor matching" 
            });
            return;
        }

        // Get available mentors
        const mentors = await client.mentorProfile.findMany({
            where: { isAvailable: true },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        isVerified: true
                    }
                }
            }
        });

        if (mentors.length === 0) {
            res.json({ matches: [] });
            return;
        }

        // Generate AI-powered matches
        const matches = await AIService.generateStartupMentorMatches(
            user.startupProfile,
            mentors
        );

        res.json({ matches });
    } catch (error) {
        console.error("AI mentor matching error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

aiRouter.get("/matches/investors", userMiddleware, async (req, res) => {
    try {
        // Get user's startup profile
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: { startupProfile: true }
        });

        if (!user?.startupProfile) {
            res.status(400).json({ 
                message: "Startup profile required for investor matching" 
            });
            return;
        }

        // Get available investors
        const investors = await client.investorProfile.findMany({
            where: { isAvailable: true },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        isVerified: true
                    }
                }
            }
        });

        if (investors.length === 0) {
            res.json({ matches: [] });
            return;
        }

        // Generate AI-powered matches
        const matches = await AIService.generateStartupInvestorMatches(
            user.startupProfile,
            investors
        );

        res.json({ matches });
    } catch (error) {
        console.error("AI investor matching error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// AI Pitch Analysis Routes
aiRouter.post("/analyze/pitch", userMiddleware, async (req, res) => {
    try {
        const { pitchContent } = req.body;

        // Get user's startup profile
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: { startupProfile: true }
        });

        if (!user?.startupProfile) {
            res.status(400).json({ 
                message: "Startup profile required for pitch analysis" 
            });
            return;
        }

        // Generate AI-powered pitch analysis
        const analysis = await AIService.analyzePitchDeck(
            user.startupProfile,
            pitchContent
        );

        res.json({ analysis });
    } catch (error) {
        console.error("AI pitch analysis error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// AI Business Recommendations Routes
aiRouter.get("/recommendations/business", userMiddleware, async (req, res) => {
    try {
        // Get user profile
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: { startupProfile: true }
        });

        if (!user?.startupProfile) {
            res.status(400).json({ 
                message: "Startup profile required for business recommendations" 
            });
            return;
        }

        // Generate AI-powered business recommendations
        const recommendations = await AIService.generateBusinessRecommendations(
            user.startupProfile,
            user.userType as 'FOUNDER' | 'MENTOR' | 'INVESTOR'
        );

        res.json({ recommendations });
    } catch (error) {
        console.error("AI business recommendations error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// AI Q&A Enhancement Routes
aiRouter.post("/enhance/qna", userMiddleware, async (req, res) => {
    try {
        const { question, pitchSessionId } = req.body;

        if (!question) {
            res.status(400).json({ message: "Question is required" });
            return;
        }

        // Get context information
        let context: any = {
            userType: req.userType || 'FOUNDER'
        };

        // Get startup profile if available
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: { startupProfile: true }
        });

        if (user?.startupProfile) {
            context.startupProfile = user.startupProfile;
        }

        // Get pitch session if provided
        if (pitchSessionId) {
            const pitchSession = await client.pitchSession.findUnique({
                where: { id: pitchSessionId }
            });
            if (pitchSession) {
                context.pitchSession = pitchSession;
            }
        }

        // Generate AI-enhanced Q&A
        const enhancement = await AIService.enhanceQnA(question, context);

        res.json({ enhancement });
    } catch (error) {
        console.error("AI Q&A enhancement error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// AI Chat Assistant Routes
aiRouter.post("/chat", userMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            res.status(400).json({ message: "Message is required" });
            return;
        }

        // Get user context
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: {
                startupProfile: true,
                mentorProfile: true,
                investorProfile: true
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const userContext = {
            userType: user.userType,
            hasStartupProfile: !!user.startupProfile,
            hasMentorProfile: !!user.mentorProfile,
            hasInvestorProfile: !!user.investorProfile
        };

        // Generate AI chat response
        const response = await AIService.chatAssistant(message, userContext);

        res.json({ response });
    } catch (error) {
        console.error("AI chat assistant error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// AI Insights Dashboard Route
aiRouter.get("/insights/dashboard", userMiddleware, async (req, res) => {
    try {
        const user = await client.user.findUnique({
            where: { id: req.userId },
            include: {
                startupProfile: true,
                mentorProfile: true,
                investorProfile: true
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const insights: any = {
            userType: user.userType,
            profileCompleteness: 0,
            recommendations: [],
            quickActions: []
        };

        // Calculate profile completeness
        if (user.startupProfile) {
            const fields = [
                'startupName', 'description', 'sector', 'website', 
                'pitchDeckUrl', 'fundingGoal'
            ];
            const completedFields = fields.filter(field => 
                user.startupProfile![field as keyof typeof user.startupProfile]
            );
            insights.profileCompleteness = Math.round((completedFields.length / fields.length) * 100);
        }

        // Add quick actions based on user type and profile status
        if (user.userType === 'FOUNDER') {
            if (!user.startupProfile) {
                insights.quickActions.push({
                    title: "Create Startup Profile",
                    description: "Set up your startup profile to get AI-powered matches",
                    action: "create_startup_profile"
                });
            } else {
                insights.quickActions.push({
                    title: "Find Mentors",
                    description: "Get AI-recommended mentors for your startup",
                    action: "find_mentors"
                });
                insights.quickActions.push({
                    title: "Analyze Pitch",
                    description: "Get AI feedback on your pitch deck",
                    action: "analyze_pitch"
                });
            }
        }

        res.json({ insights });
    } catch (error) {
        console.error("AI insights dashboard error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
