import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function POST(req: Request) {
    await dbConnect()
    try {
        const {searchParams} = new URL(req.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        // Validate with zod
       const result = UsernameQuerySchema.safeParse(queryParam)
       console.log(result)
       if(!result.success){
        const usernameErrors = result.error?.format().username?._errors || []
        return Response.json(
            {
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameter"
            }, {status: 400})
        }


       const {username} = result.data
      const existingVerifiedUser =  await UserModel.findOne({username, isVerified: true})

        
    } catch (error) {
        console.error("Error checking username", error)
        return new Response(JSON.stringify({success: false, message: "Error checking username"}), {status: 500})
    }   }