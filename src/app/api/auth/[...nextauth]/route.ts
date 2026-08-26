import NextAuth from "next-auth/next";
import { authOption } from "./option";


const handler = NextAuth(authOption)


export {hander as GET, handler as POST}