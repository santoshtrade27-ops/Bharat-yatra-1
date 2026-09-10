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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Multi-tier resilient model pool with exponential backoff on transient errors (503, 429, UNAVAILABLE)
  const FALLBACK_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
  ];

  async function generateWithFallback(ai: GoogleGenAI, params: any) {
    let lastError: any = null;

    for (const modelName of FALLBACK_MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await ai.models.generateContent({
            model: modelName,
            ...params,
          });
        } catch (err: any) {
          lastError = err;
          const errMsg = String(err?.message || err || "");
          const isTransient =
            errMsg.includes("503") ||
            errMsg.includes("high demand") ||
            errMsg.includes("UNAVAILABLE") ||
            errMsg.includes("RESOURCE_EXHAUSTED") ||
            errMsg.includes("429") ||
            errMsg.includes("overloaded");

          if (isTransient) {
            await sleep(400 * (attempt + 1));
            continue;
          }

          if (errMsg.includes("NOT_FOUND") || errMsg.includes("404")) {
            break;
          }

          throw err;
        }
      }
    }

    throw lastError || new Error("AI models temporarily at maximum capacity");
  }

  // Curated heritage itinerary builder for seamless fallback during AI demand spikes
  function getCuratedItineraryFallback(to: string, days: number, food: string, hotelName?: string) {
    const dayTemplates = [
      {
        title: `Arrival & Grand Heritage Landmarks of ${to}`,
        desc: `Arrive and settle in. Spend the morning visiting the premier historic monuments, ancient architectural wonders, or iconic temple spires of ${to}. Enjoy traditional lunch featuring authentic ${food} regional specialties, followed by an evening heritage stroll.`,
      },
      {
        title: `Living Traditions, Artisan Looms & Bazaars`,
        desc: `Explore the vibrant craft quarters, traditional handloom bazaars, and spice markets of ${to}. Meet skilled artisans preserving generations-old handcrafts and taste celebrated street cuisine.`,
      },
      {
        title: `Spiritual Sanctuaries, Sacred Ghats & Rituals`,
        desc: `Experience peaceful dawn chants or sacred water ceremonies in ${to}. Walk through heritage corridors and tranquil gardens before enjoying classical music or folk dance at dusk.`,
      },
      {
        title: `Museums, Palatial Courtyards & Cultural Arts`,
        desc: `Delve into regional history at the premier cultural museums and royal galleries of ${to}. Discover rare coin collections, miniature paintings, and bronze sculptures with authentic high tea.`,
      },
      {
        title: `Scenic Escapes, Nature & Heritage Trails`,
        desc: `Embark on a scenic excursion to panoramic viewpoints, lakes, or ancient rock-cut cave formations in the ${to} region. Catch a serene sunset over the surrounding hills.`,
      },
      {
        title: `Culinary Masterclass & Craft Villages`,
        desc: `Visit neighboring heritage craft villages renowned for pottery, weaving, or bronze casting. Savor a regional tasting banquet honoring traditional ${food} culinary heritage.`,
      },
      {
        title: `Farewell Souvenir Trail & Evening Aarti`,
        desc: `Procure authentic GI-tagged handicrafts, aromatic spices, and regional handlooms. Conclude your journey with an auspicious evening lamp lighting ceremony and farewell feast in ${to}.`,
      },
    ];

    const count = Math.max(1, Math.min(days || 3, 14));
    const itinerary = [];
    for (let i = 1; i <= count; i++) {
      const template = dayTemplates[(i - 1) % dayTemplates.length];
      itinerary.push({
        day: i,
        title: `Day ${i}: ${template.title}`,
        desc: `${template.desc}${hotelName ? ` Convenient base: ${hotelName}.` : ""}`,
      });
    }

    return {
      itinerary,
      summary: `Authentic ${count}-day cultural voyage through the living architecture, sacred arts, and heritage flavors of ${to}.`,
    };
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
    } catch {
      return res.json({
        response:
          "Namaste! 🙏 Our AI guide servers are experiencing temporary high demand right now. You can explore curated heritage destination guides, verified hotels, and local transport options directly across Bharat Yatra, or try asking your question again in just a moment!",
      });
    }
  });

  // Dedicated AI Itinerary Planner endpoint
  app.post("/api/ai/planner", async (req: Request, res: Response) => {
    const {
      days = 3,
      to = "Rajasthan",
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
      return res.json(getCuratedItineraryFallback(to, days, food, hotelName));
    }

    try {
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
      if (parsed.itinerary && Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0) {
        return res.json(parsed);
      }
      return res.json(getCuratedItineraryFallback(to, days, food, hotelName));
    } catch {
      return res.json(getCuratedItineraryFallback(to, days, food, hotelName));
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
      odia: "or", or: "or", od: "or",
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
      } catch {
        // Silently proceed to universal translation engine
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
          or: "Spoken in Odisha. Respectful greetings used at Puri Jagannath Temple & Konark.",
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

  // Emergency SOS Prompt Assistant Endpoint
  app.post("/api/ai/sos-prompt", async (req: Request, res: Response) => {
    try {
      const { emergencyPrompt, userLocation, travelerName } = req.body;
      const promptText = emergencyPrompt || "Traveler in distress at unknown location in India.";
      const locText = userLocation || "Indian Tourist Circuit";
      const nameText = travelerName || "Traveler";

      const ai = getAI();
      if (ai) {
        const systemPrompt = `You are the Emergency Response AI for Bharat Yatra tourist safety network.
Analyze the user's emergency distress prompt and location. Return a JSON object with:
- "emergencyCategory": (e.g. "Medical Emergency", "Tourist Police Assistance", "Stranded / Wilderness Rescue", "Accident / Collision", "Harassment / Safety Threat", "Cyber / Financial Fraud")
- "urgencyLevel": "CRITICAL" or "HIGH" or "MODERATE"
- "primaryHelpline": {"number": "112" or "108" or "1363" or "1091" or "1033", "name": "National Emergency 112 / Ambulance 108 / Tourist Police 1363", "action": "Call immediately"}
- "localLanguageAlert": {"language": "Hindi / Telugu / Tamil / Bengali based on location", "phrase": "Distress statement in local script", "pronunciation": "Romanized clear pronunciation", "english": "Exact English meaning"}
- "actionProtocol": Array of 3-4 immediate survival/safety steps the user should do right now
- "dispatchMessage": A concise text summary ready for police and WhatsApp first responders including location
Return ONLY clean JSON without markdown ticks.`;

        const response = await generateWithFallback(ai, {
          contents: `Location: ${locText}\nTraveler: ${nameText}\nEmergency Situation: ${promptText}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
          },
        });

        try {
          const json = JSON.parse(response.text || "{}");
          return res.json(json);
        } catch {
          // fallback to standard json
        }
      }

      // Intelligent Offline Fallback
      const isMedical = /pain|chest|bleed|unconscious|faint|fracture|breath|hospital|doctor|ambulance/i.test(promptText);
      const isPolice = /threat|harass|stalk|attack|theft|robbery|scam|stolen|cheat|fight|police/i.test(promptText);
      const isLost = /lost|forest|night|stuck|stranded|mountain|cave|alone|battery/i.test(promptText);

      let helpline = { number: "112", name: "National Emergency 112", action: "Dial 112 for immediate unified police and medical dispatch" };
      let cat = "General Tourist Safety SOS";
      let localAlert = {
        language: "Hindi / Telugu",
        phrase: "कृपया मेरी मदद करें, यह एक आपातकाल है!",
        pronunciation: "Kripya meri madad karein, yeh ek aapaatkaal hai!",
        english: "Please help me, this is an emergency!",
      };

      if (isMedical) {
        cat = "Medical Emergency";
        helpline = { number: "108", name: "Ambulance & Trauma 108", action: "Dial 108 for free Advanced Life Support emergency ambulance" };
        localAlert = {
          language: "Hindi",
          phrase: "कृपया तुरंत एम्बुलेंस को कॉल करें, आपातकालीन चिकित्सा स्थिति है!",
          pronunciation: "Kripya turant ambulance ko call karein, aapatkaleen chikitsa sthiti hai!",
          english: "Please call an ambulance immediately, medical emergency!",
        };
      } else if (isPolice) {
        cat = "Tourist Police & Safety";
        helpline = { number: "1363", name: "Tourist Police 1363", action: "Dial 1363 for multilingual Ministry of Tourism police aid or 112" };
        localAlert = {
          language: "Hindi",
          phrase: "पुलिस को बुलाइए, मुझे सुरक्षा की आवश्यकता है!",
          pronunciation: "Police ko bulaiye, mujhe suraksha ki aavashyakta hai!",
          english: "Call the police, I need safety and protection!",
        };
      } else if (isLost) {
        cat = "Stranded / Wilderness Assistance";
        helpline = { number: "112", name: "National Emergency 112", action: "Dial 112 to broadcast nearest police patrol and Forest Guard unit" };
      }

      return res.json({
        emergencyCategory: cat,
        urgencyLevel: isMedical || isPolice ? "CRITICAL" : "HIGH",
        primaryHelpline: helpline,
        localLanguageAlert: localAlert,
        actionProtocol: [
          "Stay in a visible, well-lit or safe sheltered spot and preserve battery.",
          "Keep your GPS location enabled and share live tracking with your emergency contact.",
          "Show the translated audio/text distress phrase to trustworthy local staff, shopkeeper, or station master.",
          "Call the highlighted hotline (112/108/1363) without hesitation.",
        ],
        dispatchMessage: `🚨 EMERGENCY SOS: ${cat} reported by ${nameText} at ${locText}. Situation: ${promptText}. Urgent responder assistance requested.`,
      });
    } catch (err: any) {
      console.error("[SOS Prompt Endpoint Error]:", err);
      return res.status(500).json({ error: "Failed to process emergency prompt" });
    }
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
    } catch {
      if (req.body.response_json_schema) {
        return res.json({
          status: "fallback",
          message: "AI services are currently handling high traffic. Please retry in a moment.",
        });
      }
      return res.send("Our AI travel guide service is currently handling high volume. Please retry in a moment.");
    }
  });

  // Dedicated AI Image & Visual Travel Journal Generator endpoint
  app.post("/api/ai/generate-image", async (req: Request, res: Response) => {
    const {
      title = "Indian Heritage Site",
      category = "Heritage Site",
      state = "India",
      prompt = "",
      style = "photorealistic",
    } = req.body;

    const ai = getAI();
    let generatedImageUrl = "";
    let captionText = "";

    // 1. Try generating with Gemini image model if AI client is available
    if (ai) {
      try {
        const imagePrompt = `Authentic visual of ${title} in ${state}, India. Category: ${category}. ${
          prompt ? `Notes: ${prompt}. ` : ""
        }Artistic style: ${
          style === "miniature"
            ? "Traditional Rajasthani/Mughal miniature painting with intricate gold floral borders"
            : style === "architectural"
            ? "Detailed architectural blueprint and sepia lithograph sketch"
            : "Photorealistic 8k golden hour photography, ancient stone textures, authentic cultural lighting"
        }. Highly detailed, culturally respectful, no modern text or watermarks.`;

        const imageRes: any = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: imagePrompt }],
          },
        });

        if (imageRes?.candidates?.[0]?.content?.parts) {
          for (const part of imageRes.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              generatedImageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch {
        // Fall back gracefully to curated high-resolution cultural visual
      }

      // Generate a rich cultural caption using Gemini text model
      try {
        const captionRes = await generateWithFallback(ai, {
          contents: `Write an evocative, authentic 2-sentence cultural travel journal caption for "${title}" (${category} from ${state}, India). Highlight its historic craftsmanship, architectural style, or artisan legacy. Avoid raw markdown stars or asterisks.`,
          config: {
            systemInstruction:
              "You are the chief archivist for Bharat Yatra's living cultural journal. Write poetic, factual, and inspiring descriptions.",
          },
        });
        captionText = (captionRes.text || "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .trim();
      } catch {
        // Handled below
      }
    }

    // 2. Curated visual library fallback if Gemini image is unavailable
    const fallbackVisuals: Record<string, { image: string; caption: string; state: string }> = {
      hampi: {
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Carved from granite blocks disguised as monolithic stone, this shrine dedicated to Garuda in Vittala Temple embodies the pinnacle of 16th-century Vijayanagara architectural genius.",
        state: "Karnataka",
      },
      konark: {
        image: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Conceived as a colossal stone chariot of Surya with 24 carved wheels that function as precise sundials calibrated to track cosmic solar cycles across the Bay of Bengal.",
        state: "Odisha",
      },
      meenakshi: {
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Towering 14 multi-tiered gopurams encrusted with thousands of stucco figures depicting celestial legends, rising above the ancient temple city along the sacred Vaigai river.",
        state: "Tamil Nadu",
      },
      taj: {
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80",
        caption:
          "A symphony in Makrana white marble inlaid with semi-precious lapis lazuli and carnelian using delicate Pietra Dura parchin kari artistry along the Yamuna terrace.",
        state: "Uttar Pradesh",
      },
      jaipur: {
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Perched atop the rugged Aravalli crest, the historic royal palaces showcase delicate Belgian mirror inlays, Persian water systems, and timeless Rajput craftsmanship.",
        state: "Rajasthan",
      },
      madhubani: {
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Centuries-old Mithila folk painting rendered using natural rice paste, turmeric, and indigo dyes, characterized by dense geometric line-work and sacred cosmic motifs.",
        state: "Bihar",
      },
      pashmina: {
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Spun from raw 12-micron Changthangi mountain goat fleece and adorned with microscopic Sozni needlework that takes Kashmiri master artisans several months to complete.",
        state: "Jammu & Kashmir",
      },
      "blue pottery": {
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1000&auto=format&fit=crop&q=80",
        caption:
          "One of the few ceramic traditions created entirely without clay, using quartz stone powder glazed with vibrant Egyptian turquoise and copper oxide motifs.",
        state: "Rajasthan",
      },
      bidriware: {
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80",
        caption:
          "Dramatic Damascene metalcraft where pure sterling silver wire is inlaid into blackened zinc alloy, oxidized using historic mineral soil from the 14th-century Bidar Fort.",
        state: "Karnataka",
      },
      varanasi: {
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80",
        caption:
          "A continuous sacred riverfront amphitheater along the holy Ganga where dawn Vedic chants, temple bells, and floating camphor lamps illuminate millennia of living spiritual heritage.",
        state: "Uttar Pradesh",
      },
    };

    const queryKey = (title + " " + prompt + " " + state).toLowerCase();
    let matchedVisual: any = null;
    for (const [key, item] of Object.entries(fallbackVisuals)) {
      if (queryKey.includes(key)) {
        matchedVisual = item;
        break;
      }
    }

    if (!matchedVisual) {
      matchedVisual =
        category === "Local Craft"
          ? fallbackVisuals["madhubani"]
          : fallbackVisuals["hampi"];
    }

    const finalImage = generatedImageUrl || matchedVisual.image;
    const finalCaption = captionText || matchedVisual.caption;

    return res.json({
      success: true,
      id: "jrn-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
      title: title || (category === "Local Craft" ? "Artisan Heritage Craft" : "Indian Heritage Monument"),
      category: category || "Heritage Site",
      state: state || matchedVisual.state,
      imageUrl: finalImage,
      caption: finalCaption,
      style: style || "Photorealistic Heritage",
      prompt: prompt || "",
      isAiGenerated: Boolean(generatedImageUrl),
      createdAt: new Date().toISOString(),
    });
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
