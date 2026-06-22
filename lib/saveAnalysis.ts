
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function saveAnalysis(
  userId: string,
  data: any
) {

  await setDoc(
    doc(
      db,
      "users",
      userId,
      "analysis",
      "latest"
    ),
    {
      ...data,
      updatedAt:
        serverTimestamp(),
    }
  );

}