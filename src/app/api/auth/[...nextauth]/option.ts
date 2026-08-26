import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
 import bcrypt from "bcryptjs";
 import dbConnect from "@/lib/dbConnect";
 import UserModel from "@/model/User";



 export const authOption: NextAuthOptions =  {
        providers :[
            CredentialsProvider({
                id :"credentials",
                name: "Credentials",
                credentials:{
                    username:{label: "email", type:"text"},
                    password:{label: "password", type: "password"}
                }
            })
        ]
 }