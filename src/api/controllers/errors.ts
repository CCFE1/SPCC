import type { NextApiRequest, NextApiResponse } from "next";

export const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(401).json({ msg: "Error al procesar su petición" });
};
