import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(reqeust : NextRequest){
    try {
        const reqBody = await reqeust.json();
        const {email,password} = reqBody;

        console.log(reqBody);

        // check if user exists
        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({error:"User doesn't exist"},{status:400});
        }

        // check if password is correct
        const validPassword = await bcryptjs.compare(password,user.password);

        if(!validPassword){
            return NextResponse.json({error:"Invalid password"},{status:400});
        }

        // create token data
        const tokenData = {
            id : user._id,
            username : user.username,
            email : user.email
        }

        // actually create token with the data
        const token = jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"});

        // token is created but yet not sent to the user's cookie

        // create response
        const response = NextResponse.json({
            message : "Login successful",
            success : true
        })

        // this response can access user's cookie

        response.cookies.set("token",token,{
            httpOnly : true
        });

        return response;

    } catch (error : any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}