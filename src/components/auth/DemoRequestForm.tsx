"use client";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Link from "next/link";
import { FiUser, FiMail, FiBriefcase, FiMessageSquare, FiCheckCircle, FiChevronLeft, FiArrowRight } from "react-icons/fi";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import { TOAST_SUCCESS, TOAST_ERROR } from "@/common/commonFunction";

export default function DemoRequestForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    mode: "onSubmit"
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Mock API call for demo request
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("Demo Request Submitted:", data);
      setIsSubmitted(true);
      TOAST_SUCCESS("Demo request submitted successfully!");
    } catch (error) {
      TOAST_ERROR("Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    const userEmail = methods.getValues("email");
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 flex-1">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <FiCheckCircle size={40} />
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Request Received!</h3>
        <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm mb-10">
          Our security team will review your application and send your demo credentials to <span className="text-brand-600 font-bold">{userEmail}</span> within 24 hours.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl text-base font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-500/20">
          Return to Home <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
      <div className="w-full max-w-md mt-6 sm:mt-8 mx-auto mb-8 pl-4 lg:pl-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-full transition-all hover:text-brand-600 hover:border-brand-200 hover:shadow-sm"
        >
          <FiChevronLeft /> Back to Home
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="border border-gray-200 rounded-[2rem] py-6 px-10 md:px-12 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-6 text-center sm:text-left">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
              Request Demo
            </h3>
            <p className="text-base text-slate-500 font-medium">
              Enter your details to receive specialized demo access.
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input
                  name="fullName"
                  placeholder="Enter your name"
                  type={INPUT_TYPE.TEXT}
                  rules={{ required: "Name is required" }}
                />
              </div>

              <div>
                <Label>Work Email <span className="text-red-500">*</span></Label>
                <Input
                  name="email"
                  placeholder="Enter your email"
                  type={INPUT_TYPE.EMAIL}
                  rules={{
                    required: "Work email is required",
                    pattern: {
                      value: INPUT_PATTERN.EMAIL.pattern,
                      message: "Please enter a valid work email"
                    }
                  }}
                />
              </div>

              <div>
                <Label>Company Name <span className="text-red-500">*</span></Label>
                <Input
                  name="company"
                  placeholder="Enter your company"
                  type={INPUT_TYPE.TEXT}
                  rules={{ required: "Company name is required" }}
                />
              </div>

              <div>
                <Label>Requirements</Label>
                <textarea
                  {...methods.register("message")}
                  className="w-full bg-transparent border border-gray-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 min-h-[80px] text-sm font-medium transition-all"
                  placeholder="Quick description of your needs..."
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full py-3 rounded-lg text-base font-bold shadow-sm" loading={isLoading}>
                  Submit Request
                </Button>
              </div>

              <p className="text-xs text-center text-slate-400 font-medium leading-relaxed pt-2">
                By submitting, you agree to our <Link href="/terms" className="text-brand-600 hover:underline">Terms</Link> and <Link href="/privacy" className="text-brand-600 hover:underline">Privacy</Link>.
              </p>

              <div className="pt-4 mt-4 border-t border-slate-50">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                  Already have demo credentials? {""}
                  <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-bold" >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
