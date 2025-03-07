export interface URL {
    short: string;
    long: string;
    usage: number;
    password?: string;
    protected?: boolean;
    stats?: URLStats; // New field for statistics
}

export interface AdvancedOptionsStruct {
    password: string;
    customAddress: string;
    expiration: number;
    urlLength: number;
    message: string;
}

export interface URLClickStats {
    timestamp: { isoString: string }; // When the click happened
    country?: string; // Country code
    region?: string; // Region/state
    city?: string; // City
    userAgent?: string; // Browser/device info
}

export interface URLStats {
    totalClicks: number;
    clicksByCountry: Record<string, URLClickStats[]>; // {"US": 42, "UK": 13, ...}
    clicksByDay: Record<string, URLClickStats[]>; // {"2023-01-01": 5, ...}
    recentClicks: { data: URLClickStats[] }; // Last 100 clicks
}
