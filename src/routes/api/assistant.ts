import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { createResponsesCall } from "@/lib/ai/responses.server";

const INSTRUCTIONS = `You are Campusly, a friendly multilingual university campus assistant. Reply in the user's language.
Help students, parents, faculty and administrators find services: attendance, timetable, fees, digital certificates, academic records, hostel, transport, and grievances.
The university's official records and documents are NOT connected yet. Never invent attendance figures, balances, notices, deadlines, names, or official policies. When asked for such data, say it isn't connected yet and suggest submitting a request from the matching service card. Keep answers short and warm.`;

export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Assistant unavailable", { status: 503 });
        const body = (await request.json()) as { messages?: UIMessage[] };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
        const call = createResponsesCall(
          request,
          { baseURL: "https://ai.gateway.lovable.dev", apiKey, model: "openai/gpt-6-astra" },
          await convertToModelMessages(messages),
          INSTRUCTIONS,
        );
        return call.response();
      },
    },
  },
});
