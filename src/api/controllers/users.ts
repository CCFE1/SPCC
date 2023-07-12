import { Collection } from "mongodb";
import type { Usuario } from "@models/interfaces";
import { checkStrings } from "../utils/validations";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOne, DbServiceResponse } from "../services/dbServices";
import { createToken } from "../services/jwtServices";

export const login = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userCollection: Collection,
) => {
  const { nickname, pass }: Usuario = req.body;
  if (!checkStrings([nickname, pass])) {
    return res.status(401).json({
      msg: "Contraseña y/o usuario incorrectos",
    });
  }

  const result: DbServiceResponse = await getOne(userCollection, { nickname });
  if (result.err) {
    return res.status(500).json({
      msg: "Error al conectar con la base de datos",
    });
  }

  const user: Usuario | null = result.data;
  if (!user || pass !== user.pass) {
    return res.status(401).json({
      msg: "Contraseña y/o usuario incorrectos",
    });
  }

  const token: string = createToken({
    _id: user._id,
    nickname: user.nickname,
    rol: user.rol,
  });

  return res.json({
    token,
  });
};
