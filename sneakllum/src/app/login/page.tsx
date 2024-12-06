"use client";
import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and Password are required");
      return;
    }

    try {
      const response = await fetch("https://5b8cmbmlsw.preview.infomaniak.website/api/login", {
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
        const data = await response.json();

        const { token, first_name, is_admin } = data.data;

        // Debugging logs
        console.log("Token:", token);
        console.log("First Name:", first_name);
        console.log("Is Admin:", is_admin);

        login(
            { name: first_name, email: formData.email, isAdmin: is_admin || false },
            token
        );

        setSuccess("Login successful!");
        router.push("/");
        setFormData({
          email: "",
          password: "",
        });
        setIsLoading(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
        <div className="text-center flex justify-center items-center h-96">
          Loading...
        </div>
    );
  } else {
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
                    className="w-full"
                    variant="secondary"
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
                    className="w-full"
                    variant="secondary"
                />
              </div>
              <Button label="Login" variant="primary" className="w-full" />
            </form>
            <Button
                label="Sign Up"
                variant="secondary"
                onClick={() => router.push("/register")}
                className="w-full"
            />
          </div>
        </div>
    );
  }
}
