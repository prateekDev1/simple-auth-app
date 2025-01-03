import { connect } from "@/dbConfig/dbConfig";
import { NextRequest , NextResponse } from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
        console.log(token);

        // check if token is valid and not expired
        const user = await User.findOne({verifyToken : token, verifyTokenExpiry : {$gt : Date.now()}});

        if(!user) {
            return NextResponse.json({error : "Invalid or expired token"},{status : 400});
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message : "Email verified successfully",
            status : 200
        });

    } catch (error : any) {
        return NextResponse.json({error : error.message},{status : 500});
    }

}