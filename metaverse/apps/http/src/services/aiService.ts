import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// AI Models
const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export class AIService {
  
  /**
   * Generate intelligent startup-mentor matching recommendations
   */
  static async generateStartupMentorMatches(
    startupProfile: any,
    availableMentors: any[]
  ): Promise<{ mentorId: string; matchScore: number; reasoning: string }[]> {
    try {
      const prompt = `
        As an expert startup accelerator advisor, analyze this startup profile and recommend the best mentor matches from the available mentors.

        STARTUP PROFILE:
        - Name: ${startupProfile.startupName}
        - Sector: ${startupProfile.sector || 'Not specified'}
        - Stage: ${startupProfile.stage}
        - Description: ${startupProfile.description || 'Not provided'}
        - Team Size: ${startupProfile.teamSize || 'Not specified'}
        - Funding Goal: ${startupProfile.fundingGoal || 'Not specified'}

        AVAILABLE MENTORS:
        ${availableMentors.map((mentor, index) => `
        ${index + 1}. ID: ${mentor.id}
           - Name: ${mentor.user.firstName} ${mentor.user.lastName}
           - Title: ${mentor.title}
           - Company: ${mentor.company || 'Not specified'}
           - Experience: ${mentor.experience || 'Not specified'} years
           - Expertise: ${mentor.expertise.join(', ')}
           - Rate: $${mentor.hourlyRate || 'Not specified'}/hour
        `).join('')}

        Please provide:
        1. Top 3-5 mentor recommendations ranked by match quality
        2. Match score (0-100) for each recommendation
        3. Brief reasoning for each match

        Respond in JSON format:
        {
          "matches": [
            {
              "mentorId": "mentor_id",
              "matchScore": 85,
              "reasoning": "Brief explanation of why this is a good match"
            }
          ]
        }
      `;

      const result = await textModel.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response);
        return parsed.matches || [];
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return [];
      }
    } catch (error) {
      console.error('AI matching error:', error);
      return [];
    }
  }

  /**
   * Generate intelligent startup-investor matching recommendations
   */
  static async generateStartupInvestorMatches(
    startupProfile: any,
    availableInvestors: any[]
  ): Promise<{ investorId: string; matchScore: number; reasoning: string }[]> {
    try {
      const prompt = `
        As an expert venture capital advisor, analyze this startup profile and recommend the best investor matches.

        STARTUP PROFILE:
        - Name: ${startupProfile.startupName}
        - Sector: ${startupProfile.sector || 'Not specified'}
        - Stage: ${startupProfile.stage}
        - Description: ${startupProfile.description || 'Not provided'}
        - Funding Goal: ${startupProfile.fundingGoal || 'Not specified'}
        - Current Funding: ${startupProfile.currentFunding || 'Not specified'}
        - Location: ${startupProfile.location || 'Not specified'}

        AVAILABLE INVESTORS:
        ${availableInvestors.map((investor, index) => `
        ${index + 1}. ID: ${investor.id}
           - Name: ${investor.user.firstName} ${investor.user.lastName}
           - Firm: ${investor.firm}
           - Title: ${investor.title}
           - Investment Focus: ${investor.investmentFocus.join(', ')}
           - Min Investment: $${investor.minInvestment || 'Not specified'}
           - Max Investment: $${investor.maxInvestment || 'Not specified'}
           - Preferred Stage: ${investor.preferredStage.join(', ')}
        `).join('')}

        Provide top investor matches with scores and reasoning in JSON format:
        {
          "matches": [
            {
              "investorId": "investor_id",
              "matchScore": 90,
              "reasoning": "Brief explanation of investment fit"
            }
          ]
        }
      `;

      const result = await textModel.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response);
        return parsed.matches || [];
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return [];
      }
    } catch (error) {
      console.error('AI investor matching error:', error);
      return [];
    }
  }

  /**
   * Analyze pitch deck and provide feedback
   */
  static async analyzePitchDeck(
    startupProfile: any,
    pitchContent?: string
  ): Promise<{
    overallScore: number;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `
        As an expert pitch deck analyst and startup advisor, analyze this startup's pitch information and provide comprehensive feedback.

        STARTUP INFORMATION:
        - Name: ${startupProfile.startupName}
        - Tagline: ${startupProfile.tagline || 'Not provided'}
        - Sector: ${startupProfile.sector || 'Not specified'}
        - Stage: ${startupProfile.stage}
        - Description: ${startupProfile.description || 'Not provided'}
        - Team Size: ${startupProfile.teamSize || 'Not specified'}
        - Funding Goal: ${startupProfile.fundingGoal || 'Not specified'}
        - Website: ${startupProfile.website || 'Not provided'}
        
        ${pitchContent ? `PITCH CONTENT: ${pitchContent}` : ''}

        Provide detailed analysis in JSON format:
        {
          "overallScore": 75,
          "strengths": ["List of 3-5 key strengths"],
          "improvements": ["List of 3-5 areas for improvement"],
          "recommendations": ["List of 3-5 specific actionable recommendations"]
        }
      `;

      const result = await proModel.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response);
        return {
          overallScore: parsed.overallScore || 0,
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          recommendations: parsed.recommendations || []
        };
      } catch (parseError) {
        console.error('Failed to parse pitch analysis:', parseError);
        return {
          overallScore: 0,
          strengths: [],
          improvements: [],
          recommendations: []
        };
      }
    } catch (error) {
      console.error('Pitch analysis error:', error);
      return {
        overallScore: 0,
        strengths: [],
        improvements: [],
        recommendations: []
      };
    }
  }

  /**
   * Generate business recommendations based on startup profile
   */
  static async generateBusinessRecommendations(
    startupProfile: any,
    userType: 'FOUNDER' | 'MENTOR' | 'INVESTOR'
  ): Promise<{
    strategies: string[];
    opportunities: string[];
    risks: string[];
    nextSteps: string[];
  }> {
    try {
      const prompt = `
        As an expert business strategist, provide tailored recommendations for this startup from a ${userType.toLowerCase()}'s perspective.

        STARTUP PROFILE:
        - Name: ${startupProfile.startupName}
        - Sector: ${startupProfile.sector || 'Not specified'}
        - Stage: ${startupProfile.stage}
        - Description: ${startupProfile.description || 'Not provided'}
        - Team Size: ${startupProfile.teamSize || 'Not specified'}
        - Funding Goal: ${startupProfile.fundingGoal || 'Not specified'}
        - Current Funding: ${startupProfile.currentFunding || 'Not specified'}
        - Location: ${startupProfile.location || 'Not specified'}

        Provide comprehensive business insights in JSON format:
        {
          "strategies": ["3-5 strategic recommendations"],
          "opportunities": ["3-5 market opportunities to explore"],
          "risks": ["3-5 potential risks to mitigate"],
          "nextSteps": ["3-5 immediate actionable next steps"]
        }
      `;

      const result = await proModel.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response);
        return {
          strategies: parsed.strategies || [],
          opportunities: parsed.opportunities || [],
          risks: parsed.risks || [],
          nextSteps: parsed.nextSteps || []
        };
      } catch (parseError) {
        console.error('Failed to parse business recommendations:', parseError);
        return {
          strategies: [],
          opportunities: [],
          risks: [],
          nextSteps: []
        };
      }
    } catch (error) {
      console.error('Business recommendations error:', error);
      return {
        strategies: [],
        opportunities: [],
        risks: [],
        nextSteps: []
      };
    }
  }

  /**
   * Generate intelligent Q&A responses and follow-up questions
   */
  static async enhanceQnA(
    question: string,
    context: {
      startupProfile?: any;
      pitchSession?: any;
      userType: string;
    }
  ): Promise<{
    suggestedAnswer?: string;
    followUpQuestions: string[];
    relatedTopics: string[];
  }> {
    try {
      const prompt = `
        As an expert startup advisor, help enhance this Q&A interaction.

        QUESTION: "${question}"
        
        CONTEXT:
        - User Type: ${context.userType}
        ${context.startupProfile ? `- Startup: ${context.startupProfile.startupName} (${context.startupProfile.sector})` : ''}
        ${context.pitchSession ? `- Pitch Session: ${context.pitchSession.title}` : ''}

        Provide helpful Q&A enhancements in JSON format:
        {
          "suggestedAnswer": "Helpful answer if appropriate for the context",
          "followUpQuestions": ["3-5 relevant follow-up questions"],
          "relatedTopics": ["3-5 related topics to explore"]
        }
      `;

      const result = await textModel.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response);
        return {
          suggestedAnswer: parsed.suggestedAnswer,
          followUpQuestions: parsed.followUpQuestions || [],
          relatedTopics: parsed.relatedTopics || []
        };
      } catch (parseError) {
        console.error('Failed to parse Q&A enhancement:', parseError);
        return {
          followUpQuestions: [],
          relatedTopics: []
        };
      }
    } catch (error) {
      console.error('Q&A enhancement error:', error);
      return {
        followUpQuestions: [],
        relatedTopics: []
      };
    }
  }

  /**
   * General AI chat assistant for metaverse guidance
   */
  static async chatAssistant(
    message: string,
    userContext: {
      userType: string;
      hasStartupProfile?: boolean;
      hasMentorProfile?: boolean;
      hasInvestorProfile?: boolean;
    }
  ): Promise<string> {
    try {
      const prompt = `
        You are an AI assistant for a Startup Accelerator Metaverse platform. Help users navigate and get the most value from the platform.

        USER MESSAGE: "${message}"
        
        USER CONTEXT:
        - User Type: ${userContext.userType}
        - Has Startup Profile: ${userContext.hasStartupProfile || false}
        - Has Mentor Profile: ${userContext.hasMentorProfile || false}
        - Has Investor Profile: ${userContext.hasInvestorProfile || false}

        PLATFORM FEATURES:
        - Virtual spaces: Lobby, Startup Booths, Pitch Stage, Mentor Lounge, Investor Island, Resource Pavilion
        - Profile creation and management
        - Pitch sessions and Q&A
        - Mentor booking system
        - Investor meetings
        - Real-time networking

        Provide a helpful, friendly, and actionable response that guides the user to make the most of the platform.
      `;

      const result = await textModel.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Chat assistant error:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support for assistance.";
    }
  }
}
