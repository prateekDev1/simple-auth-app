import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/login" || path == "/signup" || path == "/verifyemail";

    const token = request.cookies.get("token")?.value || "";

    // token is present that means user is logged in so stop user from going to login and signup page
    if(isPublicPath && token) {
        // return NextResponse.redirect("/profile");
        return NextResponse.redirect(new URL("/profile",request.nextUrl));
    }

    // token is not present that means user is not logged in so stop user from going to profile page
    if(!isPublicPath && !token) {
        // return NextResponse.redirect("/login");
        return NextResponse.redirect(new URL("/login",request.nextUrl));
    }

}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher : [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail'
    ]
}