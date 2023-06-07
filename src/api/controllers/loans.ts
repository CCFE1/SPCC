import { Collection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  ReturnLoanData,
  Prestamo,
  MetaDispositivo,
  Tag,
  DataToSend,
  ModifyData,
} from "@models/interfaces";

import {
  getOne,
  saveOne,
  getAll,
  updateOne,
  DbServiceResponse,
} from "../services/dbServices";

export const uploadLoan = async (
  req: NextApiRequest,
  res: NextApiResponse,
  loanCollection: Collection,
  deviceCollection: Collection
) => {
  const data: Prestamo = req.body;
  const dispositivos: MetaDispositivo[] = data.dispositivos.map(
    (device: MetaDispositivo) => {
      return {
        ...device,
        actives: device.localPrestado,
      };
    }
  );

  const prestamo: Prestamo = {
    ...data,
    dispositivos,
  };

  // Aumentando la cantidad prestada de cada dispositivo
  // en el préstamo
  for (let dispositivo of dispositivos) {
    const result: DbServiceResponse = await updateOne(
      deviceCollection,
      { _id: dispositivo._id },
      {
        $inc: { prestado: dispositivo.localPrestado },
      }
    );

    // Si falla la actualización
    if (result.err) {
      return res.status(500).json({
        err: true,
        msg: "Error al guardar el préstamo en la base de datos",
      });
    }
  }

  // Guardando el préstamo
  const result: DbServiceResponse = await saveOne(loanCollection, prestamo);
  if (result.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al guardar el préstamo en la base de datos",
    });
  }

  res.json({
    err: false,
    msg: "Préstamo realizado con éxito",
  });
};

export const getAllLoans = async (
  req: NextApiRequest,
  res: NextApiResponse,
  loanCollection: Collection
) => {
  const response: DbServiceResponse = await getAll(loanCollection);
  if (response.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al obtener los prestamos de la base de datos",
    });
  }

  res.status(200).json({
    ...response,
    msg: "Lista de préstamos obtenida con éxito",
  });
};

export const getActiveLoans = async (
  req: NextApiRequest,
  res: NextApiResponse,
  loanCollection: Collection
) => {
  const response: DbServiceResponse = await getAll(loanCollection, {
    status: "activo",
  });
  if (response.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al obtener los prestamos activos de la base de datos",
    });
  }

  res.status(200).json({
    ...response,
    msg: "Lista de préstamos activos obtenida con éxito",
  });
};

export const returnLoan = async (
  req: NextApiRequest,
  res: NextApiResponse,
  loanCollection: Collection,
  deviceCollection: Collection
) => {
  const { loanID, returnedDevices }: ReturnLoanData = req.body;

  // Obteniendo préstamo
  let result: DbServiceResponse = await getOne(loanCollection, loanID);
  if (result.err || !result.data || !returnedDevices.length) {
    return res.status(500).json({
      err: true,
      msg: "Error al regresar el préstamo en la base de datos",
    });
  }

  // Si el préstamo ya está inactivo no se deberia hacer algo
  const loan: Prestamo = result.data;
  if (loan.status === "inactivo") {
    return res.status(400).json({
      err: true,
      msg: "El préstamo que quiere regresar ya se encuentra inactivo",
    });
  }

  // Regresando los dispositivos prestados
  for (let dispositivo of returnedDevices) {
    const result: DbServiceResponse = await updateOne(
      deviceCollection,
      { _id: dispositivo.id },
      {
        $inc: { prestado: -dispositivo.value },
      }
    );

    // Si falla la actualización
    if (result.err) {
      return res.status(500).json({
        err: true,
        msg: "Error al regresar el préstamo en la base de datos",
      });
    }
  }

  // Modificar los dispositivos activos
  const allDevices: MetaDispositivo[] = loan.dispositivos.map(
    (device: MetaDispositivo) => {
      const returnedDevice: Tag | undefined = returnedDevices.find(
        (item: Tag) => item.id === device._id
      );

      const actives: number =
        !!returnedDevice && typeof returnedDevice.value === "number"
          ? device.localPrestado - returnedDevice.value
          : device.actives;

      return {
        ...device,
        actives,
      };
    }
  );

  const dispositivos: MetaDispositivo[] = allDevices.filter(
    (device: MetaDispositivo) => device.actives > 0
  );

  const dispositivosDevueltos: MetaDispositivo[] = allDevices.filter(
    (device: MetaDispositivo) => device.actives <= 0
  );

  result = await updateOne(loanCollection, loanID, {
    $set: { 
      dispositivos, 
      dispositivosDevueltos: [
        ...loan.dispositivosDevueltos,
        ...dispositivosDevueltos
      ],
    },
  });

  if (result.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al regresar el préstamo en la base de datos",
    });
  }

  const areAllInactive: boolean = !dispositivos.some(
    (device: MetaDispositivo) => !!device.actives && device.actives > 0
  );

  // Quitando el estado activo al préstamo
  if (areAllInactive) {
    result = await updateOne(loanCollection, loanID, {
      $set: {
        status: "inactivo",
        "timelog.fin": new Date().toString(),
      },
    });

    if (result.err) {
      return res.status(500).json({
        err: true,
        msg: "Error al regresar el préstamo en la base de datos",
      });
    }
  }

  res.json({
    err: false,
    msg: "Préstamo regresado con éxito",
  });
};

export const updateLoan = async (
  req: NextApiRequest,
  res: NextApiResponse,
  loanCollection: Collection,
  deviceCollection: Collection
) => {
  const { loanID, changedDevices, deletedDevices, aula }: DataToSend = req.body;

  // Si algun atributo no existe
  if ((!changedDevices || !deletedDevices) && !aula) {
    return res.status(401).json({
      err: true,
      msg: "Error en petición",
    });
  }

  // Si ambos array están vacios
  if (
    !changedDevices.length &&
    deletedDevices &&
    !deletedDevices.length &&
    !aula
  ) {
    return res.status(401).json({
      err: true,
      msg: "Error en petición",
    });
  }

  // Obtener lista de dispositivos del préstamo
  const { err, data }: DbServiceResponse = await getOne(
    loanCollection,
    loanID,
    { projection: { dispositivos: 1 } }
  );
  if (err || !data) {
    return res.status(500).json({
      err: true,
      msg: "Error al regresar el préstamo en la base de datos",
    });
  }

  // Eliminar dispositivos eliminados, en la base de datos
  if (deletedDevices && !!deletedDevices.length) {
    deletedDevices.forEach(async (deletedDevice: any) => {
      const response: DbServiceResponse = await updateOne(
        deviceCollection,
        { _id: deletedDevice.deviceID },
        {
          $inc: { prestado: -deletedDevice.difference },
        }
      );
    });
  }

  // Quitar los dispositivos eliminados de los dispositivos originales
  const withoutDeletedDevices: MetaDispositivo[] = !deletedDevices?.length
    ? [...data.dispositivos]
    : data.dispositivos.filter((originalDevice: any) => {
        const wasDeleted: boolean = deletedDevices.some(
          (deletedDevice: any) => deletedDevice.deviceID === originalDevice._id
        );
        return !wasDeleted;
      });

  // Actualizar cambios de los dispositivos en la base de datos
  // Esto actualiza tanto los dispositivos que son nuevos en el préstamo como los que no
  if (!!changedDevices.length) {
    changedDevices.forEach(async (changedDevice: ModifyData) => {
      const result: DbServiceResponse = await updateOne(
        deviceCollection,
        { _id: changedDevice.deviceID },
        {
          $inc: { prestado: changedDevice.difference },
        }
      );
    });
  }

  // Actualizando en la lista de dispositivos originales del prestamo,
  // aquellos a los que se les suma o resta cantidad.
  const devicesWithChanges: MetaDispositivo[] = withoutDeletedDevices.map(
    (originalDevice: MetaDispositivo) => {
      const deviceWithChange: ModifyData[] = changedDevices.filter(
        (changedDevice: any) => changedDevice.deviceID === originalDevice._id
      );
      // Si no se encuentran cambios
      if (!deviceWithChange.length) {
        return {
          _id: originalDevice._id,
          nombre: originalDevice.nombre,
          localPrestado: originalDevice.localPrestado,
          actives: originalDevice.actives,
        };
      }

      const [changedDevice, _] = deviceWithChange;
      return {
        ...originalDevice,
        localPrestado: originalDevice.localPrestado + changedDevice.difference,
        actives: originalDevice.actives + changedDevice.difference,
      };
    }
  );

  // Obteniendo dispositivos nuevos
  const newDevices: MetaDispositivo[] = changedDevices
    .map((changedDevice: ModifyData) => {
      const { isNew, deviceID, nombre, difference } = changedDevice;
      return isNew
        ? {
            _id: deviceID,
            nombre,
            localPrestado: difference,
            actives: difference,
          }
        : undefined;
    })
    .filter((item: any) => !!item) as MetaDispositivo[];

  // Uniendo la lista de dispositivos ya filtrada con la lista de dispositivos nuevos
  const deviceListWithAllChanges: MetaDispositivo[] = [
    ...devicesWithChanges,
    ...newDevices,
  ];

  if (!!aula) {
    const aulaUpdated = await updateOne(loanCollection, loanID, {
      $set: { "materia.horario.aula": aula },
    });
    if (aulaUpdated.err) {
      return res.status(500).json({
        err: true,
        msg: "Error al modificar el préstamo en la base de datos",
      });
    }
  }

  const result: DbServiceResponse = await updateOne(loanCollection, loanID, {
    $set: { dispositivos: deviceListWithAllChanges },
  });

  if (result.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al modificar el préstamo en la base de datos",
    });
  }

  res.json({
    err: false,
    msg: "Préstamo actualizado con éxito",
  });
};

export const generateLoanReports = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {};

export default {
  uploadLoan,
  getAllLoans,
  getActiveLoans,
  returnLoan,
  updateLoan,
};
