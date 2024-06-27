import NextAuth from "next-auth";
import { NEXT_AUTH } from "../../../lib/auth";


export const authOptions = NEXT_AUTH

const handler = NextAuth(NEXT_AUTH);
export { handler as GET, handler as POST };
