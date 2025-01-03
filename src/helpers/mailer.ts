// we are using nodemailer
// usually hitesh keep mail helper just for sending emails and not for generating tokens, used just for sending emails
// but here we are using it for generating tokens as well

// we also need to decide how we want to verify the user : either just backend or backend + frontend
// if we are doing it on backend side, the url formatting needs to be in that way
// if we are doing it on frontend side, there needs to be a frontend page of it

// domain.com/verifyToken/kgjdtsteufjgkvjk : this could be  fetched using req.params : better approach if we are doing everything on the server component
// domain.com/verifyToken?token=kgjdtsteufjgkvjk : this could be fetching using window.location : better approach if we are using client component


import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({email, emailType, userId} : any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(),10);

        // find by id looks for an id and update the values, and user id is the id which will be looking for hunting the record in the database.
        // we are updating the verifyToken and verifyTokenExpiry fields in the database
        
        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,{verifyToken : hashedToken, verifyTokenExpiry : Date.now() + 3600000}, {new : true, runValidators : true});
        }
        else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId,{forgotPasswordToken : hashedToken, forgotPasswordTokenExpiry : Date.now() + 3600000}, {new : true, runValidators : true});
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "44088c3ff5d4d1",
                  pass: "8e7cfd31d2bb76"
                }
        });

        const mailOptions = {
            from: 'hitesh@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;

    } catch (error : any) {
        throw new Error(error.message);
    }
}