import { GroupIcon } from "@/icons";
import { TfiWorld } from "react-icons/tfi";
import { LuFileCode2 } from "react-icons/lu";
import { AiOutlineCloudServer } from "react-icons/ai";
import { IoCloudOutline } from "react-icons/io5";

export default function AssetsType() {

    let iconClass = 'text-gray-800 size-6 dark:text-white/90'

    const assets = [
        {
            image: <TfiWorld className={iconClass} />,
            title: "Web App",
            description: "Scan browser-based application hosted online"
        },
        {
            image: <LuFileCode2 className={iconClass} />,
            title: "API",
            description: "Scan browser-based application hosted online"
        },
        {
            image: <IoCloudOutline className={iconClass} />,
            title: "Cloud",
            description: "Scan browser-based application hosted online"
        }
    ]

    return (<>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                assets?.map((assets, index) => {
                    return <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 hover:border-brand-500 hover:cursor-pointer hover:shadow-lg " key={index}>
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
    </>)
}