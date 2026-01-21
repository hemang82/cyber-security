// formElement

//   <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//         <div className="space-y-6">
//           <DefaultInputs />
//           <SelectInputs />
//           <TextAreaInput />
//           <InputStates />
//         </div>
//         <div className="space-y-6">
//           <InputGroup />
//           <FileInputExample />
//           <CheckboxComponents />
//           <RadioButtons />
//           <ToggleSwitch />
//           <DropzoneComponent />
//         </div>


// export default function BlankPage() {
//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Blank Page" />
//       <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
//         <div className="mx-auto w-full max-w-[630px] text-center">
//           <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
//             Card Title Here
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
//             Start putting content on grids or panels, you can also use different
//             combinations of grids.Please check out the dashboard and other pages
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

{/* <ComponentCard title="Outline Button with Left Icon">
          <div className="flex items-center gap-5">
            <Button size="sm" variant="outline" startIcon={<BoxIcon />}>
              Button Text
            </Button>
            <Button size="md" variant="outline" startIcon={<BoxIcon />}>
              Button Text
            </Button>
          </div>
        </ComponentCard>{" "} */}


        // export default function BadgePage() {
        //   return (
        //     <div>
        //       <PageBreadcrumb pageTitle="Badges" />
        //       <div className="space-y-5 sm:space-y-6">
        //         <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        //           <div className="px-6 py-5">
        //             <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        //               With Light Background
        //             </h3>
        //           </div>
        //           <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
        //             <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        //               {/* Light Variant */}
        //               <Badge variant="light" color="primary">
        //                 Primary
        //               </Badge>
        //               <Badge variant="light" color="success">
        //                 Success
        //               </Badge>{" "}
        //               <Badge variant="light" color="error">
        //                 Error
        //               </Badge>{" "}
        //               <Badge variant="light" color="warning">
        //                 Warning
        //               </Badge>{" "}
        //               <Badge variant="light" color="info">
        //                 Info
        //               </Badge>
        //               <Badge variant="light" color="light">
        //                 Light
        //               </Badge>
        //               <Badge variant="light" color="dark">
        //                 Dark
        //               </Badge>
        //             </div>
        //           </div>
        //         </div>
        
        //         <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        //           <div className="px-6 py-5">
        //             <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        //               With Solid Background
        //             </h3>
        //           </div>
        //           <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
        //             <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        //               {/* Light Variant */}
        //               <Badge variant="solid" color="primary">
        //                 Primary
        //               </Badge>
        //               <Badge variant="solid" color="success">
        //                 Success
        //               </Badge>{" "}
        //               <Badge variant="solid" color="error">
        //                 Error
        //               </Badge>{" "}
        //               <Badge variant="solid" color="warning">
        //                 Warning
        //               </Badge>{" "}
        //               <Badge variant="solid" color="info">
        //                 Info
        //               </Badge>
        //               <Badge variant="solid" color="light">
        //                 Light
        //               </Badge>
        //               <Badge variant="solid" color="dark">
        //                 Dark
        //               </Badge>
        //             </div>
        //           </div>
        //         </div>
        
        //         <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        //           <div className="px-6 py-5">
        //             <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        //               Light Background with Left Icon
        //             </h3>
        //           </div>
        //           <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
        //             <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        //               <Badge variant="light" color="primary" startIcon={<PlusIcon />}>
        //                 Primary
        //               </Badge>
        //               <Badge variant="light" color="success" startIcon={<PlusIcon />}>
        //                 Success
        //               </Badge>{" "}
        //               <Badge variant="light" color="error" startIcon={<PlusIcon />}>
        //                 Error
        //               </Badge>{" "}
        //               <Badge variant="light" color="warning" startIcon={<PlusIcon />}>
        //                 Warning
        //               </Badge>{" "}
        //               <Badge variant="light" color="info" startIcon={<PlusIcon />}>
        //                 Info
        //               </Badge>
        //               <Badge variant="light" color="light" startIcon={<PlusIcon />}>
        //                 Light
        //               </Badge>
        //               <Badge variant="light" color="dark" startIcon={<PlusIcon />}>
        //                 Dark
        //               </Badge>
        //             </div>
        //           </div>
        //         </div>
        
        //         <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        //           <div className="px-6 py-5">
        //             <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        //               Solid Background with Left Icon
        //             </h3>
        //           </div>
        //           <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
        //             <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        //               <Badge variant="solid" color="primary" startIcon={<PlusIcon />}>
        //                 Primary
        //               </Badge>
        //               <Badge variant="solid" color="success" startIcon={<PlusIcon />}>
        //                 Success
        //               </Badge>{" "}
        //               <Badge variant="solid" color="error" startIcon={<PlusIcon />}>
        //                 Error
        //               </Badge>{" "}
        //               <Badge variant="solid" color="warning" startIcon={<PlusIcon />}>
        //                 Warning
        //               </Badge>{" "}
        //               <Badge variant="solid" color="info" startIcon={<PlusIcon />}>
        //                 Info
        //               </Badge>
        //               <Badge variant="solid" color="light" startIcon={<PlusIcon />}>
        //                 Light
        //               </Badge>
        //               <Badge variant="solid" color="dark" startIcon={<PlusIcon />}>
        //                 Dark
        //               </Badge>
        //             </div>
        //           </div>
        //         </div>
        
        //         <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        //           <div className="px-6 py-5">
        //             <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        //               Light Background with Right Icon
        //             </h3>
        //           </div>
        //           <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
        //             <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        //               <Badge variant="light" color="primary" endIcon={<PlusIcon />}>
        //                 Primary
        //               </Badge>
        //               <Badge variant="light" color="success" endIcon={<PlusIcon />}>
        //                 Success
        //               </Badge>{" "}
        //               <Badge variant="light" color="error" endIcon={<PlusIcon />}>
        //                 Error
        //               </Badge>{" "}
        //               <Badge variant="light" color="warning" endIcon={<PlusIcon />}>
        //                 Warning
        //               </Badge>{" "}
        //               <Badge variant="light" color="info" endIcon={<PlusIcon />}>
        //                 Info
        //               </Badge>
        //               <Badge variant="light" color="light" endIcon={<PlusIcon />}>
        //                 Light
        //               </Badge>
        //               <Badge variant="light" color="dark" endIcon={<PlusIcon />}>
        //                 Dark
        //               </Badge>
        //             </div>
        //           </div>
        //         </div>
        
        //         <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        //           <div className="px-6 py-5">
        //             <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
        //               Solid Background with Right Icon
        //             </h3>
        //           </div>
        //           <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
        //             <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
        //               <Badge variant="solid" color="primary" endIcon={<PlusIcon />}>
        //                 Primary
        //               </Badge>
        //               <Badge variant="solid" color="success" endIcon={<PlusIcon />}>
        //                 Success
        //               </Badge>{" "}
        //               <Badge variant="solid" color="error" endIcon={<PlusIcon />}>
        //                 Error
        //               </Badge>{" "}
        //               <Badge variant="solid" color="warning" endIcon={<PlusIcon />}>
        //                 Warning
        //               </Badge>{" "}
        //               <Badge variant="solid" color="info" endIcon={<PlusIcon />}>
        //                 Info
        //               </Badge>
        //               <Badge variant="solid" color="light" endIcon={<PlusIcon />}>
        //                 Light
        //               </Badge>
        //               <Badge variant="solid" color="dark" endIcon={<PlusIcon />}>
        //                 Dark
        //               </Badge>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   );
        // }
        

        // export default function VideosExample() {
        //   return (
        //     <div>
        //       <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2">
        //         <div className="space-y-5 sm:space-y-6">
        //           <ComponentCard title="Video Ratio 16:9">
        //             <YouTubeEmbed videoId="dQw4w9WgXcQ" />
        //           </ComponentCard>
        //           <ComponentCard title="Video Ratio 4:3">
        //             <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="4:3" />
        //           </ComponentCard>
        //         </div>
        //         <div className="space-y-5 sm:space-y-6">
        //           <ComponentCard title="Video Ratio 21:9">
        //             <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="21:9" />
        //           </ComponentCard>
        //           <ComponentCard title="Video Ratio 1:1">
        //             <YouTubeEmbed videoId="dQw4w9WgXcQ" aspectRatio="1:1" />
        //           </ComponentCard>
        //         </div>
        //       </div>
        //     </div>
        //   );
        // }