"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {

    const router = useRouter();
    const [user,setUser] = useState({
        email : "",
        password : "",
    })

    const [disabledButton,setDisabledButton] = useState(false);
    const [loading,setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error:any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    }   

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0){
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
    },[user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black text-white">
            <h1
            className="text-4xl font-bold mb-8">{loading ? "Processing" : "Login"}</h1>
            <hr />
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
                onClick={onLogin}
            >{disabledButton ? "Loading ..." : "Login"}</button>
            <Link href="/signup">Not Registered ? Create Account</Link>
        </div>
    )

}