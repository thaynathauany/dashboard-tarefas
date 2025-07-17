import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TaskClient from "../TaskClient";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

interface Props {
  params: {
    id: string;
  };
}

export default async function TaskPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const commentsRef = collection(db, "comments");
  const q = query(
    commentsRef,
    where("taskId", "==", params.id),
    orderBy("created", "desc")
  );
  const snapshot = await getDocs(q);

  const comments = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      comment: data.comment ?? "",
      nome: data.nome ?? "",
      created: data.created?.toDate().toISOString() ?? "",
    };
  });

  return (
    <TaskClient
      taskId={params.id}
      session={session as any}
      initialComments={comments}
    />
  );
}
