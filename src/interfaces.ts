export interface URL {
    short: string;
    long: string;
    usage: number;
    password?: string;
    protected?: boolean;
    stats?: URLStats;        // New field for statistics
}

export interface AdvancedOptionsStruct {
    password: string;
    customAddress: string;
    expiration: number;
    urlLength: number;
    message: string;
}

export interface URLClickStats {
    timestamp: number;       // When the click happened
    ip?: string;             // IP address (anonymized)
    country?: string;        // Country code
    region?: string;         // Region/state
    city?: string;           // City
    userAgent?: string;      // Browser/device info
}

export interface URLStats {
    totalClicks: number;
    clicksByCountry: Record<string, number>;  // {"US": 42, "UK": 13, ...}
    clicksByDay: Record<string, number>;      // {"2023-01-01": 5, ...}
    recentClicks: URLClickStats[];            // Last 100 clicks
}
