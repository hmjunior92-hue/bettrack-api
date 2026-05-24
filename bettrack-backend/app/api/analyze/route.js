import Anthropic from "@anthropic-ai/sdk";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { images } = await request.json();

    if (!images || !images.length) {
      return new Response(JSON.stringify({ error: "No images provided" }), {
        status: 400,
        headers: cors,
      });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const results = [];

    for (const img of images) {
      try {
        const base64 = img.data.includes(",")
          ? img.data.split(",")[1]
          : img.data;
        const mediaType = img.mediaType || "image/jpeg";

        const message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: mediaType, data: base64 },
                },
                {
                  type: "text",
                  text: `Analise este print de aposta esportiva e retorne SOMENTE um JSON válido, sem markdown.

Formato:
{"game":"time A x time B","market":"mercado ex: Mais de 2.5","odd":1.00,"stake":0.00,"result":"win","date":"YYYY-MM-DD","house":"casa de aposta","sport":"esporte"}

Regras:
- result: win=ganhou/verde, loss=perdeu/vermelho, pending=aberta
- stake: valor apostado em reais
- odd: cotação numérica
- RETORNE APENAS O JSON`,
                },
              ],
            },
          ],
        });

        const text = message.content.map((c) => c.text || "").join("");
        const match = text.match(/\{[\s\S]*?\}/);
        if (!match) throw new Error("JSON not found");
        const data = JSON.parse(match[0]);
        results.push({ ok: true, data, idx: img.idx });
      } catch (e) {
        results.push({ ok: false, error: e.message, idx: img.idx });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: cors,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: cors,
    });
  }
}
