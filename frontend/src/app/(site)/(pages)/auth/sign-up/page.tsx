"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { Button, Label, TextInput } from "flowbite-react";
import { authClient } from "@/lib/auth-client";

const SignUp = () => {
	const [username, setUsername] = useState("student");
	const [email, setEmail] = useState("student@gmail.com");
	const [password, setPassword] = useState("student123");
	const [confirmPassword, setConfirmPassword] = useState("student123");
	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setUsername(value);
		if (value.length < 3) {
			setUsernameError("Username must be at least 3 characters long");
		} else {
			setUsernameError("");
		}
	};
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(value)) {
			setEmailError("Please enter a valid email address");
		} else {
			setEmailError("");
		}
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
	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setConfirmPassword(value);
		if (value !== password) {
			setConfirmPasswordError("Passwords do not match");
		} else {
			setConfirmPasswordError("");
		}
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (username.length < 3) {
			setUsernameError("Username must be at least 3 characters long");
		}
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
			setEmailError("Please enter a valid email address");
		}
		if (password.length < 6) {
			setPasswordError("Password must be at least 6 characters long");
		}
		if (confirmPassword !== password) {
			setConfirmPasswordError("Passwords do not match");
		}
		if (
			username.length >= 3 &&
			email &&
			password.length >= 6 &&
			confirmPassword === password
		) {
			console.log("Form submitted successfully");
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
							className="flex max-w-md flex-col gap-4 px-10"
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
							<div className="block">
								<Label htmlFor="username" className="text-1xl">
									Username
								</Label>
								<TextInput
									id="username"
									type="text"
									required
									value={username}
									onChange={handleUsernameChange}
								/>
								{usernameError && (
									<p className="text-red-500 text-xs">
										{usernameError}
									</p>
								)}
							</div>
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
								{emailError && (
									<p className="text-red-500 text-xs">
										{emailError}
									</p>
								)}
							</div>
							<div className="block">
								<Label htmlFor="password" className="text-1xl">
									Password
								</Label>
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
							<div className="block">
								<Label
									htmlFor="confirm-password"
									className="text-1xl"
								>
									Confirm Password
								</Label>
								<TextInput
									id="confirm-password"
									type="password"
									required
									value={confirmPassword}
									onChange={handleConfirmPasswordChange}
								/>
								{confirmPasswordError && (
									<p className="text-red-500 text-xs">
										{confirmPasswordError}
									</p>
								)}
							</div>
							<div className="flex justify-center">
								<Button
									type="submit"
									className="w-full border bg-gray-700 text-lg"
								>
									Sign Up
								</Button>
							</div>
							<hr className="border-gray-300" />
							<div className="flex justify-center">
								<button className="flex items-center justify-between w-full bg-blue-500 text-white p-2 rounded-lg">
									<img
										src="/icons/googlelogoicon.svg"
										alt="Google"
										className="w-6 h-6 mr-3 bg-white p-1 rounded-lg"
									/>
									<span className="flex-1 text-center">
										Sign in with Google
									</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
};

export default SignUp;
