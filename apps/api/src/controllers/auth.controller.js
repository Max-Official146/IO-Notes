import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

function signJwt(user) {
  return jwt.sign({ userId: user._id.toString(), email: user.email }, env.jwtSecret, { expiresIn: "7d" });
}

export async function signUp(req, res, next) {
  try {
    const input = authSchema.parse(req.body);
    const exists = await User.findOne({ email: input.email.toLowerCase() });
    if (exists) {
      throw new ApiError(409, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await User.create({
      email: input.email.toLowerCase(),
      passwordHash,
      name: input.name || "",
      provider: "email",
    });

    const token = signJwt(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
}

export async function signIn(req, res, next) {
  try {
    const input = authSchema.parse(req.body);
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signJwt(user);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
}
