import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect()

    try {
           const {username, email, password} =  await request.json()
           const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
           })

           if(existingUserVerifiedByUsername){
            return Response.json({
                success:false;
                message: "Username is already taken"
            }, {status:400})
           }

         const existingUserByemail =   UserModel.findOne({email})

         if(existingUserByemail){
            true                                                                        
         }  else{
            const hashpassword =  bcrypt.hash(password, 10)
         }

         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours()+1)


         new UserModel({
            
         })

    } catch (error) {
        console.error('Error registering error', error)
        return Response.json({ message: "Error registering user" }, { status: 500 })
    }
}