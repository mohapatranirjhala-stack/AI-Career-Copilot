
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export const getAnalysis = async (
  userId: string
) => {

  const snap = await getDoc(
    doc(
      db,
      "users",
      userId,
      "analysis",
      "latest"
    )
  );

  console.log("READING", userId);
  console.log("EXISTS", snap.exists());

  if (snap.exists()) {
    return snap.data();
  }

  return null;
};