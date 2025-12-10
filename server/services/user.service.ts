import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";
import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler"; 
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export default cloudinary;

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Get All users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};


// update user role


export const updateUserRoleService = async (res: Response, email: string, role: string) => {
  // Find user by email (case-insensitive)
  const user = await userModel.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found in database",
    });
  }

  // Update role
  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
};