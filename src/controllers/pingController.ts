import { Request, Response } from "express";

export const pingCheck = (__: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Ping alive",
  });
};
