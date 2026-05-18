"use client";
import { loginRedirection, storage, TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
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
import { useAuthStore } from "@/store/authStore";

export default function SignInForm() {

  // const { setLoader } = useInventoryStore();
  const [is_loading, setLoader] = useState(false);


  const router = useRouter();

  const methods = useForm({
    mode: "onSubmit", // Trigger validation only on submit
    reValidateMode: "onChange" // Re-validate on change after first submission attempt
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data: any) => {
    setLoader(true);
    try {

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data[ASSETS_INPUTS.EMAIL.name],
          password: data[ASSETS_INPUTS.PASSWORD.name],
        }),
      });

      const responseData = await res.json();

      if (responseData.code == CODES?.SUCCESS) {
        loginRedirection(responseData.data);
        router.replace("/dashboard");
        window.location.reload();
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

      <div className="w-full max-w-md mt-6 sm:mt-8 mx-auto mb-8 pl-4 lg:pl-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-full transition-all hover:text-brand-600 hover:border-brand-200 hover:shadow-sm"
        >
          <ChevronLeftIcon />
          Back to Home
        </Link>
      </div>

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
        <div className="border border-gray-200 rounded-[2rem] py-6 px-10 md:px-12 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-6 text-center sm:text-left">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
              Welcome Back
            </h3>
            <p className="text-base text-slate-500 font-medium">
              Enter your email and password to sign in securely.
            </p>
          </div>
          <div>

            <FormProvider {...methods}>
              <form method="post" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-4">
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
                    <Button type={'submit'} className="w-full" size="sm" loading={is_loading}>
                      Sign in
                    </Button>
                  </div>

                </div>
              </form>

            </FormProvider>

            <div className="mt-5 space-y-2 text-center sm:text-left">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Don&apos;t have an account? {""}
                <Link href="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-bold" >
                  Sign Up
                </Link>
              </p>
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Want to see a live demo? {""}
                <Link href="/demo-request" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold" >
                  Request Access
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
