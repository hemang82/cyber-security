"use client";
import { storage, TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import CONSTENT, { CODES } from "@/common/constant";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ASSETS_INPUTS } from "../cyber/Inventory/Assets/AddAssets";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { useInventoryStore } from "@/store";
import Spinner from "../common/Spinner";

export default function SignInForm() {

  // const { setLoader } = useInventoryStore();
  const [is_loading, setLoader] = useState(false);

  const router = useRouter();

  const methods = useForm({
    mode: "onBlur", // validation timing
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault(); // 🔥 REQUIRED — stops page reload
    localStorage.setItem(MIDDLEWARE_COOKIE_KEYS?.LOGIN_KEY_COOKIE, JSON.stringify(true));
    router.push("/");
  };

  // React/Next.js Component ma
  // async function handleLogin(email, password) {
  //   const response = await fetch('/api/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password })
  //   });

  //   const data = await response.json();

  //   if (data.success) {
  //     // Login successful
  //     console.log("User:", data.data.user);
  //     console.log("Token:", data.data.token);
  //   } else {
  //     // Login failed
  //     console.error("Error:", data.message);
  //   }
  // }

  // const onSubmit = (data: any) => {
  //   console.log("FORM DATA 👉", data);
  //   // setAssetsDetails({
  //   //   value: data,
  //   //   is_valid: true,
  //   // });
  //   localStorage.setItem(CONSTENT?.LOGIN_KEY, JSON.stringify(true));
  //   router.push("/");
  // };

  const onSubmit = async (data: any) => {
    setLoader(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data[ASSETS_INPUTS.EMAIL.name],
          password: data[ASSETS_INPUTS.PASSWORD.name],
        }),
      });

      const responseData = await res.json();

      if (responseData.code === CODES?.SUCCESS) {
        router.replace("/"); // ✅ direct home
      } else {
        TOAST_ERROR(responseData.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      TOAST_ERROR("Something went wrong. Please try again.");
    } finally {
      setLoader(false); // ✅ always stop loader
    }
  };

  return (<>

    {is_loading && <Spinner isActive={is_loading} />}

    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div> */}

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto ">
        {/* <div className="w-full max-w-md mx-auto mb-5 mb-10 flex justify-center">
          <Image
            src="/images/logo/logo.png"
            alt="Logo"
            width={200}
            height={48}
            priority
          />
        </div> */}
        <div className="border !border-gray-200 rounded-lg py-6 px-12 ">

          <div className="mb-3 sm:mb-5 ">
            <h3 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 ">
              Sign In
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>

            <FormProvider {...methods}>
              <form method="post" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type={INPUT_TYPE?.EMAIL}
                      placeholder={ASSETS_INPUTS?.EMAIL?.placeholder}
                      name={ASSETS_INPUTS.EMAIL.name}
                      rules={{
                        required: ASSETS_INPUTS.EMAIL.validation,
                        pattern: {
                          value: INPUT_PATTERN.EMAIL.pattern,
                          message: INPUT_PATTERN.EMAIL.message,
                        },
                      }}
                    />
                  </div>

                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? INPUT_TYPE?.TEXT : INPUT_TYPE?.PASSWORD}
                        placeholder={ASSETS_INPUTS?.PASSWORD?.placeholder}
                        name={ASSETS_INPUTS?.PASSWORD?.name}
                        rules={{
                          required: ASSETS_INPUTS.PASSWORD.validation,
                          // pattern: {
                          //   value: INPUT_PATTERN.PASSWORD.pattern,
                          //   message: INPUT_PATTERN.PASSWORD.message,
                          // },
                        }}
                      />
                      <span onClick={() => setShowPassword(!showPassword)} className={`absolute z-30 -translate-y-1/2 cursor-pointer right-4 ${methods?.formState?.errors[ASSETS_INPUTS?.PASSWORD?.name] ? "top-6" : "top-1/2"}`} >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me logged in
                      </span>
                    </div>
                    {/* <Link
                      href="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </Link> */}
                  </div>

                  <div>
                    <Button type={'submit'} className="w-full" size="sm" >
                      Sign in
                    </Button>
                  </div>

                </div>
              </form>

            </FormProvider>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link href="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400" >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
