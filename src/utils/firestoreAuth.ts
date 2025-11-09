import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const isAuthorizedFirestore = async (
  email: string | null
): Promise<boolean> => {
  if (!email) return false;

  try {
    const authorizedUsersDoc = await getDoc(
      doc(db, "config", "authorizedUsers")
    );

    if (authorizedUsersDoc.exists()) {
      const data = authorizedUsersDoc.data();
      const emails: string[] = data.emails || [];
      return emails.includes(email.toLowerCase());
    }

    return false;
  } catch (error) {
    console.error("Błąd sprawdzania autoryzacji:", error);
    return false;
  }
};
