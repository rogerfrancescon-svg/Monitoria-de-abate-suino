import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/analyze-batch", async (req, res) => {
    try {
      const { batchData, evaluations } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Analise os seguintes dados de uma avaliação de abate de suínos (monitoria de pneumonia e lesões pleurais) e forneça sugestões de ações corretivas e preventivas.
      
Dados do Lote:
- Granja: ${batchData.farm}
- Lote: ${batchData.batchId}
- Frigorífico: ${batchData.abattoir}
- Total Avaliados: ${evaluations.length} / ${batchData.totalAnimals}
- Data: ${new Date(batchData.date).toLocaleDateString('pt-BR')}

Métricas:
- Índice de Pneumonia (IP): ${batchData.avgIp}
- Área Afetada Média: ${batchData.avgAreaAffected}%
- Índice Médio (MADEC): ${batchData.avgScore}
- SPES Médio: ${batchData.avgSpes}
- APP Index (APPI): ${batchData.avgAppi}
- Prevalência de Pneumonia: ${batchData.prevPneumonia}%
- Prevalência de Cicatrizes: ${batchData.prevScar}%
- Prevalência de Pleurisia: ${batchData.prevPleurisy}%

Impacto Econômico:
- Perda de Ganho de Peso Diário (GPD): -${batchData.lossGramsPerDay} g/dia
- Piora na Conversão Alimentar (CA): +${batchData.lossFcrPercent}%

Por favor, retorne um texto formatado em Markdown com:
1. Uma breve interpretação geral do quadro respiratório e seu impacto econômico no lote.
2. 3 a 5 pontos com possíveis causas para os índices observados (baseados nas prevalências de pneumonia, pleurisia e cicatrizes).
3. 3 a 5 ações práticas (corretivas/preventivas) focadas em manejo, vacinação, medicação ou ambiência para a granja ${batchData.farm}.

Responda em português (pt-BR) de forma profissional, voltado para veterinários e produtores de suínos.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Erro na análise do Gemini:", error);
      res.status(500).json({ error: error.message || "Erro interno no servidor" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
