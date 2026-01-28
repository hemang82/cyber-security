import AxiosClientApi from "@/lib/axios.services";
import { APIPaths } from "../APIPaths";
import { fetcher } from "@/lib/fetcher";
import { CODES, TEMP_URL } from "@/common/constant";

export async function addPartyAPI(request: any) {
    return await AxiosClientApi.post(APIPaths.ADD_PARTY, request)
}

export async function editPartyAPI(request: any) {
    return await AxiosClientApi.post(APIPaths.EDIT_PARTY, request)
}

export async function listPartyAPI(request: any) {

    // console.log("listPartyAPI" , APIPaths.LIST_PARTY, { method: "POST", body: request } , true);
    // return await fetcher(APIPaths.LIST_PARTY, { method: "POST", body: request } , true);
    try {
        const resList = await fetch(`http://localhost:4000${APIPaths.LIST_PARTY}`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request), // 👈 DIRECT PASS
        });

        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS) {
            return res.data;
        }
        return [];
    } catch (err: any) {
        console.log(err.message);
        return [];
    }
}