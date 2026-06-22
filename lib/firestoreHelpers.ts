
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  
} from "firebase/firestore";

export const saveApplication =
  async (
    userId: string,
    data: any
  ) => {

    await addDoc(
      collection(
        db,
        "users",
        userId,
        "applications"
      ),
      data
    );

  };
  export const getApplications =
  async (
    userId: string
  ) => {

    const snapshot =
      await getDocs(
        collection(
          db,
          "users",
          userId,
          "applications"
        )
      );

    return snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

  };
  export const updateApplicationStatus =
  async (
    userId: string,
    applicationId: string,
    status: string
  ) => {

    await updateDoc(
      doc(
        db,
        "users",
        userId,
        "applications",
        applicationId
      ),
      {
        status,
      }
    );

  };


// ==========================
// Resume Analysis
// ==========================

export const saveAnalysis = async (
  userId: string,
  data: any
) => {
  await setDoc(
    doc(db, "analysis", userId),
    data
  );
};

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

  if (snap.exists()) {
    return snap.data();
  }

  return null;
};


// ==========================
// Interview Kit
// ==========================

export const saveInterviewKit =
  async (
    userId: string,
    data: any
  ) => {
    await setDoc(
      doc(
        db,
        "interviewKit",
        userId
      ),
      data
    );
  };

export const getInterviewKit =
  async (
    userId: string
  ) => {
    const snap = await getDoc(
      doc(
        db,
        "interviewKit",
        userId
      )
    );

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  };


// ==========================
// Roadmap
// ==========================

export const saveRoadmap =
  async (
    userId: string,
    data: any
  ) => {
    await setDoc(
      doc(
        db,
        "roadmaps",
        userId
      ),
      data
    );
  };

export const getRoadmap =
  async (
    userId: string
  ) => {
    const snap = await getDoc(
      doc(
        db,
        "roadmaps",
        userId
      )
    );

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  };


// ==========================
// Cover Letter
// ==========================

export const saveCoverLetter =
  async (
    userId: string,
    data: any
  ) => {
    await setDoc(
      doc(
        db,
        "coverLetters",
        userId
      ),
      data
    );
  };

export const getCoverLetter =
  async (
    userId: string
  ) => {
    const snap = await getDoc(
      doc(
        db,
        "coverLetters",
        userId
      )
    );

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  };


// ==========================
// Evaluation
// ==========================

export const saveEvaluation =
  async (
    userId: string,
    data: any
  ) => {
    await setDoc(
      doc(
        db,
        "evaluations",
        userId
      ),
      data
    );
  };

export const getEvaluation =
  async (
    userId: string
  ) => {
    const snap = await getDoc(
      doc(
        db,
        "evaluations",
        userId
      )
    );

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  };