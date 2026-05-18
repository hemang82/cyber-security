"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Button from "../ui/button/Button";
import { FormProvider, useForm } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import { ASSETS_INPUTS } from "../cyber/Inventory/Assets/AddAssets";
import { CODES } from "@/common/constant";
import { useRouter } from "next/navigation";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import Image from "next/image";
import { useInventoryStore } from "@/store";
import Spinner from "../common/Spinner";
import { useAuthStore } from "@/store/authStore";

export default function SignUpForm() {
  const setTemLogin = useAuthStore((s) => s.setTemLogin);
  const temLogin = useAuthStore((state) => state.temLogin);

  const [is_loading, setLoader] = useState(false);

  const methods = useForm({
    mode: "onSubmit", // Trigger validation only on submit
    reValidateMode: "onChange" // Re-validate on change after first submission attempt
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data: any) => {
    console.log("signup data", data);
    setLoader(true);

    try {
      const req = {
        name: data[ASSETS_INPUTS.NAME.name],
        email: data[ASSETS_INPUTS.EMAIL.name],
        password: data[ASSETS_INPUTS.PASSWORD.name],
        contact_number: data[ASSETS_INPUTS.PHONE_NUMBER.name],
        company_name: data[ASSETS_INPUTS.COMPANY_NAME.name],
      };

      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data[ASSETS_INPUTS.EMAIL.name] }),
      });

      const responseData = await res.json();

      if (responseData.code === CODES?.SUCCESS) {
        TOAST_SUCCESS(responseData.message);
        setTemLogin(req)
        router.replace("/verify");
      } else {
        TOAST_ERROR(responseData.message);
      }

    } catch (error: any) {

      console.error("Signup error:", error);
      TOAST_ERROR("Something went wrong. Please try again.");

    } finally {
      setLoader(false); // ✅ always stop loader
    }
  };

  return (<>
    {is_loading && <Spinner isActive={is_loading} />}

    <div className="flex flex-col flex-1  w-full overflow-y-auto no-scrollbar">

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
              Create Account
            </h3>
            <p className="text-base text-slate-500 font-medium">
              Join the most secure platform. Fill in your details below.
            </p>
          </div>
          <div>

            {/* <div className="flex justify-center mb-2">
              <Image
                width={200}
                height={48}
                src="/images/logo/logo.png"
                alt="Logo"
              />
            </div> */}

            <FormProvider {...methods}>
              <form method="post" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-4">

                  <div>
                    <Label>
                      Name <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type={INPUT_TYPE?.TEXT}
                      placeholder={ASSETS_INPUTS?.NAME?.placeholder}
                      name={ASSETS_INPUTS.NAME.name}
                      rules={{
                        required: ASSETS_INPUTS.NAME.validation,
                        pattern: {
                          value: INPUT_PATTERN.NAME.pattern,
                          message: INPUT_PATTERN.NAME.message,
                        },
                      }}
                    />
                  </div>

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
                          pattern: {
                            value: INPUT_PATTERN.PASSWORD.pattern,
                            message: INPUT_PATTERN.PASSWORD.message,
                          },
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

                  <div>
                    <Label>
                      Phone Number <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type={INPUT_TYPE?.TEXT}
                      placeholder={ASSETS_INPUTS?.PHONE_NUMBER?.placeholder}
                      name={ASSETS_INPUTS.PHONE_NUMBER.name}
                      rules={{
                        required: ASSETS_INPUTS.PHONE_NUMBER.validation,
                        pattern: {
                          value: INPUT_PATTERN.MOBILE.pattern,
                          message: INPUT_PATTERN.MOBILE.message,
                        },
                      }}
                    />
                  </div>

                  <div>
                    <Label>
                      Company Name <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type={INPUT_TYPE?.TEXT}
                      placeholder={ASSETS_INPUTS?.COMPANY_NAME?.placeholder}
                      name={ASSETS_INPUTS.COMPANY_NAME.name}
                      rules={{
                        required: ASSETS_INPUTS.COMPANY_NAME.validation,
                        // pattern: {
                        //   value: INPUT_PATTERN.MOBILE.pattern,
                        //   message: INPUT_PATTERN.MOBILE.message,
                        // },
                      }}
                    />
                  </div>

                  {/* <div className="flex items-center justify-between"> */}
                  {/* <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me logged in
                      </span>
                    </div> */}
                  {/* <Link
                      href="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </Link> */}
                  {/* </div> */}

                  <div>
                    <Button type={'submit'} className="w-full" size="sm" loading={is_loading}>
                      Sign Up
                    </Button>
                  </div>

                </div>
              </form>

            </FormProvider>

            <div className="mt-5 space-y-2 text-center sm:text-left">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Already have an account?
                <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-bold ms-1" >
                  Sign In
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
