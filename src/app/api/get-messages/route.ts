import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";


export async function GET() {
    await dbConnect()
    const session = await getServerSession(authOption)
    const user: User = session?.user as User
    if (!session || !user) { 
        return new Response(JSON.stringify({ success: false, message: "Not Authenticated" }), { status: 401 })
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const sortedMessages = (foundUser.messages || []).sort(
            (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )

        return Response.json(
            { success: true, messages: sortedMessages },
            { status: 200 }
        );
    } catch (error) {
        console.log("An Unexpected error occurred", error)
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {
            status: 500
        })
    }
}