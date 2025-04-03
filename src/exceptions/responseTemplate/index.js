class responseTemplate {
    constructor(statusCode, message, data) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
    }
    sendResponse(res) {
        res.status(this.statusCode).json({
            data: this.data,
            success: this.statusCode >= 200 && this.statusCode < 300,
            message: this.message,
        });
    }
}

export default responseTemplate;