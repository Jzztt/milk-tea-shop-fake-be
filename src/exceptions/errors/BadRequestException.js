class BadRequestException extends Error{
    constructor(message = 'Bad Request') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = 400; // Thiết lập má lỗi HTTP mặc định
        Error.captureStackTrace(this, this.constructor);

    }
}

export default BadRequestException;