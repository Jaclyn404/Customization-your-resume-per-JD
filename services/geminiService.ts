
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, UserInput } from "../types";

export const analyzeResume = async (input: UserInput): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  
  // Construct the prompt context
  let textPrompt = `As a world-class HR Expert, compare the following Resume against the Job Description. 
  
  TASK:
  1. Give a match score from 1 to 10.
  2. Identify the TOP 3 most critical improvements needed for the resume to land an interview.
  3. Provide a brief overall feedback.
  4. Provide a full revamped version of the resume text.
  5. List specific missing keywords.
  
  JOB DESCRIPTION:
  ${input.jdFile ? `[Provided as Attachment: ${input.jdFile.name}]` : ''}
  ${input.jobDescription}
  
  RESUME CONTENT:
  ${input.resumeFile ? `[Provided as Attachment: ${input.resumeFile.name}]` : ''}
  ${input.resumeContent}
  `;

  parts.push({ text: textPrompt });

  // Add image parts if provided
  if (input.jdFile?.base64) {
    parts.push({
      inlineData: {
        data: input.jdFile.base64.split(',')[1],
        mimeType: input.jdFile.type
      }
    });
  }
  if (input.resumeFile?.base64) {
    parts.push({
      inlineData: {
        data: input.resumeFile.base64.split(',')[1],
        mimeType: input.resumeFile.type
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: { type: Type.NUMBER, description: "Score from 1 to 10" },
          topSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ['High', 'Medium'] }
              },
              required: ["title", "description", "impact"]
            },
            description: "Exactly 3 top suggestions"
          },
          overallFeedback: { type: Type.STRING },
          revampedResumeDraft: { type: Type.STRING, description: "Full Markdown version" },
          keywordGap: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["matchScore", "topSuggestions", "overallFeedback", "revampedResumeDraft", "keywordGap"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("No response from AI service");
  
  return JSON.parse(resultText) as AnalysisResult;
};
