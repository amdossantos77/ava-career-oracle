"use client";

import { useState, useCallback } from "react";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, Terminal, Info, Briefcase } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OraclePage() {
  const [isHovered, setIsHovered] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => console.log("Connected to Oracle"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: any) => console.log("Message:", message),
    onError: (error: any) => console.error("Error:", error),
  });

  const { status, isSpeaking } = conversation;

  const toggleConversation = useCallback(async () => {
    if (status === "connected") {
      await conversation.endSession();
    } else {
      try {
        // Request microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Start conversation
        // Note: The user will need to provide their Agent ID
        await conversation.startSession({
          agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "YOUR_AGENT_ID", 
        });
      } catch (error) {
        console.error("Failed to start conversation:", error);
        alert("Por favor, permite o acesso ao microfone para falar com o Oráculo.");
      }
    }
  }, [conversation, status]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-white/20">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Header / Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <Terminal size={14} className="text-white/60" />
          <span className="text-xs font-medium tracking-widest uppercase text-white/80">
            AVA Challenge · 42 Career Oracle
          </span>
        </motion.div>

        {/* Oracle Central Interface */}
        <div className="glass relative flex w-full max-w-2xl flex-col items-center p-12 text-center md:p-20">
          
          <motion.div
            animate={{ 
              scale: isSpeaking ? [1, 1.1, 1] : 1,
              boxShadow: isSpeaking 
                ? "0 0 60px rgba(255,255,255,0.2)" 
                : "0 0 20px rgba(255,255,255,0.05)"
            }}
            transition={{ repeat: isSpeaking ? Infinity : 0, duration: 2 }}
            className={cn(
              "relative mb-10 flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/20 bg-black transition-all duration-500",
              status === "connected" && "border-white/60"
            )}
          >
            <AnimatePresence mode="wait">
              {status === "connected" ? (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="voice-wave"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isSpeaking ? [10, 40, 15, 35, 10] : 10 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.6, 
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="wave-bar"
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Sparkles size={48} className="text-white/40" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Pulsing Outer Ring */}
            {status === "connected" && (
              <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/10" />
            )}
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {status === "connected" ? "O Oráculo está a ouvir..." : "Consulta o Oráculo"}
          </h1>
          
          <p className="mb-12 max-w-sm text-lg text-white/50">
            {status === "connected" 
              ? "Pergunta sobre a 42, estágio na AVA ou o teu futuro tech." 
              : "Uma IA treinada para guiar os alunos da 42 no labirinto da carreira."}
          </p>

          <button
            onClick={toggleConversation}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "group relative flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 font-bold transition-all duration-300",
              status === "connected" 
                ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white" 
                : "bg-white text-black hover:scale-105 active:scale-95"
            )}
          >
            {status === "connected" ? (
              <>
                <MicOff size={20} />
                Encerrar Conexão
              </>
            ) : (
              <>
                <Mic size={20} className="transition-transform group-hover:rotate-12" />
                Falar com o Oráculo
              </>
            )}
            
            {/* Button Shine Effect */}
            <div className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
          </button>

          {/* Status Indicator */}
          <div className="mt-8 flex items-center gap-2 text-xs font-mono text-white/30">
            <div className={cn(
              "h-1.5 w-1.5 rounded-full animate-pulse",
              status === "connected" ? "bg-green-500" : "bg-white/20"
            )} />
            STATUS: {status.toUpperCase()}
          </div>
        </div>

        {/* Footer Info Cards */}
        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: <Info size={18} />, title: "Contexto", text: "Treinado com a filosofia da 42 e o stack da AVA AI." },
            { icon: <Briefcase size={18} />, title: "Vagas Live", text: "Ligado em tempo real ao CRM para verificar estágios." },
            { icon: <Sparkles size={18} />, title: "Feedback", text: "Recebe conselhos diretos e técnicos sobre o teu percurso." },
          ].map((item, idx) => (
            <div key={idx} className="glass flex flex-col gap-3 p-6 text-left">
              <div className="text-white/60">{item.icon}</div>
              <h3 className="font-bold text-white/90">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </main>

      <style jsx global>{`
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
