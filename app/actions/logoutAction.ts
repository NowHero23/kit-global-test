"use server";

import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { signOut } from "firebase/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getFirebaseAuth } from "@/app/firebase";
import { authConfig } from "@/config/server-config";

export async function logoutAction() {
  await signOut(getFirebaseAuth());

  removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
  redirect("/");
}
