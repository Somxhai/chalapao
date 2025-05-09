import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
			},
		}
	);

	if (!session) {
		// DOCS: change url if needed
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}

	if (
		session?.user?.user_type &&
		request.nextUrl.pathname &&
		session.user.user_type !== "lessor" &&
		request.nextUrl.pathname.startsWith("/lender")
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/rental/:path*", "/lender/:path*"], // Specify the routes the middleware applies to
};
