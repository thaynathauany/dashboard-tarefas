"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/">
        <h1 className="text-3xl font-bold text-foreground">Tarefas+</h1>
      </Link>
      <div className="flex gap-2 ml-auto">
        {status === "loading" ? (
          <p>Carregando...</p>
        ) : session?.user ? (
          <>
            <Link href="/dashboard">
              <button className="px-4 py-2 rounded bg-primary text-black hover:bg-secondary transition-colors">
                Meu Painel
              </button>
            </Link>
            <button
              className="px-4 py-2 rounded bg-primary text-black hover:bg-secondary transition-colors"
              onClick={() => signOut()}
            >
              Sair
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 rounded bg-primary text-black hover:bg-secondary transition-colors"
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
