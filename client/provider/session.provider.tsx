"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, ReactNode, useEffect, useRef, useState } from "react";
import { CiStopwatch } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa6";

interface SessionContextProps {
  session: Session | null;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSessionProvider = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionProvider must be used within a SessionProvider");
  }
  return context;
};

function SessionExpired() {
  const [remainingMs, setRemainingMs] = useState(5000);
  const completedRef = useRef(false);

  const redirect = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    signOut({ callbackUrl: "/auth/login" });
  };

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const left = Math.max(0, 5000 - (t - start));
      setRemainingMs(left);
      if (left <= 0) {
        redirect();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Enter") redirect();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const secondsLeft = Math.ceil(remainingMs / 1000);
  const progress = remainingMs / 5000;

  const ringSize = 140;
  const ringStroke = 5;
  const ringR = (ringSize - ringStroke) / 2;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC * (1 - progress);

  return (
      <Card
        role="alertdialog"
        aria-live="polite"
        className="w-auto max-w-md h-auto flex flex-wrap flex-col gap-6 rounded-[20px] bg-card p-10 shadow-2xl"
      >
        <div className="bg-primary/25 rounded-sm w-20 h-20 p-2">
          <CiStopwatch className="w-full h-full text-primary" />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Autenticação</span>
          </div>
          <h1 className="mb-3 mt-2 text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-[#e8eaf0]">
            Sessão expirada
          </h1>
          <p className="m-0 text-[15.5px] leading-[1.55] text-muted-foreground font-semibold">
            Sua sessão foi encerrada por inatividade. Você será redirecionado para a tela de login em instantes.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative grid place-items-center" style={{ width: ringSize, height: ringSize }}>
            <svg
              width={ringSize}
              height={ringSize}
              className="absolute inset-0"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringR}
                stroke="rgba(255,255,255,0.08)"
                className="text-primary bg-primary"
                strokeWidth={ringStroke}
                fill="none"
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringR}
                stroke="currentColor"
                strokeWidth={ringStroke}
                fill="none"
                strokeDasharray={ringC}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.08s linear" }}
                className="text-primary bg-primary"
              />
            </svg>
            <div className="relative flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold leading-none tabular-nums tracking-[-0.04em] mt-14">
                {secondsLeft}
              </span>
              <span className="text-[11.5px] uppercase tracking-[0.08em] text-[#9aa0ac]">
                segundos
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="inline-flex items-center gap-2.5 px-5 py-3 text-[14.5px] font-medium hover:brightness-105 active:brightness-95"
          >
            <span>Entrar novamente</span>
            <FaArrowRight />
          </Button>
          <div className="inline-flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <kbd className="rounded-[5px] border px-1.5 py-0.5 font-mono text-[11px]">
              Enter
            </kbd>
            <span>para entrar agora</span>
          </div>
        </div>
      </Card>
  );
}

export const SessionProvider = ({ children, session }: { children: ReactNode; session: Session | null }) => {
  const pathname = usePathname();
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const isAuthRoute = pathname.startsWith("/auth");

    if (isAuthRoute) {
      setLoggedOut(false);
      return;
    }

    if (!session) {
      setLoggedOut(true);
      return;
    }

    if (
      session &&
      session.user.tokenPayload?.exp &&
      now >= session.user.tokenPayload.exp
    ) {
      setLoggedOut(true);
    }
  }, [session, pathname]);

  if (loggedOut) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <SessionExpired />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};
