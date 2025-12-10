

require("dotenv").config();
import { Request, Response, NextFunction } from "express";

import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";

import { CatchAsyncError } from "../middleware/catchAsyncErrors"; // Ensure this file exists at the specified path
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken,accessTokenOptions,refreshTokenOptions, } from "../utils/jwt";
import { redis } from "../utils/redis";
import { error } from "console";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";

// Define interface for registration body
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

// Register user controller (original YouTuber style)
export const registrationUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, avatar } = req.body as IRegistrationBody;

            // Check if email already exists
            const isEmailExist = await userModel.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler("Email already exists", 400));
            }

            // Create user
            const user = await userModel.create({
                name,
                email,
                password,
                avatar: avatar ? { public_id: "", url: avatar } : undefined,
            });

            // Generate activation token
            const activationToken = createActivationToken(user);
            const activationCode = activationToken.activationCode;

            const data = {
                user: { name: user.name },
                activationCode,
            };

            // Render the EJS template
            const html = await ejs.renderFile(
                path.join(__dirname, "../mails/activation-mail.ejs"),
                data
            );

            try {
                await sendMail({
                    email: user.email,
                    subject: "Activate your account",
                    template: "activation-mail.ejs",
                    data,
                });

                res.status(201).json({
                    success: true,
                    message: `Please check your email: ${user.email} to activate your account!`,
                    activationToken: activationToken.token,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// Activation token function (original style)
interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET as Secret,
        { expiresIn: "5m" }
    );

    return { token, activationCode };
};
/*
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } = req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
*/
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } = req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      // Check if user already exists
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        // Update isVerified for existing user
        existUser.isVerified = true;
        await existUser.save();

        return res.status(200).json({
          success: true,
          message: "Account activated successfully",
        });
      }

      // If user does not exist, create a new one with isVerified true
      const user = await userModel.create({
        name,
        email,
        password,
        isVerified: true,
      });

      res.status(201).json({
        success: true,
        message: "Account activated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//login user:

interface ILoginRequest{
  email:string;
  password:string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      // If login successful, you can generate token here
      // const accessToken = user.SignAccessToken();

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Logout user
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clear cookies
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = req.user?._id ? String(req.user._id) : '';
        redis.del(userId);

        // Send response
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      // Skip if no refresh token
      if (!refresh_token) return next();

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN_SECRET as string
        ) as JwtPayload;
      } catch (err: any) {
        const message = err instanceof Error ? err.message : String(err);
        console.log("Invalid refresh token:", message);
        return next(); // skip refresh if invalid
      }

      const session = await redis.get(decoded.id as string);
      if (!session) return next(); // skip if no session

      const user = JSON.parse(session);

      // create new tokens
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "3d" }
      );

      // set cookies
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user), "EX", 604800);

      req.user = user;

      next(); // continue
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      console.log("updateAccessToken error:", message);
      next(); // do not throw 400, continue
    }
  }
);


// get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }
      await getUserById(String(userId), res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// social auth

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });

      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//social auth




// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //const { name, email } = req.body as IUpdateUserInfo;
      const { name } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;

      const user = await userModel.findById(userId);
       /*
      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exist", 400));
        }
        user.email = email;
      }
        */

      if (name && user) {
        user.name = name;
      }

      await user?.save();
      if (userId) {
        await redis.set(String(userId), JSON.stringify(user));
      }

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;


      if(!oldPassword || !newPassword) {
return next (new ErrorHandler("Please enter old and new password", 400)) }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;
      await user.save();
      if (req.user?._id) {
        await redis.set(req.user._id.toString(), JSON.stringify(user)); 
      }

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// update profile picture
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (avatar && user) {
        if (user?.avatar?.public_id) {
          // first delete the old image
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });

          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });

          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();
      if (userId) {
        await redis.set(String(userId), JSON.stringify(user));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// get all users --- only for admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);



// update user role only for admin

export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body; // Only email + role
      await updateUserRoleService(res, email, role);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);




 
// Delete user only for admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await user.deleteOne({ id });
      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
  

