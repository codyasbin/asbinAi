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

    // The response from the model is plain text, so return it directly
    const textResponse = response as string; // Cast response to string

    return new Response(textResponse, { status: 200 });
  } catch (err) {
    console.error("Error:", err);

    // Return a plain error message if an error occurs
    return new Response("Something went wrong. Please try again later.", { status: 500 });
  }
}
