"use client";

import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { TextArea } from "@/components/textarea";
import { BtnForm } from "@/components/btnForm";
import { FaTrash } from "react-icons/fa";

interface TaskClientProps {
  session: Session;
  taskId: string;
  initialComments: {
    id: string;
    comment: string;
    nome: string;
    created: string;
  }[];
}

interface TaskData {
  tarefa: string;
  public: boolean;
  user: string;
  created: Date;
  taskId: string;
}

export default function TaskClient({
  session,
  taskId,
  initialComments,
}: TaskClientProps) {
  const [task, setTask] = useState<TaskData | null>(null);
  const [notAllowed, setNotAllowed] = useState(false);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      const docRef = doc(db, "tasks", taskId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        setNotAllowed(true);
        return;
      }

      const data = snapshot.data();

      if (!data.public && (!session || data.user !== session.user?.email)) {
        setNotAllowed(true);
        return;
      }

      setTask({
        tarefa: data.tarefa,
        public: data.public,
        created: new Date(data.created.seconds * 1000),
        user: data.user,
        taskId: taskId,
      });
    }

    fetchTask();
  }, [taskId, session]);

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input === "") {
      alert("Preencha o comentário");
      return;
    }

    setIsSending(true);

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        taskId: taskId,
        user: session?.user?.email,
        nome: session?.user?.name,
        created: new Date(),
      });

      const newComment = {
        id: docRef.id,
        comment: input,
        taskId: taskId,
        user: session?.user?.email ?? "",
        nome: session?.user?.name ?? "",
        created: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);
      setInput("");
    } catch (error) {
      console.error("Erro ao cadastrar comentário:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    const docRef = doc(db, "comments", id);
    await deleteDoc(docRef);
  };

  if (notAllowed) {
    return <p>Você não tem acesso a esta tarefa.</p>;
  }

  if (!task) {
    return <p>Carregando tarefa...</p>;
  }

  return (
    <div className="flex flex-col w-full">
      <section className="px-4 w-full bg-white">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Detalhes da Tarefa
          </h1>

          <div className="space-y-2">
            <article className="border border-gray-200 rounded p-4">
              <span className="font-semibold text-gray-700">Tarefa:</span>{" "}
              {task.tarefa}
            </article>

            <div className="flex justify-between">
              {" "}
              <p className="font-light text-gray-700">
                <span className="font-light text-gray-700">Usuário:</span>{" "}
                {task.user}
              </p>
              <p className="font-light text-gray-700">
                <span className="font-light text-gray-700">Criada em:</span>{" "}
                {task.created.toUTCString().split(" ").slice(1, 5).join(" ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 w-full">
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Deixar um comentário
          </h1>

          <form onSubmit={handleComment} className="space-y-4 flex flex-col">
            <TextArea
              placeholder="Escreva seu comentário..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <BtnForm disabled={!session || isSending} type="submit">
              {isSending ? "Enviando..." : "Comentar"}
            </BtnForm>
          </form>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Comentários</h2>
            {comments.length === 0 ? (
              <p className="text-gray-500">Nenhum comentário ainda.</p>
            ) : (
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="border border-gray-200 rounded p-4"
                  >
                    <div className="flex items-center justify-between">
                      {" "}
                      <p className="text-gray-800">{comment.comment}</p>
                      <button
                        className="cursor-pointer"
                        onClick={() => setConfirmDeleteId(comment.id)}
                      >
                        <FaTrash size={20} className="text-danger" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-500 mt-2 flex justify-between">
                      <span>{comment.nome}</span>
                      <span>{new Date(comment.created).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {confirmDeleteId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                  <h2 className="text-lg font-bold text-center mb-2">
                    Confirmar exclusão
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Tem certeza que deseja excluir este comentário? Esta ação
                    não poderá ser desfeita.
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
                        await handleDeleteComment(confirmDeleteId);
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
        </div>
      </section>
    </div>
  );
}
