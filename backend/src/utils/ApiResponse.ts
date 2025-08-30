class ApiResponse<T> {
    public success: boolean;
    public statusCode: number;
    public data: T | null;
    public message?: string;

    constructor(success: boolean, statusCode: number, data: T | null = null, message?: string) {
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message ?? 'Success';
    }
}

export { ApiResponse };
