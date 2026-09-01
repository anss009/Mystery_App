import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";

export async function POST() {
    await dbConnect()
    const session = await getServerSession(authOption)
    const user: User = session?.user
    if (!session || !user) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 })
    }
}