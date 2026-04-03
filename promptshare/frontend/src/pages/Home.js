import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@whatisjery/react-fluid-distortion';
import { useNavigate } from "react-router-dom"; // IMPORT NAVIGATE

import myLogo from "./logo.jpg"; 
import superstar_memesbruh03 from "./superstar_memesbruh03.ttf"; 

export default function Home() {
  const [phase, setPhase] = useState("loading");
  const text = "PromptShare";
  const navigate = useNavigate(); // INITIALIZE NAVIGATE

  useEffect(() => {
    const splitStart = setTimeout(() => setPhase("splitting"), 2200);
    const finalize = setTimeout(() => setPhase("ready"), 3800);
    return () => {
      clearTimeout(splitStart);
      clearTimeout(finalize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white bg-black">
      
      {/* --- LAYER 1: FLUID ANIMATION --- */}
      <div className="fixed inset-0 z-0">
        <Canvas
          gl={{ antialias: false, powerPreference: "high-performance" }}
          style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw' }}>
          <Suspense fallback={null}>
            <EffectComposer>
              <Fluid 
                distortion={0.6} 
                rainbow={true}     
                intensity={2.0} 
                force={2.0}
                radius={0.4}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* --- LAYER 2: SHUTTER REVEAL --- */}
      {phase !== "ready" && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-[51%] bg-[#f2f2f2] transition-transform duration-[1300ms] ease-[cubic-bezier(0.85,0,0.15,1)] will-change-transform ${phase === "splitting" ? "-translate-y-full" : "translate-y-0"}`} />
          <div className={`absolute bottom-0 left-0 w-full h-[51%] bg-[#f2f2f2] transition-transform duration-[1300ms] ease-[cubic-bezier(0.85,0,0.15,1)] will-change-transform ${phase === "splitting" ? "translate-y-full" : "translate-y-0"}`} />

          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${phase === "splitting" ? "opacity-0 scale-110" : "opacity-100 scale-100"}`}>
            <div className="flex flex-col items-center gap-6">
              <img src={myLogo} alt="Logo" className="w-12 h-12 object-contain mix-blend-multiply" />
              <div className="flex overflow-hidden">
                {text.split("").map((char, index) => (
                  <span key={index} className="text-4xl font-normal text-black inline-block opacity-0"
                    style={{ 
                      fontFamily: 'superstar_memesbruh03',
                      animation: 'terminalTextReveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards',
                      animationDelay: `${index * 70 + 500}ms`,
                      transform: 'translateY(100%)'
                    }}>
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LAYER 3: MAIN SITE CONTENT --- */}
      <div className={`relative z-10 flex flex-col min-h-screen transition-all duration-[1000ms] ${phase === "splitting" || phase === "ready" ? "opacity-100" : "opacity-0"}`}>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 select-none">
          <h1 className="text-8xl md:text-[12rem] leading-none uppercase text-white mix-blend-exclusion"
            style={{ fontFamily: 'superstar_memesbruh03', letterSpacing: '-0.02em' }}>
            {text}
          </h1>
          
          <div className="h-px bg-white my-10 opacity-40 transition-all duration-[1500ms]" 
            style={{ width: phase === "ready" ? "20rem" : "0rem" }} />

          <p className="text-[10px] md:text-xs font-mono tracking-[0.8em] text-white mix-blend-difference uppercase opacity-60 mb-14">
            Next Generation Intelligence
          </p>

          <div className="pointer-events-auto">
            <button 
              onClick={() => navigate("/explore")} // REDIRECT TO EXPLORE PAGE
              className="group relative px-12 py-4 rounded-full border border-white/10 overflow-hidden bg-transparent active:scale-95 transition-transform duration-200"
            >
              <div className="absolute inset-0 z-0 bg-white origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <div className="relative z-10 h-5 overflow-hidden pointer-events-none font-bold tracking-[0.5em] uppercase text-xs flex flex-col">
                <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-1/2">
                  <span className="h-5 flex items-center justify-center text-white">Explore</span>
                  <span className="h-5 flex items-center justify-center text-black">Explore</span>
                </div>
              </div>
            </button>
          </div>
        </main>
      </div>

      <style>{`
        @font-face {
          font-family: 'superstar_memesbruh03';
          src: url(${superstar_memesbruh03}) format('truetype');
        }
        @keyframes terminalTextReveal {
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}