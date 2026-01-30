import { GroupIcon } from "@/icons";
import { TfiWorld } from "react-icons/tfi";
import { LuFileCode2 } from "react-icons/lu";
import { AiOutlineCloudServer } from "react-icons/ai";
import { IoCloudOutline } from "react-icons/io5";
import { FormProvider, useForm } from "react-hook-form";
import { useInventoryStore } from "@/store";
import { TAB_KEY } from "@/common/commonVariable";

let iconClass = 'text-gray-800 size-6 dark:text-white/90'

export const assets = [
    {
        image: <TfiWorld className={iconClass} />,
        title: "Web App",
        key: 'web_app',
        description: "Scan browser-based application hosted online",
        is_show : true
    },
    {
        image: <LuFileCode2 className={iconClass} />,
        title: "API",
        key: 'api',
        description: "Scan browser-based application hosted online",
        is_show : false
    },
    {
        image: <IoCloudOutline className={iconClass} />,
        title: "Cloud",
        key: 'cloud',
        description: "Scan browser-based application hosted online",
        is_show : false
    }
]
export default function AssetsType() {

    const { assets_type, setAssetsType, setActiveTab } = useInventoryStore();

    const methods = useForm({
        mode: "onBlur", // validation timing
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
                assets?.map((assets, index) => {
                    return <div className={`rounded-2xl border border-gray-200  p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-5  ${assets.is_show ? 'hover:cursor-pointer hover:shadow-lg hover:border-brand-500 bg-white' : ' hover:shadow-lg hover:border-gray-100 bg-gray-100' } ${assets_type?.value == assets.key ? '!border-brand-500 shadow-lg' : ''}`} key={index} onClick={() => {assets.is_show && handleAssetSelect(assets)}}>

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