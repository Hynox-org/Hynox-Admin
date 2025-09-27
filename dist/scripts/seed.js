var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase.auth.signUp({
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'password',
        });
        if (error) {
            console.error('Error creating admin user:', error.message);
        }
        else {
            console.log('Admin user created successfully:', data);
        }
    });
}
main();
