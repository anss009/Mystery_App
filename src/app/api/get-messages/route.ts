import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";


export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOption)
    const user: User = session?.user as User
    if (!session || !user) { 
        return new Response(JSON.stringify({ success: false, message: "Not Authenticated" }), { status: 401 })
    }
    const userId = user._id;
    
   const foundUser = await UserModel.findById(userId)
   if(!foundUser){
    return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
    );
   }
   return Response.json(
    { success: true, isAcceptingMessages: foundUser.isAcceptingMessage },
    { status: 200 }
);
}