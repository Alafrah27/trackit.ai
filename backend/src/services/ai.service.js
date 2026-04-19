import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const processVoice = async (text, session = null) => {
  const systemPrompt = `
You are an AI assistant.

Your job:
- Understand Arabic and English
- Extract intent: expense or reminder
- Handle multi-step conversation using session

RULES:

1. If data is missing:
Return:
{
  "type": "question",
  "question": "string",
  "session": { ... }
}

2. If complete:
Return ONLY JSON

Expense:
{
  "type": "expense",
  "title": {
    "en": "string",
    "ar": "string"
  },
  "amount": number,
  "category": {
    "en": "string",
    "ar": "string"
  },
  "date": "ISO string"
}

Reminder:
{
  "type": "reminder",
  "message": {
    "en": "string",
    "ar": "string"
  },
  "description": {
    "en": "string",
    "ar": "string"
  },
  "datetime": "ISO string",
  "action": "notify | email | call",
  "phone": "string (optional)"
}

3. Understand:
- Arabic dates (بكرة، بعد يومين، الجمعة)
- If time missing → 09:00
- If date missing → today

4. If session exists:
- Merge new input with previous data
- Continue conversation

5. Return ONLY JSON (no explanation)
`;

  const messages = [{ role: "system", content: systemPrompt }];

  // 🧠 Inject session context
  if (session) {
    messages.push({
      role: "system",
      content: `Previous session: ${JSON.stringify(session)}`,
    });
  }

  messages.push({
    role: "user",
    content: text,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2,
  });

  const raw = response.choices[0].message.content;

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON from AI:", raw);

    // fallback
    return {
      type: "question",
      question: "لم أفهم، ممكن توضح أكثر؟",
      session: session || {},
    };
  }

  return parsed;
};
