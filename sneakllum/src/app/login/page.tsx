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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Basic validation to check if fields are not empty
        if (!formData.email || !formData.password) {
            setError("Email and Password are required");
            return;
        }

        // Handle login logic here (e.g., send data to API)
        console.log("Login submitted", formData);
    };

    return (
        <div className="max-w-md w-full mx-auto my-10 p-8 border border-gray-200 rounded-lg shadow-lg">

            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
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
                <Button label="Login" variant="primary" />
            </form>
            <Button
                label="Sign Up"
                variant="secondary"
                onClick={() => router.push("/register")}
            />
        </div>
    );
}
