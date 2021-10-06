export interface URL {
    short: string;
    long: string;
    usage: number;
    password?: string;
    protected?: boolean;
    title?: string;
}

export interface AdvancedOptionsStruct {
    password: string;
    customAddress: string;
    expiration: number;
    urlLength: number;
    message: string;
}
