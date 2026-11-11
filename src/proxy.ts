import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!req.auth;
  const isLoginPage =
    pathname === "/login" ||
    pathname.startsWith("/en/login") ||
    pathname.startsWith("/nb/login");

  // Not logged in and not on login redirect to login
  if (!isLoggedIn && !isLoginPage) {
    const locale = pathname.startsWith("/en") ? "en" : "nb";
    const loginPath =
      locale === "nb" ? "/login" : `/${locale}/login`;
    return NextResponse.redirect(
      new URL(loginPath, req.nextUrl),
    );
  }

  // Logged in and on login redirect to home
  if (isLoggedIn && isLoginPage) {
    const locale = pathname.startsWith("/en") ? "en" : "nb";
    const homePath = locale === "nb" ? "/" : `/${locale}`;
    return NextResponse.redirect(
      new URL(homePath, req.nextUrl),
    );
  }

  // Otherwise, the usual next-intl middleware
  return intlMiddleware(req);
});

export const config = {
  // Applies to all paths except api, _next, static files
  matcher: [
    "/",
    "/(nb|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
