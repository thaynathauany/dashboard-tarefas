export const revalidate = 60;

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const tasksSnapshot = await getDocs(collection(db, "tasks"));
  const totalPosts = tasksSnapshot.size;

  const commentsSnapshot = await getDocs(collection(db, "comments"));
  const totalComments = commentsSnapshot.size;

  return (
    <main className=" bg-gray flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <Image
          src="/assets/hero.png"
          alt="Imagem destaque"
          className="mx-auto mb-6 rounded"
          width={500}
          height={300}
          priority
        />
        <h1 className="text-2xl md:text-4xl font-bold text-foreground ">
          Chega de se sobrecarregar.
        </h1>
        <p className="text-lg text-foreground mt-2">
          Use o <strong className="text-primary">Tarefas+</strong> para
          organizar sua rotina com tranquilidade.
        </p>

        <div className="flex gap-2 justify-center mt-6">
          <Link href="/dashboard">
            {" "}
            <button className="px-4 py-2 rounded bg-primary text-black hover:bg-secondary transition-colors">
              + {totalPosts} posts
            </button>
          </Link>

          <button className="px-4 py-2 rounded bg-primary text-black hover:bg-secondary transition-colors">
            + {totalComments} comentários
          </button>
        </div>
      </div>
    </main>
  );
}
