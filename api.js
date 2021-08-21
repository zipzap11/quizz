export default async function apiCall(key) {
    const response = await fetch(key);
    let data = await response.json();
    return data;
}