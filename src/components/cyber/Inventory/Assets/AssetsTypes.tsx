"use client"
import { GroupIcon } from "@/icons";
import { TfiWorld } from "react-icons/tfi";
import { LuFileCode2 } from "react-icons/lu";
import { AiOutlineCloudServer } from "react-icons/ai";
import { IoCloudOutline, IoPhonePortraitOutline } from "react-icons/io5";
import { FormProvider, useForm } from "react-hook-form";
import { useInventoryStore } from "@/store";
import { TAB_KEY } from "@/common/commonVariable";

let iconClass = 'text-gray-800 size-6 dark:text-white/90'

export const ASSETS_KEYS = {
    web: "web_app",
    app: "app",
    cloud: "cloud",
    api: "api",
}

export const ASSETS = [
    {
        image: <TfiWorld className={iconClass} />,
        title: "Website",
        key: ASSETS_KEYS.web,
        description: "Scan browser-based application hosted online",
        is_show: true
    },
    {
        image: <IoPhonePortraitOutline className={iconClass} />,
        title: "Application",
        key: ASSETS_KEYS.app,
        description: "Scan Android mobile applications",
        is_show: true
    },
    {
        image: <IoCloudOutline className={iconClass} />,
        title: "Cloud",
        key: ASSETS_KEYS.cloud,
        description: "Scan cloud based application hosted online",
        is_show: true
    },
    // {
    //     image: <LuFileCode2 className={iconClass} />,
    //     title: "API",
    //     key: ASSETS_KEYS.api,
    //     description: "Scan browser-based application hosted online",
    //     is_show: false
    // }
]

export const FINDINGS_COLORS = {
    [ASSETS_KEYS.web]: "#10b981ce", // red
    [ASSETS_KEYS.app]: "#3b83f6bd",   // yellow
    [ASSETS_KEYS.cloud]: "#94a3b8",     // orange
    [ASSETS_KEYS.api]: "#10b981ce",      // blue
    Critical: "#ef4444d2", // red
    High: "#f97416d3",     // orange
    Medium: "#eab20896",   // yellow
    Low: "#10b981ce",      // blue
    Info: "#3b83f6bd",     // gray
    Unknown: "#94a3b8",  // gray (fallback)
    ["critical risk"]: "#ef4444d2",
    ["high risk"]: "#f97416d3",
    ["safe"]: "#10b981ce",
    ["medium risk"]: "#eab20896",
    ["low risk"]: "#3b83f6bd",
    ["High Risk"]: "#ef4444d2",
    ["Low Risk"]: "#3b83f6bd",
    ["Medium Risk"]: "#eab20896",
};

export default function AssetsType() {

    const { assets_type, setAssetsType, setActiveTab } = useInventoryStore();

    const methods = useForm({
        mode: "onSubmit", // Trigger validation only on submit
        reValidateMode: "onChange" // Re-validate on change after first submission attempt
    });

    const handleAssetSelect = (data: any) => {
        console.log("AssetsType FORM DATA 👉", data);
        setAssetsType({
            value: data?.key,
            is_valid: true,
        });
        setActiveTab(TAB_KEY.ASSETS_DETAILS);
    };

    return (<>
        {/* <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                ASSETS?.map((assets, index) => {
                    return <div className={`rounded-2xl border border-gray-200  p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-5  ${assets.is_show ? 'hover:cursor-pointer hover:shadow-lg hover:border-brand-500 bg-white' : ' hover:shadow-lg hover:border-gray-100 bg-gray-100'} ${assets_type?.value == assets.key ? '!border-brand-500 shadow-lg' : ''}`} key={index} onClick={() => { assets.is_show && handleAssetSelect(assets) }}>
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            {assets.image}
                        </div>

                        <div className="flex items-end justify-between ">
                            <div>
                                <h6 className="mt-2 font-semibold text-gray-800 text-xl text-title-sm dark:text-white/90">
                                    {assets.title}
                                </h6>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {assets.description}
                                </span>
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
        {/* </form>
        </FormProvider> */}
    </>)
}