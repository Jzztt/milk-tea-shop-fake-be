import Joi from "joi";

const registerSchemaValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Mật khẩu không được để trống",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
});

const loginSchemaValidation = Joi.object({
  email: registerSchemaValidation.extract("email"),
  password: registerSchemaValidation.extract("password"),
});

export { registerSchemaValidation, loginSchemaValidation };
