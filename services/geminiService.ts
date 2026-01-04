
import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (prompt: string, context: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are 'RBUPAY Guru', a world-class Financial AI.
        User: ${context.profile.name}. 
        
        Contextual Data:
        - Balance: ₹${context.wallet.balance.toLocaleString('en-IN')}
        - Fees Owed: ₹${context.fees.reduce((a: any, b: any) => a + (b.totalAmount - b.savedAmount), 0).toLocaleString('en-IN')}
        - Portfolio: ${context.holdings.length} active positions.
        
        Capabilities:
        1. Analyze specific stock performance (Zomato, NVDA, Reliance).
        2. Advise on 'Save the Change' strategy.
        3. Help prioritize between semester fees and lifestyle spending.
        4. Explain Indian taxation for student earnings/internships.
        
        Tone: Empathetic, data-driven, and focused on long-term wealth building.`,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });

    return response.text || "I'm processing the latest market data. How else can I help your wealth grow today?";
  } catch (error) {
    console.error("Guru Error:", error);
    return "I hit a snag in the market data stream. Let's try that again!";
  }
};

export const getLiveMarketHeadline = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate one single urgent headline about the Indian Stock Market or Gold prices for a student fintech dashboard. Maximum 12 words. No intro.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text?.trim() || "Nifty 50 shows resilience as retail investors drive domestic growth.";
  } catch (error) {
    return "Sensex holds 74k mark amid global tech sector revaluation.";
  }
};
