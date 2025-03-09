import axios from "axios";

export interface GeoData {
    country?: string;
    region?: string;
    city?: string;
}

export async function getGeoFromIP(ip: string): Promise<GeoData> {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        return {
            country: response.data.country_code,
            region: response.data.region,
            city: response.data.city,
        };
    } catch (error) {
        console.error("Failed to get geo data:", error);
        return {};
    }
}
