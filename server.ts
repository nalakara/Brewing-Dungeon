import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Check if server-side key is available
  app.get('/api/config', (req, res) => {
    const hasServerKey = Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY);
    res.json({ hasServerKey });
  });

  // Secure AI brewing recommendation proxy endpoint
  app.post('/api/recommend', async (req, res) => {
    try {
      const {
        coffeeAmount,
        waterAmount,
        grindSize,
        methodName,
        language = 'en',
        ratio,
        intensity = 'Medium',
        championStyleName = 'Standard Method',
        userApiKey,
      } = req.body;

      // Priority: user-provided BYOK key -> server environment key
      const activeApiKey = (typeof userApiKey === 'string' && userApiKey.trim())
        ? userApiKey.trim()
        : (process.env.GEMINI_API_KEY || process.env.API_KEY);

      if (!activeApiKey) {
        const errorMsg = language === 'id'
          ? 'Kunci API Gemini tidak ditemukan. Harap masukkan API Key Anda sendiri pada menu Pengaturan (BYOK) atau atur GEMINI_API_KEY di server.'
          : 'Gemini API key is missing. Please provide your own API key in the BYOK settings or set GEMINI_API_KEY on the server.';
        return res.status(400).json({ error: errorMsg, code: 'MISSING_API_KEY' });
      }

      const langForPrompt = language === 'en' ? 'English' : 'Bahasa Indonesia';

      const prompt = `
    You are a world-class barista and coffee brewing expert.
    A user wants to brew coffee.
    Their parameters are:
    - Method: ${methodName}
    - Coffee: ${coffeeAmount}g
    - Water: ${waterAmount}ml
    - Grind: ${grindSize}
    - Desired Ratio: ${ratio}
    - Desired Intensity: ${intensity}
    - Selected Champion Style: ${championStyleName} for ${methodName} method
    - Language for response: ${langForPrompt}

    Based on these inputs, generate a detailed, step-by-step brewing guide.
    
    CRITICAL: You MUST tailor the brewing guide to reflect the core principles of the selected Champion Style for the specific method.

    **For Pour-Over Methods (V60, Kalita, Chemex):**
    - If the style is Tetsu Kasuya's 4:6, the guide's pouring structure MUST be split into a 40% and 60% water distribution to control sweetness/acidity and strength.
    - If the style is James Hoffmann's, it MUST feature a bloom, a gentle swirl (excavation), followed by a single, slow, continuous pour, aiming for a flat bed at the end without a final spin. For Chemex, adapt this for a larger batch size.
    - If the style is Scott Rao's, incorporate his principles like a level bed before brewing, a bloom, a main pour, and the "Rao Spin" at the end to flatten the bed and increase extraction.
    - If the style is Tim Wendelboe's, the recipe should be very simple and clean, often with a bloom and a single continuous pour. The focus is on a fast drawdown to produce a light, clear, tea-like cup.
    - If the style is Patrik Rolf's (April Method), it should be a simple, repeatable recipe, typically a bloom followed by two or three main pours, designed for consistency and clarity.
    - If the style is Jonathan Gagné's (Physics-based), the method should incorporate scientific principles, potentially a longer bloom (e.g., up to 2 minutes for osmotic flow) and techniques that aim for extremely high, even extraction.
    - If the style is Ryan Wibawa's (Champion's Flow), the pouring structure should be more complex, likely involving multiple pulses (e.g., 4-5 pours after the bloom) with controlled agitation to manipulate extraction throughout the brew.

    **For AeroPress:**
    - If 'WAC Standard (Bypass)' is chosen, the recipe MUST use the standard (non-inverted) orientation. It should produce a concentrate that is then diluted with extra water (bypass). Mention the dilution step clearly.
    - If 'WAC Inverted (Immersion)' is chosen, the recipe MUST use the inverted method. This allows for a full immersion steep before pressing, typically for a longer duration.
    - If 'Low-Temp Clarity' is chosen, the recipe MUST use a lower water temperature (e.g., 80-85°C) and likely a finer grind to extract sweetness without bitterness.

    **For French Press:**
    - If 'James Hoffmann (Clean Cup)' is chosen, the guide MUST follow his specific technique: 1. Steep for 4 minutes. 2. Break the top crust gently. 3. Scoop off foam/grounds. 4. Wait an additional 5-8 minutes for fines to settle. 5. Press the plunger ONLY to the surface of the coffee, not all the way down.

    **For Espresso:**
    - If 'WDT Preparation' is chosen, the guide MUST include a step explaining how to use a Weiss Distribution Tool (WDT) to break up clumps and evenly distribute the grounds in the portafilter before tamping. Emphasize that this reduces channeling.
    - If 'Puck Screen (Paper Filter)' is chosen, the guide MUST include a step to place a paper filter on top of the tamped coffee puck before locking in the portafilter. Explain that this improves water distribution.
    - If 'Modern Pressure Profile' is chosen, describe a hypothetical shot that uses pressure profiling. For example: "1. Start with a low-pressure pre-infusion (e.g., 3 bars for 8 seconds) to saturate the puck. 2. Ramp up to 9 bars for the main extraction. 3. As the shot blondes, ramp pressure down to 6 bars to reduce bitterness at the end of the shot."

    - If 'Standard Method' or 'Standard Shot' is chosen, provide a solid, commonly accepted, balanced recipe for the selected brewing method.
    
    Also consider the desired intensity of '${intensity}'. A 'Strong' intensity might suggest a slightly finer grind, longer brew time, or higher water temperature compared to a 'Light' brew, while still adhering to the core principles of the selected Champion Style and ${methodName} method.
    
    Provide the final calculated coffee-to-water ratio.
    Suggest optimal brewing time and water temperature. The temperature must be a realistic value for coffee brewing in Celsius (e.g., "92°C - 96°C"), and should not exceed 100°C.
    Explain the key principles for this specific brew, highlighting how they relate to the chosen Champion Style, in a short, easy-to-understand paragraph.
    Additionally, provide concise explanations for the key chemical reactions (e.g., extraction of different compounds) and physical principles (e.g., how grind size affects flow rate) relevant to this specific brew.

    Return ONLY the JSON object.
  `;

      const ai = new GoogleGenAI({ apiKey: activeApiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ratio: {
                type: Type.STRING,
                description: "The coffee to water ratio, e.g., '1:15'",
              },
              optimal_temperature: {
                type: Type.STRING,
                description: "The optimal water temperature in Celsius, e.g., '92°C - 96°C'. Must be a realistic value between 80°C and 100°C.",
              },
              optimal_time: {
                type: Type.STRING,
                description: "The optimal brewing time, e.g., '2:30 - 3:00'",
              },
              guide: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A step-by-step guide for brewing.",
              },
              key_principles: {
                type: Type.STRING,
                description: "A short paragraph on key principles for this brew.",
              },
              chemical_reactions: {
                type: Type.STRING,
                description: "A short paragraph on the chemical reactions involved in this brew."
              },
              physical_principles: {
                type: Type.STRING,
                description: "A short paragraph on the physical principles at play in this brew."
              }
            },
            required: ["ratio", "optimal_temperature", "optimal_time", "guide", "key_principles", "chemical_reactions", "physical_principles"],
          },
        },
      });

      const jsonString = response.text ? response.text.trim() : '';
      if (!jsonString) {
        return res.status(502).json({
          error: language === 'id'
            ? 'AI tidak memberikan respons. Silakan sesuaikan parameter dan coba lagi.'
            : 'The AI returned an empty response. Please adjust parameters and try again.'
        });
      }

      const result = JSON.parse(jsonString);

      // Post-process to fix any unrealistic temperature values
      if (result.optimal_temperature) {
        let correctedTemp = result.optimal_temperature;
        const numbers = correctedTemp.match(/\d+/g);
        if (numbers) {
          for (const numStr of numbers) {
            const num = parseInt(numStr, 10);
            if (num > 110) {
              const correctedNum = Math.floor(num / 10);
              correctedTemp = correctedTemp.replace(numStr, String(correctedNum));
            }
          }
        }
        correctedTemp = correctedTemp.replace(/C/gi, '°C').replace(/°°C/g, '°C');
        result.optimal_temperature = correctedTemp;
      }

      return res.json({ success: true, data: result });
    } catch (err: any) {
      console.error('Server error generating recommendation:', err);
      let clientMessage = err.message || 'Internal Server Error';
      
      // Provide clearer messages for common API issues
      if (err.status === 400 || err.message?.includes('API_KEY_INVALID') || err.message?.includes('API key not valid')) {
        clientMessage = req.body?.language === 'id'
          ? 'Kunci API Gemini tidak valid. Silakan periksa kembali API Key Anda.'
          : 'Invalid Gemini API key. Please verify your API key in settings.';
      } else if (err.status === 429 || err.message?.includes('RESOURCE_EXHAUSTED')) {
        clientMessage = req.body?.language === 'id'
          ? 'Batas kuota Gemini API tercapai. Harap tunggu beberapa saat atau gunakan API Key Anda sendiri.'
          : 'Gemini API quota exceeded. Please wait a moment or use your own API key.';
      }

      return res.status(err.status || 500).json({ error: clientMessage });
    }
  });

  // Setup Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brewing Dungeon server running on port ${PORT}`);
  });
}

startServer();
