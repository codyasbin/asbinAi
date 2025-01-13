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

    // Since the response is text, we return it directly
    const responseText = response.choices && response.choices[0]
      ? response.choices[0].message.content
      : "No valid response from the model";

    return new Response(
      JSON.stringify({ response: responseText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);

    // Handle error properly and log response body if it's an HTTP response
    if (err instanceof Response) {
      const errorBody = await err.text();
      console.error("Error response body:", errorBody);

      // Return error message in JSON format
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again later." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Handle unexpected errors (network issues, OpenAI SDK errors)
      console.error("Caught error:", err);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again later." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
