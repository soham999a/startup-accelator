import z from "zod";

export const SignupSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    userType: z.enum(["FOUNDER", "MENTOR", "INVESTOR"]).default("FOUNDER"),
    type: z.enum(["user", "admin"]).default("user"),
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string().optional(),
})

export const DeleteElementSchema = z.object({
    id: z.string(),
})

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
})

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
})

export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    }))
})

// Startup Profile Schemas
export const CreateStartupProfileSchema = z.object({
    startupName: z.string().min(1).max(100),
    tagline: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
    website: z.string().url().optional(),
    logo: z.string().url().optional(),
    sector: z.string().optional(),
    stage: z.enum(["IDEA", "MVP", "EARLY_STAGE", "GROWTH", "SCALE_UP"]).default("IDEA"),
    foundedYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
    teamSize: z.number().min(1).optional(),
    location: z.string().optional(),
    pitchDeckUrl: z.string().url().optional(),
    videoPitchUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    twitterUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    fundingGoal: z.number().positive().optional(),
    currentFunding: z.number().min(0).optional(),
    previousRounds: z.string().optional(),
    boothTheme: z.string().default("default"),
    boothBanner: z.string().url().optional(),
})

export const UpdateStartupProfileSchema = CreateStartupProfileSchema.partial()

// Mentor Profile Schemas
export const CreateMentorProfileSchema = z.object({
    title: z.string().min(1).max(100),
    company: z.string().max(100).optional(),
    experience: z.number().min(0).max(50).optional(),
    expertise: z.array(z.enum([
        "PRODUCT_DEVELOPMENT", "MARKETING", "SALES", "FUNDRAISING",
        "OPERATIONS", "TECHNOLOGY", "LEGAL", "FINANCE", "HR",
        "STRATEGY", "DESIGN", "GROWTH_HACKING"
    ])),
    isAvailable: z.boolean().default(true),
    hourlyRate: z.number().positive().optional(),
    timezone: z.string().optional(),
    achievements: z.string().max(1000).optional(),
    linkedinUrl: z.string().url().optional(),
    calendlyUrl: z.string().url().optional(),
    sessionDuration: z.number().min(15).max(120).default(30),
    maxBookingsPerDay: z.number().min(1).max(20).default(5),
})

export const UpdateMentorProfileSchema = CreateMentorProfileSchema.partial()

// Investor Profile Schemas
export const CreateInvestorProfileSchema = z.object({
    firm: z.string().min(1).max(100),
    title: z.string().min(1).max(100),
    investmentFocus: z.array(z.enum([
        "FINTECH", "HEALTHTECH", "EDTECH", "SAAS", "ECOMMERCE",
        "AI_ML", "BLOCKCHAIN", "CLIMATE_TECH", "BIOTECH",
        "CONSUMER_APPS", "B2B_TOOLS", "OTHER"
    ])),
    minInvestment: z.number().positive().optional(),
    maxInvestment: z.number().positive().optional(),
    preferredStage: z.array(z.enum(["IDEA", "MVP", "EARLY_STAGE", "GROWTH", "SCALE_UP"])),
    bio: z.string().max(1000).optional(),
    linkedinUrl: z.string().url().optional(),
    firmWebsite: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
    isAvailable: z.boolean().default(true),
})

export const UpdateInvestorProfileSchema = CreateInvestorProfileSchema.partial()

// Pitch Session Schemas
export const CreatePitchSessionSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    scheduledAt: z.string().datetime(),
    duration: z.number().min(5).max(60).default(10),
    maxAttendees: z.number().min(1).max(500).default(50),
    isRecorded: z.boolean().default(false),
})

export const UpdatePitchSessionSchema = CreatePitchSessionSchema.partial()

// Booking Schemas
export const CreateMentorBookingSchema = z.object({
    mentorId: z.string(),
    scheduledAt: z.string().datetime(),
    duration: z.number().min(15).max(120).default(30),
    notes: z.string().max(500).optional(),
})

export const CreateInvestorMeetingSchema = z.object({
    investorId: z.string(),
    scheduledAt: z.string().datetime(),
    duration: z.number().min(15).max(120).default(45),
    agenda: z.string().max(1000).optional(),
})

// Q&A Schemas
export const CreateQuestionSchema = z.object({
    pitchSessionId: z.string(),
    question: z.string().min(1).max(500),
})

export const AnswerQuestionSchema = z.object({
    questionId: z.string(),
    answer: z.string().min(1).max(1000),
})

// Announcement Schemas
export const CreateAnnouncementSchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(2000),
    type: z.enum(["general", "event", "urgent"]).default("general"),
    isPinned: z.boolean().default(false),
    expiresAt: z.string().datetime().optional(),
})

export const UpdateAnnouncementSchema = CreateAnnouncementSchema.partial()

declare global {
    namespace Express {
      export interface Request {
        role?: "Admin" | "User";
        userId?: string;
        userType?: "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";
      }
    }
}