import { getFirebaseApp } from "@/app/firebase";
import User from "@/app/types/user";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { TokenSet } from "next-firebase-auth-edge/auth";

export const serverConfig = {
  useSecureCookies: process.env.USE_SECURE_COOKIES === "true",
  firebaseApiKey: process.env.FIREBASE_API_KEY!,
  serviceAccount: process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
          /\\n/g,
          "\n",
        )!,
      }
    : undefined,
};

export const authConfig = {
  apiKey: serverConfig.firebaseApiKey,
  cookieName: "AuthToken",
  cookieSignatureKeys: [
    process.env.COOKIE_SECRET_CURRENT!,
    process.env.COOKIE_SECRET_PREVIOUS!,
  ],
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: serverConfig.useSecureCookies, // Set this to true on HTTPS environments
    sameSite: "lax" as const,
    maxAge: 12 * 60 * 60 * 24, // twelve days
  },
  serviceAccount: serverConfig.serviceAccount,
  // Set to false in Firebase Hosting environment due to https://stackoverflow.com/questions/44929653/firebase-cloud-function-wont-store-cookie-named-other-than-session
  enableMultipleCookies: false,
  // Set to false if you're not planning to use `signInWithCustomToken` Firebase Client SDK method
  enableCustomToken: false,
  enableTokenRefreshOnExpiredKidHeader: true,
  debug: false,
  //tenantId: clientConfig.tenantId,
  getMetadata: async (tokens: TokenSet) => {
    let nickname = tokens.decodedIdToken.name || "Unknown";
    // Отримуємо нікнейм користувача з Firestore
    try {
      const db = getFirestore(getFirebaseApp());

      const userRef = doc(db, "users", tokens.decodedIdToken.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        nickname = userData.nickname || nickname;
      }
    } catch (error) {
      console.error("Помилка при отриманні нікнейму з Firestore:", error);
      // У разі помилки залишиться дефолтне значення (ім'я з токена або "Unknown")
    }

    return {
      uid: tokens.decodedIdToken.uid,
      nickname,
      timestamp: new Date().getTime(),
    };
  },
  dynamicCustomClaimsKeys: ["someCustomClaim"],
};
