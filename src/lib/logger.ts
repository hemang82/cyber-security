
export function apiLogger(url: string, method: string, body: any, status: number | string) {
    console.log(`[API LOG] | ${method} | ${url} | STATUS: ${status}`);
    if (body) {
        console.log(`[API REQUEST BODY]:`, body);
    }
}
