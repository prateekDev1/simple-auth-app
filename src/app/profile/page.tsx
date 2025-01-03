"use client"

import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function ProfilePage() {
    
    const router = useRouter();
    const [data,setData] = useState("nothing");
    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout Successful");
            console.log("Logout Successful");
            router.push("/login");
        } catch (error : any) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getUserDetails = async () => {
        const res = await axios.get("/api/users/me");
        console.log(res.data);
        setData(res.data.data._id);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black text-white">
            <h1>Profile</h1>
            <hr />
            <p>Profile Page</p>
            <h2 className="p-2 rounded-lg bg-green-600 mt-3">{data === "nothing" ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
            {/* we are using the data from the response to display the user id */}
            <hr />
            <button className="bg-blue-500 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded" onClick={logout}>
            Logout</button>
            <button className="bg-green-800 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded" onClick={getUserDetails}>
            Get User Details</button>
        </div>
    );
}