"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { Button, Label, TextInput } from "flowbite-react";
import { signIn } from "@/lib/auth-client";

const SignIn = () => {
	const [email, setEmail] = useState("john@example.com");
	const [password, setPassword] = useState("123456789");
	const [passwordError, setPasswordError] = useState("");
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
	};
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPassword(value);
		if (value.length < 6) {
			setPasswordError("Password must be at least 6 characters long");
		} else {
			setPasswordError("");
		}
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters long");
		}
		if (email.length >= 3 && password.length >= 6) {
			signIn
				.email({
					email: email, // Assuming email is the email
					password,
					callbackURL: "/",
					rememberMe: false,
				})
				.then(({ data, error }) => {
					if (error) {
						console.error("Sign-in failed:", error);
					} else {
						console.log("Sign-in successful:", data);
					}
				})
				.catch((error) => {
					console.error("An unexpected error occurred:", error);
				});
		}
	};
	return (
		<main className="container mx-auto px-16 py-8">
			<div className="flex items-center justify-center min-h-screen">
				<div className="relative w-full max-w-md">
					<div className="flex justify-between mb-4">
						<Link
							href="/auth/sign-in"
							className="text-lg font-semibold"
						>
							Sign In
						</Link>
						<Link
							href="/auth/sign-up"
							className="text-lg font-semibold"
						>
							Sign Up
						</Link>
					</div>
					<div className="bg-white p-6 rounded-lg shadow">
						<form
							className="flex flex-col gap-4 px-10"
							onSubmit={handleSubmit}
						>
							<div className="w-fit mx-auto">
								<img
									src="/icons/logo_black.svg"
									alt="Logo"
									className="mx-auto w-20 h-20"
								/>
								<h1 className="text-4xl font-bold text-center">
									Chalapao
								</h1>
								<p className="text-1xl font-bold text-right">
									เช่าเราปะะ
								</p>
							</div>
							<div>
								<div className="block">
									<Label htmlFor="email" className="text-1xl">
										Email
									</Label>
									<TextInput
										id="email"
										type="email"
										required
										value={email}
										onChange={handleEmailChange}
									/>
								</div>
							</div>
							<div>
								<div className="block">
									<Label
										htmlFor="password"
										className="text-1xl"
									>
										Password
									</Label>
								</div>
								<TextInput
									id="password"
									type="password"
									required
									value={password}
									onChange={handlePasswordChange}
								/>
								{passwordError && (
									<p className="text-red-500 text-xs">
										{passwordError}
									</p>
								)}
							</div>
							<div className="flex justify-center">
								<Button
									type="submit"
									className="w-full mx-auto border bg-gray-700 text-lg"
								>
									Sign In
								</Button>
							</div>
							{/* <hr className=" border-gray-300" />
							<div className="flex justify-center">
								<button className="flex items-center justify-between w-full bg-blue-500 text-white py-2 px-4 rounded-lg">
									<img
										src="/icons/googlelogoicon.svg"
										alt="Google"
										className="w-6 h-6 mr-3 bg-white p-1 rounded-lg"
									/>
									<span className="flex-1 text-center">
										Sign in with Google
									</span>
								</button>
							</div> */}
						</form>
					</div>
				</div>
			</div>
		</main>
	);
};

export default SignIn;
