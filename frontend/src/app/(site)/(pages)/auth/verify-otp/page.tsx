"use client";

import { useState, useEffect } from "react";

import { Button, Label, TextInput } from "flowbite-react";

const VerifyOtp = () => {
	const [verificationCode, setVerificationCode] = useState("");
	const [verificationCodeError, setVerificationCodeError] = useState("");
	const handleVerificationCodeChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setVerificationCode(value);
		const regex = /^[0-9]*$/;
		if (!regex.test(value)) {
			setVerificationCodeError("Verification code must be a number");
		} else {
			setVerificationCodeError("");
		}
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!/^[0-9]*$/.test(verificationCode)) {
			setVerificationCodeError("Verification code must be a number");
		}
		if (/^[0-9]*$/.test(verificationCode)) {
			console.log("");
		}
	};
	return (
		<main className="container mx-auto px-16 py-8">
			<div className="flex items-center justify-center min-h-screen ">
				<div className="relative w-full max-w-md">
					<div className="bg-white p-6 rounded-lg shadow">
						<form
							className="flex max-w-md flex-col gap-4 px-10"
							onSubmit={handleSubmit}
						>
							<div>
								<div className="mb-2 block">
									<img
										src="/icons/logo_black.svg"
										alt="Logo"
										className="mx-auto w-20 h-20"
									/>
								</div>
								<div className="mb-2 block text-center">
									<p className="text-2xl font-bold">
										A verification code
									</p>
								</div>
								<div className="mb-2 block text-center">
									<p className="text-4xs text-gray-600">
										has been sent to your email address
									</p>
								</div>
								<div className="mb-2 block text-right pr-2">
									<button
										type="button"
										className="text-sm text-blue-600 hover:underline"
									>
										Resend
									</button>
								</div>
								<div className="mb-2 block">
									<Label
										htmlFor="verification-code"
										className="text-1xl"
									>
										Email Verification Code
									</Label>
									<TextInput
										id="verification-code"
										type="text"
										required
										value={verificationCode}
										onChange={handleVerificationCodeChange}
									/>
									{verificationCodeError && (
										<p className="text-red-500 text-xs">
											{verificationCodeError}
										</p>
									)}
								</div>
							</div>
							<div className="mb-2 flex justify-center">
								<Button
									type="submit"
									className="w-full border bg-gray-700 text-lg py-4"
								>
									Confirm
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
};

export default VerifyOtp;
