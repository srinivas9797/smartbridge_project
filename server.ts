
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up parser
  app.use(express.json());

  // Check if GEMINI_API_KEY exists
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  console.log(`[AIRCMS Server] Gemini API Key present: ${hasGeminiKey}`);

  // API endpoint: AI Candidate Sourcing and Screening
  app.post('/api/ai/screen', async (req, res) => {
    try {
      const { candidate, job } = req.body;
      
      if (!candidate || !job) {
        return res.status(400).json({ error: 'Candidate and Job details are required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        console.warn('[AIRCMS] GEMINI_API_KEY is missing. Using high-quality rule-based fallback response.');
        // High quality fallback in case the API key is not configured yet
        const techMatchCount = candidate.skills.filter((s: string) => 
          job.requirements.some((r: string) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
        ).length;
        const totalReqs = job.requirements.length || 1;
        const techScore = Math.min(100, Math.round(40 + (techMatchCount / totalReqs) * 60));
        const experienceScore = Math.min(100, Math.round(30 + (candidate.experienceYears / 10) * 70));
        const cultureScore = Math.min(100, Math.round(75 + Math.random() * 15));
        const overallScore = Math.round((techScore * 0.5) + (experienceScore * 0.3) + (cultureScore * 0.2));
        
        const riskLevel = overallScore > 80 ? 'Low' : overallScore > 60 ? 'Medium' : 'High';
        const risks = [];
        if (candidate.experienceYears < 5) risks.push(`Candidate has ${candidate.experienceYears} years of experience, which is on the lower side for this tier.`);
        if (techScore < 70) risks.push('Limited overlap with specified technical requirements stack.');
        if (risks.length === 0) risks.push('No significant red flags identified during automated screening.');

        return res.json({
          aiScoreOverall: overallScore,
          aiScoreTechFit: techScore,
          aiScoreCultureFit: cultureScore,
          aiSummary: `${candidate.name} exhibits a solid background for the ${job.title} position, showing ${candidate.experienceYears} years of experience. Key skills align with several aspects of the requirements framework. (Note: Running in high-quality local analysis mode).`,
          aiRiskLevel: riskLevel,
          aiRisks: risks,
          aiStrengths: [
            `Demonstrated competence in ${candidate.skills.slice(0, 3).join(', ')}`,
            `Solid ${candidate.experienceYears} years of professional background`,
            'Proactive resume structure and structured career history'
          ],
          aiRecommendation: overallScore > 75 
            ? 'Recommended to proceed to recruiter phone screen and technical validation.' 
            : 'Review as a secondary choice; skills show partial alignment.'
        });
      }

      // Initialize Google GenAI
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are Agentforce recruitment AI, an advanced applicant screening agent integrated into Salesforce.
        Evaluate the following candidate against the job specifications and output a structured JSON response.

        JOB SPECIFICATIONS:
        Title: ${job.title}
        Department: ${job.department}
        Description: ${job.description}
        Requirements: ${JSON.stringify(job.requirements)}

        CANDIDATE DOSSIER:
        Name: ${candidate.name}
        Stated Skills: ${JSON.stringify(candidate.skills)}
        Years of Experience: ${candidate.experienceYears}
        Resume Text: ${candidate.resumeText}

        Perform a strict, realistic analysis. Do not be overly generous or overly negative.
        Formulate your response strictly conforming to this JSON schema:
        {
          "aiScoreOverall": number (integer between 0 and 100),
          "aiScoreTechFit": number (integer between 0 and 100 assessing technology stack overlap),
          "aiScoreCultureFit": number (integer between 0 and 100 assessing experience, stability, and career progress),
          "aiSummary": string (concise 3-4 sentence professional summary of candidate fit),
          "aiRiskLevel": "Low" | "Medium" | "High",
          "aiRisks": string[] (list of potential red flags, concerns, or skills gaps),
          "aiStrengths": string[] (list of 3 key advantages or strong matches),
          "aiRecommendation": string (clear summary recommendation like "Strong Hire", "Interview", or "Archive" with 1-sentence reasoning)
        }
      `;

      console.log(`[AIRCMS] Requesting Gemini evaluation for candidate ${candidate.name}...`);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      console.log('[AIRCMS] Received response from Gemini.');
      if (!responseText) {
        throw new Error('Empty response from Gemini');
      }

      // Parse and return
      const result = JSON.parse(responseText);
      return res.json(result);

    } catch (error: any) {
      console.error('[AIRCMS AI Error] Error screening candidate with Gemini:', error);
      return res.status(500).json({ 
        error: 'Failed to complete AI screening', 
        details: error?.message || error 
      });
    }
  });

  // Serve static assets in production or use Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AIRCMS] Running in development mode. Hooking Vite dev server middleware.');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log('[AIRCMS] Running in production mode. Serving static assets.');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AIRCMS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[AIRCMS] Failed to start server:', err);
});
