"use client";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  /* Function เกี่ยวกับ Validation Username*/
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
    } else {
      setUsernameError("");
    }
  };
  /* Function เกี่ยวกับ Validation Password*/
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

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    }

    /* ถ้าผ่านทุกValidation ส่งConsole ไม่มีไร*/
    if (username.length >= 3 && password.length >= 6) {
      console.log("Form submitted");
    }
  };

  return (
    <main className="container mx-auto px-16 py-8">
      {/* ปรับให้ทุกอย่างอยู่กึ่งกลาง พื้นเทา */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {/* อันนี้ไม่รู้ */}
        <div className="relative w-full max-w-md">
          <div className="flex justify-between mb-4">
            {/* ข้อความ Sign-In Sign-Up ด้านบนซ้ายขวาของForm*/}
            <div className="text-lg font-semibold">Sign In</div>
            <div className="text-lg font-semibold">Sign Up</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            {/* เกี่ยวข้องกับฟอร์มทั้งหมด  ที่อยู่ด้านในกรอบฟอร์ม*/}
            <form
              className="flex max-w-md flex-col gap-4 px-10"
              onSubmit={handleSubmit}
            >
              <div>
                <div className="mb-2 block">
                  {/* LOGO Chalapao */}
                  <img
                    src="/icons/logo_black.svg"
                    alt="Logo"
                    className="mx-auto w-20 h-20"
                  />
                </div>
                <div className="mb-2 block text-center">
                  {/* ข้อความด้านล่างของโลโก้Chalapao */}
                  <h1 className="text-4xl font-bold">Chalapao</h1>
                </div>
                <div className="mb-2 block text-center ">
                  <p className="text-1xl font-bold text-right pr-10">
                    {/* ข้อความด้านล่างของโลโก้Chalapao */}
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
              </div>
              {/* --------------เกี่ยวกับ Password ทั้งหมด----------------- */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" className="text-1xl">
                    Password
                  </Label>
                </div>
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
              {/* --------------เกี่ยวกับข้อความ Reset Password----------------- */}
              <div className="mb-2 block text-center ">
                <p className="text-xs text-left">Reset Password</p>
              </div>
              {/* --------------ปุ่ม Button Sign in ----------------- */}
              <div className="mb-2 flex justify-center">
                <Button
                  type="submit"
                  className="w-3/4 mx-auto border bg-gray-500 text-lg py-4"
                >
                  Sign In
                </Button>
              </div>
              {/* --------------เกี่ยวกับปุ่มSign in with googleทั้งหมด----------------- */}
              <hr className="my-2 border-gray-300" />
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

export default SignIn;
