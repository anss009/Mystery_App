import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOption)
    const user: User = session?.user as User
    if (!session || !user) { 
        return new Response(JSON.stringify({ success: false, message: "Not Authenticated" }), { status: 401 })
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                { success: false, message: "Failed to update user status to accept messages" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, message: "Message acceptance status updated", updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.log("failed to update user status to accept messages ", error);
        return Response.json(
            { success: false, message: "Failed to update user status to accept messages" },
            { status: 500 }
        );
    }
}