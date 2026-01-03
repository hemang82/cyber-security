
/**
 * Fetch IPO list (server-side)
 * Always fresh per request
 */


export async function getIPOsServer(request) {
    try {
        
        // const res = await ipoListApi(request);
        // if (res?.meta?.status_code == 200) {
        //     console.log('res?.datares?.datares?.data', res?.data);
            
        //     return res?.data?.results?.length > 0 ? res?.data : [];
        // } else {
        //     return [];
        // }
    } catch (err) {
        console.error("Error fetching IPO list:", err);
        return [];
    }
}
