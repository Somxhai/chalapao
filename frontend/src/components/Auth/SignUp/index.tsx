"use client";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      setUsernameError(""); // Remove error when valid
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Simple email regex validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(""); // Remove error when valid
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError(""); // Remove error when valid
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
      setConfirmPasswordError(""); // Remove error when valid
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      console.log("Form submitted");
    }
  };

  return (
    <main className="container mx-auto px-16 py-8">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative w-full max-w-md">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-semibold">Sign In</div>
            <div className="text-lg font-semibold">Sign Up</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
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
                  <h1 className="text-4xl font-bold">Chalapao</h1>
                </div>
                <div className="mb-2 block text-center ">
                  <p className="text-1xl font-bold text-right pr-10">
                    เช่าเราปะะ
                  </p>
                </div>
                {/* --------------เกี่ยวกับ Username ทั้งหมด----------------- */}
                <div className="mb-2 block">
                  <Label htmlFor="username" className="text-1xl">
                    Username
                  </Label>
                  <TextInput
                    id="username"
                    type="text"
                    required
                    shadow
                    className="pl-4"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  {usernameError && (
                    <p className="text-red-500 text-xs">{usernameError}</p>
                  )}
                </div>

                {/* --------------เกี่ยวกับ email ทั้งหมด----------------- */}
                <div className="mb-2 block mt-4">
                  <Label htmlFor="email" className="text-1xl">
                    Email
                  </Label>
                  <TextInput
                    id="email"
                    type="email"
                    required
                    shadow
                    className="pl-4"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs">{emailError}</p>
                  )}
                </div>
              </div>

              {/* --------------เกี่ยวกับ Password ทั้งหมด----------------- */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" className="text-1xl">
                    Password
                  </Label>
                  <TextInput
                    id="password"
                    type="password"
                    required
                    shadow
                    className="pl-4"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs">{passwordError}</p>
                  )}
                </div>
              </div>

              {/* --------------เกี่ยวกับ Confirm password ทั้งหมด----------------- */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="confirm-password" className="text-1xl">
                    Confirm Password
                  </Label>
                  <TextInput
                    id="confirm-password"
                    type="password"
                    required
                    shadow
                    className="pl-4"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {confirmPasswordError && (
                    <p className="text-red-500 text-xs">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              </div>

              {/* --------------เกี่ยวกับ Sign up button ทั้งหมด----------------- */}
              <div className="mb-2 flex justify-center">
                <Button
                  type="submit"
                  className="w-3/4 mx-auto border bg-gray-500 text-lg py-4"
                >
                  Sign Up
                </Button>
              </div>

              <hr className="my-2 border-gray-300" />

              {/* --------------เกี่ยวกับ Sign in with Google ทั้งหมด----------------- */}
              <div className="mb-2 flex justify-center">
                <button className="flex items-center justify-between w-full bg-blue-500 text-white py-2 px-4 rounded-md">
                  <img
                    src="/icons/googlelogoicon.svg"
                    alt="Google"
                    className="w-6 h-6 mr-3 bg-white p-1 rounded"
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
