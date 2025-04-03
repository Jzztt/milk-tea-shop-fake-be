import {
  registerSchemaValidation,
  loginSchemaValidation,
} from "../validations/auth";
import User from "../models/UserModel";
import BadRequestException from "../exceptions/errors/BadRequestException";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { error } = loginSchemaValidation.validate(
        { password, email },
        {
          abortEarly: false,
        }
      );
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: errors,
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new BadRequestException("Email hoặc mật khẩu này không tìm thấy");
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        throw new BadRequestException("Mật khẩu không hợp lệ");
      }
      const { ACCESS_TOKEN_EXPIRE, ACCESS_TOKEN_SECRET } = process.env;
      const accessToken = jwt.sign(
        { _id: user._id, username: user.username, role: user.role },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRE,
        }
      );
      // const refreshToken = jwt.sign({ _id: user._id }, "refresh-token-secret", {
      //   expiresIn: "30d",
      // });
      res.status(200).json({
        data: { email: user.email, accessToken },
        success: true,
        message: "Login successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;
      const { error } = registerSchemaValidation.validate(
        { username, email, password },
        {
          abortEarly: false,
        }
      );

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: errors,
        });
      }
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        throw new BadRequestException("Email đã tồn tại");
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role ? role : "user",
      });

      const { _id, username: usernameUser, email: emailUser } = user;
      res.status(201).json({
        data: [{ _id, username: usernameUser, email: emailUser }],
        success: true,
        message: "Create user successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}

export default AuthController;
