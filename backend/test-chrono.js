import * as chrono from "chrono-node";
import { isValid, addDays, setHours, setMinutes } from "date-fns";

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
  console.log("Mapped text:", mappedText);
  // parse in English
  const parsed = chrono.parse(mappedText, new Date(), { forwardDate: true });
  
  if (parsed.length === 0) {
    console.log("No date parsed. Defaulting to tomorrow 09:00 AM");
    let defaultDate = addDays(new Date(), 1);
    defaultDate = setHours(defaultDate, 9);
    defaultDate = setMinutes(defaultDate, 0);
    return defaultDate.toISOString();
  }

  const dateResult = parsed[0];
  let finalDate = dateResult.start.date();
  
  const hasTime = dateResult.start.isCertain('hour');
  const hasMeridiem = dateResult.start.isCertain('meridiem') || mappedText.toLowerCase().includes('pm') || mappedText.toLowerCase().includes('am');
  const hasDate = dateResult.start.isCertain('day') || dateResult.start.isCertain('weekday');

  console.log("Parsed parts:", { hasTime, hasMeridiem, hasDate });

  if (hasTime && !hasMeridiem) {
    const hours = dateResult.start.get('hour');
    // If only hour is provided (e.g. at 5), assume 5 PM unless it's clearly morning (e.g. 9 AM usually just 9, but rule says "assume 5 PM unless clearly morning")
    // Let's say if hour is between 1 and 6, assume PM (13-18). If hour is 7-11, also PM? 
    // Requirement: "If only hour is provided (example: الساعة 5), assume 5 PM unless clearly morning"
    // So any hour < 12 without meridiem -> +12
    if (hours < 12) {
      finalDate = setHours(finalDate, hours + 12);
    }
  }

  if (!hasTime) {
    finalDate = setHours(finalDate, 9);
    finalDate = setMinutes(finalDate, 0);
  }

  if (finalDate < new Date()) {
    if (!hasDate) {
      finalDate = addDays(finalDate, 1);
    }
  }

  return finalDate.toISOString();
};

const testCases = [
  "ذكرني بكرة الساعة 5",
  "remind me tomorrow at 7",
  "بعد ساعتين اتصل بي",
  "الجمعة الساعة 9 صباحًا",
  "الجمعة الساعة 9 صباحا",
  "ذكرني بكرة الساعة 5 ونص مساء"
];

for (const t of testCases) {
  console.log("---");
  console.log("Original:", t);
  console.log("Parsed:", parseDateFromText(t));
}
