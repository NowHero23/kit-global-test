import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";
import { authConfig } from "@/config/server-config";
import { toUser } from "./app/shared/user";
import { getBlogAuthorId } from "./app/blog/firebase";

const PRIVATE_PATHS: string[] = [
  "/blog/create",
  // "/^\/blog\/[^\/]+\/edit$/",
  // "/^\/blog\/([^\/]+)\/edit$/",
  // "/profile"
];
const PUBLIC_PATHS = ["/register", "/login"]; // "/reset-password"

// const isBlogPrivateRoute = (pathname: string) => {
//   //if (pathname === "/blog/create") return true;
//   // Регулярний вираз для перевірки шляху /blog/[slug]/edit
//   // [^\/]+ означає будь-який набір символів, крім слеша (тобто сам slug)
//   if () return true;

//   return false;
// };

export async function proxy(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    refreshTokenPath: "/api/refresh-token",
    debug: authConfig.debug,
    enableMultipleCookies: authConfig.enableMultipleCookies,
    enableCustomToken: authConfig.enableCustomToken,
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    enableTokenRefreshOnExpiredKidHeader:
      authConfig.enableTokenRefreshOnExpiredKidHeader,
    dynamicCustomClaimsKeys: authConfig.dynamicCustomClaimsKeys,
    handleValidToken: async ({ token, decodedToken, customToken }, headers) => {
      // Authenticated user should not be able to access /login, /register and /reset-password routes

      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      const match = request.nextUrl.pathname.match(/^\/blog\/([^\/]+)\/edit$/);
      if (match) {
        const slug = match[1]; // Отримуємо значення з першої дужки

        const authorId = await getBlogAuthorId(slug);
        if (decodedToken.uid != authorId) {
          return redirectToHome(request);
        }
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (_reason) => {
      console.info("Missing or malformed credentials", { _reason });

      const pathname = request.nextUrl.pathname;
      const currentPrivatePaths = /^\/blog\/[^\/]+\/edit$/.test(
        request.nextUrl.pathname,
      )
        ? [...PRIVATE_PATHS, pathname]
        : PRIVATE_PATHS;

      return redirectToLogin(request, {
        path: "/login",
        privatePaths: currentPrivatePaths,
      });
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });

      const pathname = request.nextUrl.pathname;
      const currentPrivatePaths = /^\/blog\/[^\/]+\/edit$/.test(
        request.nextUrl.pathname,
      )
        ? [...PRIVATE_PATHS, pathname]
        : PRIVATE_PATHS;

      return redirectToLogin(request, {
        path: "/login",
        privatePaths: currentPrivatePaths,
      });
    },
    getMetadata: authConfig.getMetadata,
  });
}

export const config = {
  matcher: [
    //"/",
    "/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)",
    // Middleware api routes
    "/api/login",
    "/api/logout",
    "/api/refresh-token",
    // App api routes
    //"/api/custom-claims",
    //"/api/user-counters",
  ],
};
