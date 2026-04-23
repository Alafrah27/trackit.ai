import * as chrono from "chrono-node";
import { isValid, addDays, setHours, setMinutes } from "date-fns";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mapArabicToEnglishDate = (text) => {
  let mappedText = text;
  const map = {
    "بكرة": "tomorrow",
    "بكرا": "tomorrow",
    "غدا": "tomorrow",
    "غداً": "tomorrow",
    "اليوم": "today",
    "الليلة": "tonight",
    "بعد بكرة": "in 2 days",
    "بعد بكرا": "in 2 days",
    "الاحد": "Sunday",
    "الأحد": "Sunday",
    "الاثنين": "Monday",
    "الإثنين": "Monday",
    "الثلاثاء": "Tuesday",
    "الاربعاء": "Wednesday",
    "الأربعاء": "Wednesday",
    "الخميس": "Thursday",
    "الجمعة": "Friday",
    "السبت": "Saturday",
    "ساعتين": "2 hours",
    "ساعة": "1 hour",
    "ساعات": "hours",
    "دقيقة": "1 minute",
    "دقايق": "minutes",
    "دقائق": "minutes",
    "نص ساعة": "30 minutes",
    "نصف ساعة": "30 minutes",
    "ربع ساعة": "15 minutes",
    "يومين": "2 days",
    "يوم": "1 day",
    "ايام": "days",
    "أيام": "days",
    "اسبوعين": "2 weeks",
    "اسبوع": "1 week",
    "أسبوع": "1 week",
    "اسابيع": "weeks",
    "أسابيع": "weeks",
    "شهرين": "2 months",
    "شهر": "1 month",
    "اشهر": "months",
    "أشهر": "months",
    "سنتين": "2 years",
    "سنة": "1 year",
    "عام": "1 year",
    "سنوات": "years",
    "اعوام": "years",
    "أعوام": "years",
    "القادم": "next",
    "الجاي": "next",
    "الماضي": "last",
    "اللي فات": "last",
    "الساعة": "at",
    "صباحا": "am",
    "صباحاً": "am",
    "الصبح": "am",
    "صباح": "am",
    "مساء": "pm",
    "مساءً": "pm",
    "بالليل": "pm",
    "العصر": "pm",
    "الظهر": "pm",
    "المغرب": "pm",
    "العشاء": "pm",
    "ونص": "and 30 minutes",
    "والنص": "and 30 minutes",
    "وربع": "and 15 minutes",
    "والربع": "and 15 minutes"
  };

  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    mappedText = mappedText.replace(new RegExp('(^|\\s)' + key + '(?=\\s|$)', 'g'), '$1' + map[key]);
  }
  return mappedText;
};

const parseDateFromText = (text) => {
  const mappedText = mapArabicToEnglishDate(text);
  const parsed = chrono.parse(mappedText, new Date(), { forwardDate: true });
  
  let finalDate;

  if (parsed.length === 0) {
    // Default to tomorrow 09:00 AM
    finalDate = addDays(new Date(), 1);
    finalDate = setHours(finalDate, 9);
    finalDate = setMinutes(finalDate, 0);
    return finalDate.toISOString();
  }

  const dateResult = parsed[0];
  finalDate = dateResult.start.date();
  
  const hasTime = dateResult.start.isCertain('hour');
  const hasMeridiem = dateResult.start.isCertain('meridiem') || mappedText.toLowerCase().includes('pm') || mappedText.toLowerCase().includes('am');
  const hasDate = dateResult.start.isCertain('day') || dateResult.start.isCertain('weekday');

  // If only hour is provided (e.g., at 5), assume PM unless it's clearly morning
  if (hasTime && !hasMeridiem) {
    const hours = dateResult.start.get('hour');
    if (hours < 12) {
      finalDate = setHours(finalDate, hours + 12);
    }
  }

  // If no time is provided, default to 09:00 AM
  if (!hasTime) {
    finalDate = setHours(finalDate, 9);
    finalDate = setMinutes(finalDate, 0);
  }

  // Ensure it's in the future
  if (finalDate < new Date()) {
    if (!hasDate) {
      finalDate = addDays(finalDate, 1);
    }
  }

  return finalDate.toISOString();
};

export const processVoice = async (text, session = null) => {
  const parsedDateISO = parseDateFromText(text);

  const systemPrompt = `
You are a smart AI financial and reminder assistant.

Your job:
- Understand Arabic and English
- Extract intent: expense or reminder
- Handle multi-step conversation using session
- Generate human-friendly, emotional, warm, and positive messages
- The reminder message and description are VERY important and must feel like a real personal assistant

IMPORTANT:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

==================================================
1. IF DATA IS MISSING
==================================================

Return:

{
  "type": "question",
  "question": "string",
  "session": {}
}

Examples:
- "كم المبلغ؟ 😊"
- "متى تريد التذكير؟"
- "هل تريد إشعار أم اتصال أم بريد؟"

==================================================
2. EXPENSE FORMAT
==================================================

{
  "type": "expense",
  "title": {
    "en": "Short natural sentence like: You spent 250 SAR on hospital visit",
    "ar": "جملة قصيرة مثل: صرفت ٢٥٠ ريال على زيارة المستشفى"
  },
  "amount": number,
  "category": {
    "en": "Healthcare",
    "ar": "الرعاية الصحية"
  },
  "date": "Valid ISO date string"
}

EXPENSE TITLE RULES

The title must:
- be medium 
- be natural
- be polite
- feel human
- sound like a smart personal assistant
- clearly describe what happened
- use warm and friendly wording
- not sound robotic


Good Examples EN:
- You spent 150 SAR on a lovely restaurant lunch 😊
- You spent 300 SAR on shopping for new clothes
- You spent 45 SAR on your Uber ride home
- You spent 250 SAR on your hospital visit

Good Examples AR:
- لقد أنفقت ١٥٠ ريال على غداء رائع في المطعم 😊
- لقد أنفقت ٣٠٠ ريال على شراء ملابس جديدة
- لقد أنفقت ٤٥ ريال على رحلة أوبر للعودة إلى المنزل
- لقد أنفقت ٢٥٠ ريال على زيارتك للمستشفى

IMPORTANT:
The title should feel warm, polite, and personal
like a real financial assistant speaking to the user.

Bad Example:
- Shopping expense
- Food payment

Good Example:
- You spent 150 SAR on restaurant lunch
- لقد أنفقت ١٥٠ ريال على الغداء في المطعم

==================================================
3. REMINDER FORMAT
==================================================

{
  "type": "reminder",
  "message": {
    "en": "Warm friendly emotional reminder message",
    "ar": "رسالة تذكير لطيفة ومشجعة"
  },
  "description": {
    "en": "Supportive positive description",
    "ar": "وصف إيجابي داعم"
  },
  "date": "${parsedDateISO}",
  "action": "notify | email | call",
  "phone": "string optional"
}

==================================================
4. DATE RULES (CRITICAL)
==================================================

We have already parsed and calculated the exact requested datetime for this reminder.
YOU MUST USE EXACTLY THIS STRING FOR THE "date" FIELD:
${parsedDateISO}

DO NOT CHANGE THIS DATE. DO NOT GENERATE YOUR OWN DATE.
This prevents timezone shifting and parsing errors.

==================================================
5. REMINDER MESSAGE RULES (VERY IMPORTANT)
==================================================

The message must feel:
- warm
- emotional
- supportive
- positive
- human-like
- like a real smart assistant

It should feel personal and encouraging.

Good Example EN:
"Dear Ali 😊, just a gentle reminder that you have an important interview next Monday at 8 AM. Stay confident and prepared — wishing you great success!"

Good Example AR:
"عزيزي علي 😊، تذكير لطيف بأن لديك مقابلة مهمة يوم الاثنين القادم الساعة ٨ صباحاً. كن واثقاً ومستعداً، ونتمنى لك كل التوفيق!"

==================================================
6. DESCRIPTION RULES (VERY IMPORTANT)
==================================================

The description must:
- support the user emotionally
- be positive and motivating
- feel calm and helpful
- be short but meaningful

Good Example EN:
"Stay prepared and confident for your important interview. You’ve got this!"

Good Example AR:
"كن مستعداً وواثقاً لمقابلتك المهمة، أنت قادر على النجاح!"

Description must NOT repeat the message.
It should add supportive emotional value.

==================================================
7. SESSION RULES
==================================================

If session exists:
- Merge new input with previous data
- Continue conversation naturally
- Do not ask again for existing information

==================================================
8. FINAL RULE
==================================================

Return ONLY valid JSON
No explanation
No markdown
No extra text
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
