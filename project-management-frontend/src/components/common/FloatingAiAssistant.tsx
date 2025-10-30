import { useState, useEffect } from "react";
import { Sparkles, Copy } from "lucide-react";
import { elaborateTask } from "../../services/aiService";
import { AiElaborationResponseDto } from "../../@api";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingAIAssistantProps {
  taskId: number;
}

export default function FloatingAIAssistant({ taskId }: FloatingAIAssistantProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AiElaborationResponseDto | null>(null);
  const [typedText, setTypedText] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  const sanitize = (s: string) => s?.replace(/^[\uFEFF\u200B\r\n]+/, "") ?? "";

  const handleElaborateClick = async () => {
    setShowOptions(false);
    setShowResponse(true);
    setLoading(true);
    setTypedText("");
    setShowSteps(false);
    setResponse(null);

    try {
      const res = await elaborateTask(taskId);
      setResponse(res);
    } catch (err) {
      console.error("AI elaboration error:", err);
      setResponse({
        elaboratedTask: "⚠️ Failed to fetch AI response. Please try again.",
        steps: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const closeResponse = () => {
    setShowResponse(false);
    setResponse(null);
    setTypedText("");
    setShowSteps(false);
    setShowOptions(false);
  };

  useEffect(() => {
    if (loading) return;
    if (!response?.elaboratedTask) return;

    const text = sanitize(response.elaboratedTask);
    setTypedText("");

    let index = 0;
    const speed = 25;
    const interval = setInterval(() => {
      const ch = text.charAt(index);
      if (ch) setTypedText((prev) => prev + ch);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowSteps(true), 450);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [response, loading]);

  const handleCopy = () => {
    if (!response) return;
    const textToCopy =
      `${response.elaboratedTask}\n\n` +
      (response.steps?.length ? "Steps:\n" + response.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") : "");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Dimmed backdrop */}
      <AnimatePresence>
        {(showOptions || showResponse) && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowOptions(false);
              closeResponse();
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating AI button */}
      <AnimatePresence>
        {!showResponse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50 group"
          >
            <motion.button
              onClick={() => setShowOptions((s) => !s)}
              className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-xl text-white hover:scale-105 transition-transform relative"
              title="Ask AI Assistant"
            >
              <Sparkles size={24} />
            </motion.button>

            {/* Tooltip beside the button (right side) */}
            <div className="pointer-events-none absolute top-1/2 right-14 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-xs bg-black/60 text-white rounded px-2 py-1 whitespace-nowrap">
                Ask AI assistant
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Option box */}
      <AnimatePresence>
        {showOptions && !showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-24 right-8 z-50 p-3 rounded-xl bg-white/8 backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <button
              onClick={handleElaborateClick}
              className="text-sm text-white hover:text-indigo-300 transition px-2 py-1"
            >
              ✨ Elaborate Task
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response box */}
      <AnimatePresence>
        {showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3 }}
            style={{ paddingTop: 6, paddingBottom: 6 }}
            className="fixed bottom-28 right-8 z-50 w-[min(95vw,520px)] max-h-[calc(100vh-96px)] overflow-y-auto rounded-2xl bg-white/8 backdrop-blur-3xl border border-white/12 shadow-2xl text-white"
          >
            <div className="p-5">
              {/* Header with copy + close */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">AI Task Elaboration</h3>
                  <p className="text-xs text-gray-300 mt-1">Context-aware steps & summary</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-sm text-gray-300 hover:text-indigo-300 transition flex items-center gap-1"
                  >
                    <Copy size={14} />
                    {copied ? <span className="text-xs">Copied</span> : <span className="text-xs">Copy</span>}
                  </button>
                  <button
                    onClick={closeResponse}
                    className="text-sm text-gray-300 hover:text-red-400 transition ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="flex space-x-2 mb-3">
                    <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" />
                  </div>
                  <p className="text-indigo-200 text-sm">Thinking...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  {/* Typing text */}
                  <div className="text-gray-100 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                    {typedText || (response?.elaboratedTask ? "" : "No elaboration found.")}
                    {typedText && typedText.length < (response?.elaboratedTask?.length || 0) && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block w-[6px] h-[12px] bg-white/80 align-baseline ml-1"
                      />
                    )}
                  </div>

                  {showSteps && response?.steps && response.steps.length > 0 && (
                    <div>
                      <h4 className="text-sm text-indigo-200 font-medium mb-2">Suggested Steps</h4>
                      <ul className="list-disc list-inside text-gray-200 space-y-2">
                        {response.steps.map((step, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12 }}
                            className="text-sm"
                          >
                            {step}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
