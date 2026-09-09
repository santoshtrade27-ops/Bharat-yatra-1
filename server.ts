import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Lazy initialize Gemini client using process.env.GEMINI_API_KEY
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Resilient model invocation with fallback to gemini-3.1-flash-lite if primary is busy
  async function generateWithFallback(ai: GoogleGenAI, params: any) {
    try {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        ...params,
      });
    } catch (err: any) {
      const errMsg = String(err?.message || "");
      if (
        errMsg.includes("503") ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("RESOURCE_EXHAUSTED")
      ) {
        console.warn("[Gemini API] Switching to gemini-3.1-flash-lite fallback...");
        return await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          ...params,
        });
      }
      throw err;
    }
  }

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      model: "gemini-3.8-flash",
    });
  });

  // Dedicated AI Assistant endpoint
  app.post("/api/ai/assistant", async (req: Request, res: Response) => {
    try {
      const { prompt, messages } = req.body;
      const ai = getAI();
      if (!ai) {
        return res.json({
          response:
            "Namaste! 🙏 I am your Bharat Yatra Heritage Assistant powered by Google Gemini. Please ensure your GEMINI_API_KEY is configured in AI Studio Secrets to unlock full live guidance across India's living monuments, arts, and cuisines.",
        });
      }

      let contents: any = prompt;
      if (Array.isArray(messages) && messages.length > 0) {
        contents = messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.text || m.content || "" }],
        }));
        if (prompt) {
          contents.push({ role: "user", parts: [{ text: prompt }] });
        }
      }

      const response = await generateWithFallback(ai, {
        contents,
        config: {
          systemInstruction:
            "You are the official Bharat Yatra AI Guide. You explain everything simply, clearly, and warmly — exactly as if speaking to a 10-year-old child! " +
            "Rules to follow strictly:\n" +
            "1. Use simple, friendly words, short sentences, and proper punctuation.\n" +
            "2. Do NOT output messy asterisks or raw markdown stars (like **bold** or *stars*). Write clean, plain text with comfortable paragraph spacing.\n" +
            "3. If listing items, use neat numbered points (1., 2., 3.) or simple bullet hyphens (- ).\n" +
            "4. Keep it engaging, fun, and fast to read (under 120 words).",
        },
      });

      let cleanText = response.text || "";
      // Strip any raw markdown asterisks or stars that make the text look messy
      cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

      return res.json({ response: cleanText });
    } catch (error: any) {
      console.error("[Gemini Assistant Error]:", error);
      return res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // Dedicated AI Itinerary Planner endpoint
  app.post("/api/ai/planner", async (req: Request, res: Response) => {
    try {
      const {
        days = 3,
        to,
        from,
        group = "solo",
        food = "all",
        budget = "moderate",
        transport = "cab",
        withGuide = false,
        hotelName,
        hotelLocation,
      } = req.body;

      const ai = getAI();
      if (!ai) {
        return res.status(400).json({ error: "GEMINI_API_KEY not configured", fallback: true });
      }

      const promptText = `You are the lead cultural travel planning expert for Bharat Yatra.
Create an authentic ${days}-day cultural and heritage itinerary for a ${group} traveler visiting ${to}${
        from ? ` starting from ${from}` : ""
      }.
Destination city: ${to}
Selected Hotel Stay: ${hotelName ? `${hotelName} (${hotelLocation || to})` : `Verified heritage hotel in ${to}`}
Food style & diet: ${food}
Budget: ₹${budget}
Transport: ${transport}
${withGuide ? "With dedicated certified local guide." : ""}

CRITICAL GEOGRAPHIC RULES:
1. All monument visits, dining spots, artisan bazaars, and activities on Days 1 through ${days} MUST BE STRICTLY located in or immediately around the destination city: ${to}.
2. Do NOT suggest visiting or staying in hotels in the departure city (${from}) once they reach ${to}. For example, if traveling from Delhi to Visakhapatnam, all hotels and attractions (Kailasagiri, Submarine Museum, Rushikonda, Borra Caves, Simhachalam) must be in Visakhapatnam/Andhra Pradesh.
3. Include real local culinary specialties matching ${food} in ${to}.
4. Return exactly ${days} days with engaging title and descriptive recommendations.`;

      const response = await generateWithFallback(ai, {
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              itinerary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    desc: { type: Type.STRING },
                  },
                  required: ["title", "desc"],
                },
              },
              summary: { type: Type.STRING },
            },
            required: ["itinerary"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (error: any) {
      console.error("[Gemini Planner Error]:", error);
      return res.status(500).json({ error: error.message || "Failed to plan trip" });
    }
  });

  // Dedicated Translation endpoint with dual engine (Gemini AI + Free Universal Fallback)
  app.post("/api/ai/translate", async (req: Request, res: Response) => {
    const { text, targetLang = "Hindi", sourceLang = "English" } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const langCodeMap: Record<string, string> = {
      hindi: "hi", hi: "hi",
      telugu: "te", te: "te",
      tamil: "ta", ta: "ta",
      bengali: "bn", bn: "bn",
      marathi: "mr", mr: "mr",
      gujarati: "gu", gu: "gu",
      kannada: "kn", kn: "kn",
      malayalam: "ml", ml: "ml",
      punjabi: "pa", pa: "pa",
      english: "en", en: "en",
    };

    const targetKey = targetLang.toLowerCase().trim();
    const targetCode = langCodeMap[targetKey] || "hi";

    // 1. Try Gemini first if API key is present
    const ai = getAI();
    if (ai) {
      try {
        const response = await generateWithFallback(ai, {
          contents: `Translate the following phrase from ${sourceLang} into ${targetLang}.
Text: "${text}"
Respond with JSON matching the schema. Provide authentic native script translation, Latin pronunciation guide, and cultural usage tip.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                translatedText: { type: Type.STRING, description: "Translation in the target language native script" },
                pronunciation: { type: Type.STRING, description: "Phonetic pronunciation guide in Latin script" },
                culturalNote: { type: Type.STRING, description: "Brief polite etiquette tip on using this in India" },
              },
              required: ["translatedText"],
            },
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        if (parsed.translatedText) {
          return res.json({
            translatedText: parsed.translatedText,
            pronunciation: parsed.pronunciation || "",
            culturalNote: parsed.culturalNote || `Commonly spoken in ${targetLang} regions`,
            engine: "gemini-pro",
          });
        }
      } catch (geminiErr: any) {
        console.warn("[Gemini Translate Warn, falling back to public engine]:", geminiErr?.message || geminiErr);
      }
    }

    // 2. Resilient Universal Translation Fallback
    try {
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;
      const gtxRes = await fetch(gtxUrl);
      if (gtxRes.ok) {
        const gtxData: any = await gtxRes.json();
        let translatedText = "";
        let romanized = "";

        if (Array.isArray(gtxData[0])) {
          translatedText = gtxData[0].map((chunk: any) => chunk[0]).filter(Boolean).join(" ");
          // Romanization is often in index 1 of chunk or last item
          const lastChunk = gtxData[0][gtxData[0].length - 1];
          if (lastChunk && typeof lastChunk[2] === "string") {
            romanized = lastChunk[2];
          } else if (lastChunk && typeof lastChunk[3] === "string") {
            romanized = lastChunk[3];
          }
        }

        const culturalNotesMap: Record<string, string> = {
          hi: "Used across North & Central India. Speak politely with 'Aap' for elders.",
          te: "Prominently spoken in Andhra Pradesh & Telangana. Add 'Garu' as a polite suffix.",
          ta: "Spoken across Tamil Nadu with ancient classical heritage. Fold hands with 'Vanakkam'.",
          bn: "Spoken in West Bengal. Use 'Nomoshkar' as standard respectful greeting.",
          mr: "Spoken in Maharashtra. Use 'Namaskar' and polite tone in temples and bazaars.",
          gu: "Spoken in Gujarat. Famous for warm hospitability and business courtesy.",
          kn: "Spoken across Karnataka. Use 'Namaskara' with a pleasant smile.",
          ml: "Spoken across Kerala. Highly appreciated by locals when greetings are in Malayalam.",
          pa: "Spoken in Punjab. Greet with 'Sat Sri Akal' at gurdwaras and heritage monuments.",
        };

        return res.json({
          translatedText: translatedText || text,
          pronunciation: romanized || "Pronounce clearly at moderate pace",
          culturalNote: culturalNotesMap[targetCode] || "Universal polite greeting suitable for travelers",
          engine: "universal-gtx",
        });
      }
    } catch (fallbackErr: any) {
      console.error("[Translation Fallback Error]:", fallbackErr);
    }

    // 3. Final safe response
    return res.json({
      translatedText: text,
      pronunciation: text,
      culturalNote: "Offline phrasebook ready",
      engine: "offline-echo",
    });
  });

  // Universal Invoke endpoint for seamless base44.integrations.Core.InvokeLLM replacement
  app.post("/api/ai/invoke", async (req: Request, res: Response) => {
    try {
      const { prompt, response_json_schema } = req.body;
      const ai = getAI();
      if (!ai) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured.",
          message: "Please ensure GEMINI_API_KEY is set in Settings > Secrets.",
        });
      }

      const config: any = {
        systemInstruction:
          "You are the Bharat Yatra cultural intelligence assistant powered by Google Gemini. Provide rich, accurate, and culturally nuanced answers regarding Indian travel, monuments, languages, crafts, and food.",
      };

      if (response_json_schema) {
        config.responseMimeType = "application/json";
      }

      const response = await generateWithFallback(ai, {
        contents: prompt,
        config,
      });

      const text = response.text || "";
      if (response_json_schema) {
        try {
          const json = JSON.parse(text);
          return res.json(json);
        } catch {
          return res.send(text);
        }
      }

      return res.send(text);
    } catch (error: any) {
      console.error("[Gemini Invoke Error]:", error);
      return res.status(500).json({ error: error.message || "AI invocation failed" });
    }
  });

  // Vite middleware in dev; static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express 5 wildcard route syntax
    app.get("*all", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bharat Yatra server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
