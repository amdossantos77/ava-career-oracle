"use client";

import { useState, useCallback } from "react";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, Terminal, Info, Briefcase, AlertCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OraclePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Oracle");
      setLocalError(null);
    },
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: any) => console.log("Message:", message),
    onError: (err: any) => {
      console.error("Conversation error:", err);
      // SEGURANÇA MÁXIMA: Nunca aceder a propriedades de err sem verificar
      let msg = "Connection failed";
      if (typeof err === "string") msg = err;
      else if (err && typeof err === "object") {
        msg = err.message || err.error || "Websocket closure or agent error";
      }
      setLocalError(msg);
    },
  });

  const { status, isSpeaking } = conversation;

  const toggleConversation = useCallback(async () => {
    setLocalError(null);
    if (status === "connected") {
      await conversation.endSession();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "YOUR_AGENT_ID", 
        });
      } catch (error: any) {
        console.error("Failed to start conversation:", error);
        setLocalError(error?.message || "Microphone access denied.");
      }
    }
  }, [conversation, status]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-white/20">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <Terminal size={14} className="text-white/60" />
          <span className="text-xs font-medium tracking-widest uppercase text-white/80">AVA Challenge · 42 Career Oracle</span>
        </motion.div>

        <div className="glass relative flex w-full max-w-2xl flex-col items-center p-12 text-center md:p-20">
          <motion.div
            animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1, boxShadow: isSpeaking ? "0 0 60px rgba(255,255,255,0.2)" : "0 0 20px rgba(255,255,255,0.05)" }}
            transition={{ repeat: isSpeaking ? Infinity : 0, duration: 2 }}
            className={cn("relative mb-10 flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/20 bg-black transition-all duration-500", status === "connected" && "border-white/60")}
          >
            <AnimatePresence mode="wait">
              {status === "connected" ? (
                <motion.div key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="voice-wave">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div key={i} animate={{ height: isSpeaking ? [10, 40, 15, 35, 10] : 10 }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1, ease: "easeInOut" }} className="wave-bar" />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Sparkles size={48} className="text-white/40" /></motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {localError ? (
            <div className="mb-6 flex flex-col items-center gap-2 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 max-w-md">
               <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
                 <AlertCircle size={16} /> Connection Alert
               </div>
               <p className="text-xs opacity-80 break-words">{localError}</p>
            </div>
          ) : (
            <>
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{status === "connected" ? "O Oráculo está a ouvir..." : "Consulta o Oráculo"}</h1>
              <p className="mb-12 max-w-sm text-lg text-white/50">{status === "connected" ? "Pergunta sobre a 42, estágio na AVA ou o teu futuro tech." : "Uma IA treinada para guiar os alunos da 42 no labirinto da carreira."}</p>
            </>
          )}

          <button onClick={toggleConversation} className={cn("group relative flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 font-bold transition-all duration-300", status === "connected" ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white" : "bg-white text-black hover:scale-105 active:scale-95")}>
            {status === "connected" ? <><MicOff size={20} /> Encerrar</> : <><Mic size={20} /> Falar com o Oráculo</>}
          </button>
        </div>
      </main>

      <style jsx global>{`@keyframes shine { 100% { transform: translateX(100%); } } .glass { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 2rem; backdrop-filter: blur(20px); } .voice-wave { display: flex; align-items: center; gap: 4px; } .wave-bar { width: 4px; background: white; border-radius: 2px; }`}</style>
    </div>
  );
}
