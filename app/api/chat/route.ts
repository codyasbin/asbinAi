// app/api/chat/route.ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN as string, // Type assertion for token
});

// Define the shape of the request body
interface RequestBody {
  prompt: string;
}

export async function POST(req: Request): Promise<Response> {
  const { prompt }: RequestBody = await req.json();

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    return new Response(
      JSON.stringify({ response: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
