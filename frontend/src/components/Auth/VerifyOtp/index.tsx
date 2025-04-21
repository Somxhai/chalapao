"use client";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

const VerifyOtp = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setVerificationCode(value);

    // ตรวจสอบให้เป็นตัวเลขเท่านั้น
    const regex = /^[0-9]*$/;
    if (!regex.test(value)) {
      setVerificationCodeError("Verification code must be a number");
    } else {
      setVerificationCodeError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตรวจสอบการกรอกข้อมูลก่อนส่งฟอร์ม
    if (!/^[0-9]*$/.test(verificationCode)) {
      setVerificationCodeError("Verification code must be a number");
    }

    // ถ้าผ่านการตรวจสอบ
    if (/^[0-9]*$/.test(verificationCode)) {
      console.log("");
    }
  };

  return (
    <main className="container mx-auto px-16 py-8">
      <div className="flex items-center justify-center min-h-screen ">
        <div className="relative w-full max-w-md">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <form
              className="flex max-w-md flex-col gap-4 px-10"
              onSubmit={handleSubmit}
            >
              <div>
                {/* LOGO */}
                <div className="mb-2 block">
                  <img
                    src="/icons/logo_black.svg"
                    alt="Logo"
                    className="mx-auto w-20 h-20"
                  />
                </div>

                {/* A verification code */}
                <div className="mb-2 block text-center">
                  <p className="text-2xl font-bold">A verification code</p>
                </div>

                {/* {/* --------------ข้อความ----------------- */}
                <div className="mb-2 block text-center">
                  <p className="text-4xs text-gray-600">
                    has been sent to your email address
                  </p>
                </div>

                {/* Resend button (text) */}
                <div className="mb-2 block text-right pr-2">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Resend
                  </button>
                </div>

                {/* Email Verification Code Input */}
                <div className="mb-2 block ">
                  <Label htmlFor="verification-code" className="text-1xl pl-4">
                    Email Verification Code
                  </Label>
                  <TextInput
                    id="verification-code"
                    type="text"
                    required
                    shadow
                    className="pl-4"
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

              {/* Confirm Button */}
              <div className="mb-2 flex justify-center">
                <Button
                  type="submit"
                  className="w-2/3 mx-auto border bg-gray-500 text-lg py-4"
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
