import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { TabContent } from "../AddInventory";
import Input from "@/components/form/input/InputField";

export default function Credentials() {
    return (<>
        <form className=" ">

            <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                {/* <form className="space-y-6"> */}
                <TabContent title="Credentials">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>
                            <Label>Start URL</Label>
                            <Input type="text" placeholder="Assets Name" />
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

    </>)
}