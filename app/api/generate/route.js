import { z } from "zod";

const WorkoutSchema = z.object({
  program_name: z.string(),
  weeks: z.array(
    z.object({
      week_number: z.number(),
      days: z.array(
        z.object({
          day_number: z.number(),
          title: z.string(),
          exercises: z.array(
            z.object({
              name: z.string(),
              sets: z.number(),
              reps: z.string(),
              rest: z.string(),
              notes: z.string().optional(),
            })
          ),
        })
      ),
    })
  ),
});

const WORKOUT_JSON_EXAMPLE = `
{
  "program_name": "string",
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "title": "string",
          "exercises": [
            {
              "name": "string",
              "sets": 4,
              "reps": "8-10",
              "rest": "90 sec",
              "notes": "optional string"
            }
          ]
        }
      ]
    }
  ]
}
`;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const aiResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `
Return ONLY valid JSON.
DO NOT add new fields.
Follow this EXACT structure:

${WORKOUT_JSON_EXAMPLE}
              `,
            },
            {
              role: "user",
              content: `
Generate a detailed workout program based on this request:

"${prompt}"

REMEMBER:
- Output must match schema EXACTLY
- "program_name" must be string
- MUST include multiple weeks and days
- MUST include exercises with sets, reps, rest
              `,
            },
          ],
        }),
      }
    );

    const raw = await aiResponse.json();
    const json = JSON.parse(raw.choices[0].message.content);

    const validated = WorkoutSchema.parse(json);

    return Response.json(validated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
