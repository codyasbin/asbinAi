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

    if (response.choices && response.choices[0]) {
      return new Response(
        JSON.stringify({ response: response.choices[0].message.content }),
        { status: 200 }
      );
    } else {
      console.error("Unexpected response format:", response);
      return new Response(
        JSON.stringify({ error: "Unexpected response format" }),
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error:", err);

    // Check if the error is an HTTP response that might contain non-JSON data
    if (err instanceof Response) {
      const errorBody = await err.text();
      console.error("Error response body:", errorBody);
    }

    // Return a generic error message
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again later." }),
      { status: 500 }
    );
  }
}
