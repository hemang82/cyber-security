"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Spinner from "../common/Spinner";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { useAuthStore } from "@/store/authStore";
import { CODES } from "@/common/constant";

export default function VerifyForm() {
    const router = useRouter();
    const setTemLogin = useAuthStore((s) => s.setTemLogin);
    const temLogin = useAuthStore((state) => state.temLogin);

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [is_loading, setLoader] = useState(false);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const isVerifiedRef = useRef(false);

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return; // only numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasteData)) return;

        const newOtp = pasteData.split("");
        // Fill remaining if pasted less than 6
        while (newOtp.length < 6) newOtp.push("");

        setOtp(newOtp);

        newOtp.forEach((_, i) => {
            if (newOtp[i]) inputsRef.current[i]?.focus();
        });
    };

    useEffect(() => {
        if (!temLogin && !isVerifiedRef.current) {
            router.push("/signup");
        }
    }, [temLogin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalOtp = otp.join("");

        if (finalOtp.length < 6) {
            TOAST_ERROR("Please enter a valid 6-digit code.");
            return;
        }
        setLoader(true);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...temLogin, otp: finalOtp }),
            });

            const responseData = await res.json();

            if (responseData.code === CODES?.SUCCESS) {
                TOAST_SUCCESS(responseData.message);

                const templogout = await fetch("/api/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                const templogoutData = await templogout.json();
                console.log("templogoutData", templogoutData);

                isVerifiedRef.current = true;
                setTemLogin(null)
                router.replace("/signin"); // ✅ redirect after success
            } else {
                TOAST_ERROR(responseData.message);
            }
        } catch (error) {
            console.error("Verification error:", error);
            TOAST_ERROR("Verification failed. Please try again.");
        } finally {
            setLoader(false);
        }
    };

    const handleResend = async () => {
        setLoader(true);
        try {
            const res = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: temLogin?.email }),
            });

            const responseData = await res.json();
            if (responseData.code === CODES?.SUCCESS) {
                TOAST_SUCCESS(responseData.message);
            } else {
                TOAST_ERROR(responseData.message);
            }
        } catch (error) {
            console.error("Verification error:", error);
            TOAST_ERROR("Verification failed. Please try again.");
        } finally {
            setLoader(false);
        }
    };

    return (
        <>
            {is_loading && <Spinner isActive={is_loading} />}

            <div className="flex flex-col flex-1 lg:w-1/2 w-full">
                {/* Back Button (Optional - modeled after SignInForm commented out code) */}
                {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                    <Link
                    href="/signin"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                    <ChevronLeftIcon />
                    Back to Sign In
                    </Link>
                </div> */}

                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto ">
                    <div className="border !border-gray-200 rounded-lg py-6 px-12 ">
                        <div className="mb-3 sm:mb-5 ">
                            <h3 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 ">
                                Two Step Verification
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Enter the 6 digit code sent to your email.

                                <span className="text-brand-500"> {temLogin?.email}</span>
                            </p>
                        </div>

                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div
                                        className="flex gap-2 justify-between"
                                        onPaste={handlePaste}
                                    >
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    inputsRef.current[index] = el;
                                                }}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) =>
                                                    handleChange(e.target.value, index)
                                                }
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className="h-12 w-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-brand-500"
                                            />
                                        ))}
                                    </div>

                                    <div>
                                        <Button type="submit" className="w-full" size="sm">
                                            Verify OTP
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-5">
                                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                                    Didn’t get the code?{" "}
                                    <button className="text-brand-500 hover:text-brand-600 dark:text-brand-400 hover:underline" onClick={handleResend}>
                                        Resend
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
