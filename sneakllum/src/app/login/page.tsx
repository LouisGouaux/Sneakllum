// app/login/page.tsx
"use client";
import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");


        // Basic validation to check if fields are not empty
        if (!formData.email || !formData.password) {
            setError("Email and Password are required");
            return;
        }

        setIsLoading(true)
        try {
            const response = await fetch("http://sneakllum.louis.gouaux.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                setSuccess("Login successful!");
                setFormData({
                    email: "",
                    password: "",
                });
                setIsLoading(false)
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed. Please try again.");
                setIsLoading(false)
            }
        } catch (err) {
            setIsLoading(false)
            setError("An error occurred. Please try again later.");
            console.log(err)

        }
        // Handle login logic here (e.g., send data to API)
        console.log("Login submitted", formData);
    };
    if(isLoading){
        return(

            <div className="text-center flex justify-center items-center h-96">
                <div role="status">
                    <svg aria-hidden="true"
                         className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }else {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="max-w-md w-full p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
                    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <Button label="Login" variant="primary"/>
                    </form>
                    <Button
                        label="Sign Up"
                        variant="secondary"
                        onClick={() => router.push("/register")}
                    />
                </div>
            </div>
        );
    }
}
