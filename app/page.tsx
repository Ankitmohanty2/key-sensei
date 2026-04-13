"use client";
import { Keyboard, type KeyboardInteractionEvent } from "@/components/ui/keyboard";
import { useEffect, useRef, useState } from "react";
import TypingTest from "@/components/TypingTest";
import Image from "next/image";
import keySenseiLogo from "./key-sensei-logo.png";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  IconAt, IconClock, IconLetterA, IconQuote,
  IconMountain, IconNumber, IconFeather, IconFlame,
} from "@tabler/icons-react";

const THEMES = [
  { value: "classic", label: "Classic" },
  { value: "mint", label: "Mint" },
  { value: "royal", label: "Royal" },
  { value: "dolch", label: "Dolch" },
  { value: "sand", label: "Sand" },
  { value: "scarlet", label: "Scarlet" },
] as const;

type ThemeValue = (typeof THEMES)[number]["value"];

const THEME_COLORS: Record<ThemeValue, string> = {
  classic: "#737373",
  mint: "#86C8AC",
  royal: "#324974",
  dolch: "#4F5E78",
  sand: "#C94E41",
  scarlet: "#D5868A",
};

const TIME_OPTIONS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
  { value: 120, label: "120s" },
] as const;

const WORD_OPTIONS = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
] as const;

type Mode = "time" | "words";

export default function Home() {
  const [theme, setTheme] = useState<ThemeValue>("classic");
  const [mode, setMode] = useState<Mode>("time");
  const [selectedTime, setSelectedTime] = useState<number>(30);
  const [selectedWords, setSelectedWords] = useState<number>(10);
  const [testStatus, setTestStatus] = useState<"idle" | "running" | "finished">("idle");

  const timeOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wordOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [timeIndicatorStyle, setTimeIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const [wordIndicatorStyle, setWordIndicatorStyle] = useState<{ left: number; width: number } | null>(null);

  const updateIndicatorStyle = (refs: React.MutableRefObject<(HTMLButtonElement | null)[]>, activeValue: number, mode: "time" | "words") => {
    const activeIndex = (mode === "time" ? TIME_OPTIONS : WORD_OPTIONS).findIndex((opt) => opt.value === activeValue);
    if (activeIndex >= 0 && refs.current[activeIndex]) {
      const btn = refs.current[activeIndex];
      if (btn) {
        const offsets = { left: btn.offsetLeft, width: btn.offsetWidth };
        if (mode === "time") {
          setTimeIndicatorStyle(offsets);
        } else {
          setWordIndicatorStyle(offsets);
        }
      }
    }
  };

  useEffect(() => {
    updateIndicatorStyle(timeOptionRefs, selectedTime, "time");
  }, [selectedTime]);

  useEffect(() => {
    updateIndicatorStyle(wordOptionRefs, selectedWords, "words");
  }, [selectedWords]);

  useEffect(() => {
    // Initialize indicator styles on mount
    updateIndicatorStyle(timeOptionRefs, selectedTime, "time");
    updateIndicatorStyle(wordOptionRefs, selectedWords, "words");
  }, []);
  return (
    <main className="h-screen w-screen overflow-hidden bg-background flex flex-col pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {testStatus !== "finished" && (
        <header className="flex-none w-full max-w-[1240px] mx-auto h-20 flex items-center px-6 md:px-10 justify-between">
          <div className="font-mono flex items-center gap-4">
            <Image
              src={keySenseiLogo}
              alt="Key Sensei logo"
              width={80}
              height={80}
              className="h-10 w-auto object-contain scale-[1.3] invert dark:invert-0 opacity-80 hover:opacity-100 transition-opacity"
              priority
            />
            <span className="font-bold text-[var(--typo-active)] text-3xl tracking-widest leading-none pt-1">Key Sensei</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex gap-2 items-center bg-muted/20 px-3 py-2 rounded-xl mr-2 shadow-inner border border-white/5">
                {THEMES.map((t) => (
                   <button
                     key={t.value}
                     onClick={() => setTheme(t.value)}
                     style={{ backgroundColor: THEME_COLORS[t.value] }}
                     className={[
                        "w-4 h-4 rounded-full transition-all duration-300",
                        theme === t.value ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "opacity-40 hover:opacity-100"
                     ].join(" ")}
                     title={t.label}
                   />
                ))}
             </div>
             <ThemeToggle />
          </div>
        </header>
      )}

      {testStatus !== "finished" && (
        <div className="flex-none w-full max-w-[1040px] mx-auto flex flex-wrap justify-center items-center gap-4 transition-all px-4 mt-2">
           {/* Section 1: Modes */}
           <div className="flex items-center gap-1 rounded-xl p-1 bg-muted/60 dark:bg-[#1a1b1e]/80 text-muted-foreground shadow-sm border border-border/10">
              <button 
                 onClick={() => setMode("time")}
                 className={["flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", mode === "time" ? "bg-background dark:bg-[#252729] shadow-sm text-[var(--typo-active)] font-semibold" : "hover:text-foreground"].join(" ")}
              >
                  <IconClock size={13} /> time
              </button>
              <button 
                 onClick={() => setMode("words")}
                 className={["flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", mode === "words" ? "bg-background dark:bg-[#252729] shadow-sm text-[var(--typo-active)] font-semibold" : "hover:text-foreground"].join(" ")}
              >
                  <IconLetterA size={13} stroke={2.5} /> words
              </button>
           </div>

           <div className="flex items-center gap-1 rounded-xl p-1 bg-muted/60 dark:bg-[#1a1b1e]/80 text-muted-foreground shadow-sm border border-border/10">
              {(mode === "time" ? TIME_OPTIONS : WORD_OPTIONS).map((opt) => {
                 const active = mode === "time" ? opt.value === selectedTime : opt.value === selectedWords;
                 const handleClick = () => {
                   if (mode === "time") setSelectedTime(opt.value);
                   else setSelectedWords(opt.value);
                 };
                 return (
                   <button 
                     key={opt.label}
                     onClick={handleClick}
                     className={["flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", active ? "bg-background dark:bg-[#252729] shadow-sm text-[var(--typo-active)] font-semibold" : "hover:text-foreground"].join(" ")}
                   >
                     {active ? opt.label.replace('s', '') : opt.label.replace('s', '')}
                   </button>
                 );
              })}
           </div>
        </div>
      )}

      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center">
        <TypingTest
          mode={mode}
          selectedTime={selectedTime}
          selectedWords={selectedWords}
           onStatusChange={setTestStatus}
        />
      </div>

      {testStatus !== "finished" && (
        <div className="flex-none w-full flex flex-col items-center justify-center relative z-10 pb-6 md:pb-8 pointer-events-none">
          <div className="w-full max-w-[828px] mx-auto transform origin-bottom scale-75 sm:scale-90 md:scale-[0.85] flex justify-center pointer-events-auto">
            <Keyboard
              theme={theme}
              enableHaptics
              enableSound
              onKeyEvent={(_event: KeyboardInteractionEvent) => { }}
            />
          </div>
        </div>
      )}

      {testStatus !== "finished" && (
        <div
          className="fixed bottom-6 left-8 z-50 font-mono opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
          style={{ fontSize: "12px", color: "var(--muted-foreground, #888)" }}
        >
          made by{" "}
          <a
            href="https://github.com/Ankitmohanty2"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline transition-colors duration-200"
            style={{ color: "inherit", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f5c518")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            @_Ankit
          </a>
        </div>
      )}
    </main>
  );
}
