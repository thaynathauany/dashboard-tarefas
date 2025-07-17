"use client";

import { useEffect, useState } from "react";
import { TextArea } from "@/components/textarea";
import { BtnForm } from "@/components/btnForm";
import { FiShare2, FiEdit2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { Session } from "next-auth";

interface TaskProps {
  id: string;
  tarefa: string;
  user: string;
  public: boolean;
  created: Date;
}

interface DashboardClientProps {
  session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [input, setInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [linkCopied, setLinkCopied] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  useEffect(() => {
    const tarefasRef = collection(db, "tasks");
    const q = query(tarefasRef, orderBy("created", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [] as TaskProps[];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.user === session?.user?.email) {
          list.push({
            id: doc.id,
            tarefa: data.tarefa,
            user: data.user,
            public: data.public,
            created: data.created,
          });
        }
      });

      setTasks(list);
    });

    return () => unsubscribe();
  }, [session]);

  const handleRegisterTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "") {
      alert("Preencha a tarefa");
      return;
    }

    try {
      if (editTaskId) {
        const docRef = doc(db, "tasks", editTaskId);
        await updateDoc(docRef, {
          tarefa: input,
          public: isPublic,
        });
        setEditTaskId(null);
      } else {
        await addDoc(collection(db, "tasks"), {
          tarefa: input,
          created: new Date(),
          user: session?.user?.email,
          public: isPublic,
        });
      }

      setInput("");
      setIsPublic(false);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  const handleCopyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/task/${id}`
      );
      setLinkCopied(id);

      setTimeout(() => {
        setLinkCopied("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao copiar o link:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <section className="px-4 w-full bg-white">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Nova tarefa
          </h1>

          <form
            className="space-y-4 flex flex-col"
            onSubmit={handleRegisterTask}
          >
            <TextArea
              placeholder="Descreva sua tarefa..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public"
                name="public"
                className="h-4 w-4 accent-primary"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label htmlFor="public" className="text-sm text-foreground">
                Deixar tarefa pública?
              </label>
            </div>

            <BtnForm type="submit">
              {editTaskId ? "Salvar edição" : "Cadastrar tarefa"}
            </BtnForm>
          </form>
        </div>
      </section>

      <section className="px-4 w-full">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Minhas tarefas
          </h1>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-2 border border-gray-300 p-2 rounded mb-2"
            >
              {task.public && (
                <article className="flex items-center gap-2">
                  <label className="text-xs bg-primary text-black px-2 py-1 rounded">
                    PÚBLICO
                  </label>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleCopyLink(task.id)}
                  >
                    <FiShare2 size={20} className="text-primary" />
                  </button>

                  {linkCopied === task.id && (
                    <span className="text-green-600 text-sm ml-1">
                      Link copiado!
                    </span>
                  )}
                </article>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  {task.public ? (
                    <div>
                      <div>
                        {" "}
                        <p className="line-clamp-2 text-ellipsis overflow-hidden">
                          {task.tarefa}
                        </p>
                        <span className="text-blue-500 hover:underline text-sm">
                          {" "}
                          <Link href={`/task/${task.id}`}>
                            {" "}
                            clique para ver mais
                          </Link>
                        </span>{" "}
                      </div>
                    </div>
                  ) : (
                    <div className=" flex flex-col  gap-2">
                      {" "}
                      <p className="line-clamp-2 text-ellipsis overflow-hidden">
                        {task.tarefa}
                      </p>
                      <span className="text-blue-500 hover:underline text-sm">
                        {" "}
                        <Link href={`/task/${task.id}`}>
                          {" "}
                          clique para ver mais
                        </Link>
                      </span>{" "}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="cursor-pointer"
                    onClick={() => setConfirmDeleteId(task.id)}
                  >
                    <FaTrash size={20} className="text-danger" />
                  </button>

                  <button
                    className="cursor-pointer"
                    onClick={() => {
                      setInput(task.tarefa);
                      setIsPublic(task.public);
                      setEditTaskId(task.id);
                    }}
                  >
                    <FiEdit2 size={20} className="text-secondary" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {confirmDeleteId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                <h2 className="text-lg font-bold text-center mb-2">
                  Confirmar exclusão
                </h2>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Tem certeza que deseja excluir esta tarefa? Esta ação não
                  poderá ser desfeita.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      await handleDeleteTask(confirmDeleteId);
                      setConfirmDeleteId(null);
                    }}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
