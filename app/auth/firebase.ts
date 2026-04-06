import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getFirebaseApp } from "../firebase";

const db = getFirestore(getFirebaseApp());

const createUser = async (data: {
  id: string;
  nickname: string;
}): Promise<string | null> => {
  try {
    await setDoc(doc(db, "users", data.id), {
      nickname: data.nickname,
      registeredAt: new Date(),
    });

    console.log("Користувач успішно створений!");
    return data.id;
  } catch (error) {
    console.error("Error creating user:", error);
  }
  return null;
};

export { createUser };
