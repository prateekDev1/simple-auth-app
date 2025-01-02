"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {

    const router = useRouter();
    const [user,setUser] = useState({
        email : "",
        password : "",
        username : ""
    })
    const [disabledButton,setDisabledButton] = useState(false);
    const [loading,setLoading] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup response", response.data);
            router.push("/login");
            
        } catch (error:any) {
            console.log("Signup failed", error.message);
            toast.error(error.message);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    },[user])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black text-white">
            <h1
            className="text-4xl font-bold mb-8">{loading ? "Loading..." : "Signup"}</h1>
            <hr />
            <label htmlFor="username">username</label>
            <input 
                className=" p-2 m-2 border border-gray-600 rounded-lg text-gray-900"
                type="text" 
                id="username"
                value={user.username}
                placeholder="username"
                onChange={(e) => setUser({...user,username:e.target.value})}
            />
            <label htmlFor="email">email</label>
            <input 
                className="p-2 m-2 border border-gray-600 rounded-lg text-gray-900"
                type="text" 
                id="email"
                value={user.email}
                placeholder="email"
                onChange={(e) => setUser({...user,email:e.target.value})}
            />
            <label htmlFor="password">password</label>
            <input 
                className="p-2 m-2 border border-gray-600 rounded-lg text-gray-900"
                type="password" 
                id="password"
                value={user.password}
                placeholder="password"
                onChange={(e) => setUser({...user,password:e.target.value})}
            />
            <button 
                className="p-2 m-2 mt-4 border border-gray-300 focus:border-gray-600 rounded-lg mb-4 focus:outline-none"
                onClick={onSignup}
            >{disabledButton ? "Loading..." : "Signup"}</button>
            <Link href="/login">Visit login page</Link>
        </div>
    )

}