export interface URL {
    short: string;
    long: string;
    usage: number;
    password?: string;
    protected?: boolean;
}

export interface AdvancedOptionsStruct {
    password: string;
    customAddress: string;
    expiration: number;
    length: number;
    message: string;
}
