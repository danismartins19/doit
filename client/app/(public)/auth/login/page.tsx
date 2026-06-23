"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  async function handleGoogleSignIn() {
    setIsConnecting(true);

    const result = await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });

    console.log("result", result);

    if (result?.error) {
      setIsConnecting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-side px-5 py-12 text-ink">
      <button
        type="button"
        aria-label="Alternar tema"
        title="Alternar tema"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="fixed right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-md border border-line-2 bg-panel text-ink-2 transition hover:text-ink"
      >
        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      </button>

      <section className="w-full max-w-[400px]">
        <div className="rounded-lg border border-line bg-panel p-10 shadow-[0_12px_40px_-12px_rgba(20,24,34,0.16)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)]">
          <div className="mb-7 flex flex-col items-center text-center">
            <span className="text-3xl font-extrabold text-ink">
              do<span className="text-brand-blue">i</span>t
            </span>
            <h1 className="mt-6 text-[22px] font-extrabold leading-tight text-ink">
              Entre na sua conta
            </h1>
            <p className="mt-2 max-w-[280px] text-sm leading-6 text-ink-2">
              Organize suas tarefas por projeto e por dia, em qualquer
              dispositivo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isConnecting}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-line-2 bg-canvas text-[15px] font-semibold text-ink shadow-[0_2px_8px_-3px_rgba(20,24,34,0.16)] transition hover:bg-hover disabled:cursor-wait disabled:opacity-70"
          >
            {isConnecting ? (
              "Conectando..."
            ) : (
              <>
                <GoogleIcon />
                Continuar com o Google
              </>
            )}
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-ink-3">
            Ao continuar, voce concorda com os{" "}
            <a className="font-medium text-ink-2 hover:underline" href="#">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a className="font-medium text-ink-2 hover:underline" href="#">
              Politica de Privacidade
            </a>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink-3">
          Novo por aqui? Sua conta e criada automaticamente no primeiro acesso.
        </p>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
