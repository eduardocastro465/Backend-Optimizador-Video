import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import { asyncHandler, throwError } from "../utils/asyncHandler.js";
import AuthModel from "../models/auth/Auth.model.js";
import { modoProduction } from "../config.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleAuth = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body as { token: string };

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }

    const {
      given_name = "",
      family_name = "",
      email,
      picture = "",
      sub,
    } = payload;

    if (!email || !sub) {
      throwError("No se pudo obtener la información del usuario", 401);
      return;
    }

    const { tokenAuth, user } = await AuthModel.loginAuthGogle(
      given_name,
      family_name,
      email,
      picture,
      sub,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: modoProduction,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    });

    res.status(200).json({ tokenAuth, user });
  },
);
