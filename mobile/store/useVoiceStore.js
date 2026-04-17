import { create } from "zustand";
import Instance from "../lib/axios";
import * as Speech from "expo-speech";

// ─── Voice AI Store ──────────────────────────────────────────────────
// Integrates with: POST /api/v1/trackit-ai/
// Backend accepts: { text, session }
// Backend returns:
//   • question  → { speak, session }           (multi-turn follow-up)
//   • expense   → { speak, data, session:null } (expense created)
//   • reminder  → { speak, data, session:null } (reminder created)
//   • error     → { error }                     (limit reached / server error)
// ─────────────────────────────────────────────────────────────────────

export const useVoiceStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────────────
  // Recording
  isRecording: false,
  transcript: "",

  // AI conversation
  session: null, // multi-turn session token from backend
  loading: false,
  error: null,

  // Conversation history for UI display
  messages: [],
  // Format: [{ id, role: "user"|"ai", text, type?, data?, timestamp }]

  // TTS
  isSpeaking: false,

  // Last created entities (useful for navigation / undo)
  lastCreatedExpense: null,
  lastCreatedReminder: null,

  // ─── Recording Controls ─────────────────────────────────────────────
  setIsRecording: (value) => set({ isRecording: value }),

  setTranscript: (text) => set({ transcript: text }),

  // ─── Send Voice Text to AI ──────────────────────────────────────────
  sendVoiceText: async (text) => {
    const { session, _addMessage, _speakResponse } = get();

    if (!text?.trim()) return { success: false, message: "Empty input" };

    // Add user message to history
    _addMessage({ role: "user", text: text.trim() });

    set({ loading: true, error: null });

    try {
      const res = await Instance.post("/v1/trackit-ai", {
        text: text.trim(),
        session,
      });

      const data = res.data;

      // ─── Error from backend (limit reached, etc.) ─────────────
      if (data.error) {
        _addMessage({ role: "ai", text: data.error, type: "error" });
        set({ error: data.error });
        _speakResponse(data.error);
        return { success: false, message: data.error };
      }

      // ─── AI follow-up question (multi-turn) ───────────────────
      if (data.speak && data.session) {
        _addMessage({
          role: "ai",
          text: data.speak,
          type: "question",
        });
        set({ session: data.session });
        _speakResponse(data.speak);
        return { success: true, type: "question", speak: data.speak };
      }

      // ─── Expense / Reminder created successfully ──────────────
      if (data.speak && data.data) {
        const isExpense = data.data.amount !== undefined;
        const type = isExpense ? "expense" : "reminder";

        _addMessage({
          role: "ai",
          text: data.speak,
          type,
          data: data.data,
        });

        set({
          session: null, // conversation complete
          ...(isExpense
            ? { lastCreatedExpense: data.data }
            : { lastCreatedReminder: data.data }),
        });

        _speakResponse(data.speak);
        return { success: true, type, speak: data.speak, data: data.data };
      }

      // ─── Fallback ─────────────────────────────────────────────
      set({ session: null });
      return { success: false, message: "Unexpected response" };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "حدث خطأ، حاول مرة أخرى";

      _addMessage({ role: "ai", text: message, type: "error" });
      set({ error: message });
      return { success: false, message };
    } finally {
      set({ loading: false, transcript: "" });
    }
  },

  // ─── TTS (Text-to-Speech) ───────────────────────────────────────────
  _speakResponse: (text) => {
    if (!text) return;
    set({ isSpeaking: true });

    Speech.speak(text, {
      language: "ar-SA",
      onDone: () => set({ isSpeaking: false }),
      onError: () => set({ isSpeaking: false }),
      onStopped: () => set({ isSpeaking: false }),
    });
  },

  stopSpeaking: () => {
    Speech.stop();
    set({ isSpeaking: false });
  },

  // ─── Message History Helpers ────────────────────────────────────────
  _addMessage: (msg) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  },

  // ─── Reset / Cleanup ───────────────────────────────────────────────
  clearConversation: () => {
    Speech.stop();
    set({
      session: null,
      messages: [],
      transcript: "",
      error: null,
      loading: false,
      isRecording: false,
      isSpeaking: false,
      lastCreatedExpense: null,
      lastCreatedReminder: null,
    });
  },

  clearError: () => set({ error: null }),

  // Reset session only (keep history visible)
  resetSession: () => set({ session: null }),
}));
