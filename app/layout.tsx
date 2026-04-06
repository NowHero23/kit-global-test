import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "./auth/AuthContext";
import { AuthProvider } from "./auth/AuthProvider";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { authConfig } from "@/config/server-config";
import { toUser } from "./shared/user";
import Link from "next/link";
import { HomeLink } from "@/ui/HomeLink/HomeLink";
import { LogoutButton } from "@/ui/LogoutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokens = await getTokens<Metadata>(await cookies(), authConfig);

  const user = tokens ? toUser(tokens) : null;

  const loginStatus = !tokens ? (
    <Link href="/login">Log in</Link>
  ) : (
    <div className="flex items-center gap-4">
      <Link href="/blog/create">Create Post</Link>
      <LogoutButton />
    </div>
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <AuthProvider user={user}>
        <body className="min-h-full flex flex-col">
          <header className="min-h-5 flex justify-center items-center bg-white dark:border dark:bg-gray-800 dark:border-gray-700">
            <div className="w-full max-w-xl mx-2 xl:mx-5 auto flex items-center justify-between h-16">
              <HomeLink />
              <div>{loginStatus}</div>
            </div>
          </header>

          <div className="flex justify-center flex-[1_0_auto]">
            <div className="w-full text-center flex flex-col pt-4 items-center">
              <div className="flex flex-col gap-2 w-full max-w-lg mb-2 px-2 sm:px-4">
                {children}
              </div>
            </div>
          </div>
          <footer className="min-h-5 flex justify-center items-center bg-white dark:border dark:bg-gray-800 dark:border-gray-700">
            <div className="w-full max-w-xl mx-2 xl:mx-5 auto flex items-center justify-between h-16">
              <HomeLink />
            </div>
          </footer>
        </body>
      </AuthProvider>
    </html>
  );
}

export const metadata = {
  title: "next-kit-global Test Work",
  description: "Next.js page",
  icons: "/favicon.ico",
};
