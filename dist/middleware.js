var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
export function middleware(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
        const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
            cookies: {
                get(name) {
                    var _a;
                    return (_a = request.cookies.get(name)) === null || _a === void 0 ? void 0 : _a.value;
                },
                set(name, value, options) {
                    request.cookies.set(Object.assign({ name,
                        value }, options));
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set(Object.assign({ name,
                        value }, options));
                },
                remove(name, options) {
                    request.cookies.set(Object.assign({ name, value: '' }, options));
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set(Object.assign({ name, value: '' }, options));
                },
            },
        });
        const { data: { user }, } = yield supabase.auth.getUser();
        if (!user && !request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return response;
    });
}
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
