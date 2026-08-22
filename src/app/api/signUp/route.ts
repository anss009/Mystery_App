import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";
import { verify } from "crypto";

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
                success:false,
                message: "Username is already taken"
            }, {status:400})
           }

            const existingUserByemail = await UserModel.findOne({email})

            const hashedpassword = await bcrypt.hash(password, 10)

         if(existingUserByemail){
                return Response.json({
                     success: false,
                     message: "Email is already registered"
                }, {status: 400})
            }
        else{
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours()+1)


        const newUser  =  new UserModel({
             username,
                email,
                password: hashedpassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified: false,
                isAcceptingMessage: true, 
                messages: [],
         })
         await newUser.save()
}

// send verification email

const emailResponse = await sendVerificationEmail(
    email,
    password,
    verifyCode
)

    } catch (error) {
        console.error('Error registering error', error)
        return Response.json({ message: "Error registering user" }, { status: 500 })
    }
}