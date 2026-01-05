import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { TabContent } from "../AddInventory";
import Input from "@/components/form/input/InputField";
import { FormProvider, useForm } from "react-hook-form";
import { ASSETS_INPUTS } from "./AddAssets";
import { INPUT_PATTERN } from "@/common/commonVariable";

export default function Credentials() {

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const onSubmit = (data: any) => {
        console.log("FORM DATA 👉", data);
    };

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    {/* <form className="space-y-6"> */}
                    <TabContent title="Credentials">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <Label>Website URL</Label>
                                <Input type="text"
                                    placeholder="Website URL"
                                    name={ASSETS_INPUTS.WEBSITE_URL.name}
                                    rules={{
                                        required: ASSETS_INPUTS.WEBSITE_URL.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.WEBSITE.pattern,
                                            message: INPUT_PATTERN.WEBSITE.message,
                                        },
                                    }}
                                />
                            </div>

                        </div>
                    </TabContent>
                    {/* </form> */}
                </div >

                <div className="flex justify-center m-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white rounded px-6 py-2" >
                        Submit
                    </button>
                </div>
            </form>
        </FormProvider>
    </>)
    
}