export interface Errors {
    param?: string;
    message?: string | object;
}
export interface Exception {
    message?: string;
    errors: Errors[];
}
