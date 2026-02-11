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

  const methods = useForm({ mode: "onBlur" });
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

      const res = await fetch("/api/verify", {
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
        <div className="border !border-gray-200 rounded-lg py-6 px-6 ">
          <div className="mb-5 sm:mb-8">
            <h3 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 ">
              Sign Up
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
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
                <div className="space-y-6">

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
                    <Button type={'submit'} className="w-full" size="sm" >
                      Sign in
                    </Button>
                  </div>

                </div>
              </form>

            </FormProvider>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 ms-1" >
                  Sign In
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
