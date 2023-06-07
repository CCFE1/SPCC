// Validaciones sencillas
export const firstValidations = (formData: any, selectedDevices: any) => {
  const formDataProperties: string[] = [
    "aulas",
    "horaFin",
    "horaInicio",
    "maestros",
    "materias",
  ];

  // Revisar si no hay campos vacios
  for (let property of formDataProperties) {
    if (!formData.hasOwnProperty(property)) {
      return {
        isValid: false,
        dialog: {
          title: "Alerta",
          description: "No dejes campos vacios",
        },
      };
    }
  }

  // Revisar si no hay campos vacios
  if (
    typeof formData.aulas === "string" ||
    typeof formData.horaFin === "string" ||
    typeof formData.horaInicio === "string" ||
    typeof formData.maestros === "string" ||
    typeof formData.materias === "string"
  ) {
    return {
      isValid: false,
      dialog: {
        title: "Alerta",
        description: "No dejes campos vacios",
      },
    };
  }

  // Las horas no pueden ser iguales
  if (formData.horaInicio.value === formData.horaFin.value) {
    return {
      isValid: false,
      dialog: {
        title: "Alerta",
        description: "La hora de inicio no puede ser igual a la hora de fin",
      },
    };
  }

  // La hora de inicio no puede ser mayor a la de fin
  if (formData.horaInicio.value > formData.horaFin.value) {
    return {
      isValid: false,
      dialog: {
        title: "Alerta",
        description: "La hora de inicio no puede ser mayor a la hora de fin",
      },
    };
  }

  // No se puede dejar vacio el campo de dispositivos
  if (!selectedDevices.length) {
    return {
      isValid: false,
      dialog: {
        title: "Alerta",
        description: "Selecciona al menos un dispositivo",
      },
    };
  }

  const isThereNew = checkNew(formData);
  if (!!isThereNew.length) {
    return {
      isValid: false,
      requireAcceptOption: true,
      dialog: {
        title: "Alerta",
        description:
          "Hay información en el préstamo que no se encuentra en la base de datos. ¿Deseas continuar?",
      },
    };
  }

  return {
    isValid: true,
  };
};

// Validaciones complejas relacionadas con dispositivos
export const secondValidations = (
  formData: any,
  selectedDevices: any,
  devices: any
) => {
  // saber si el salón seleccionado tiene un control
  const isThereAControl = devices.filter((device: any) => {
    const deviceName = device.nombre.split(" ")[1];
    return deviceName === formData.aulas.value;
  });

  // Obtener los controles seleccionados en el device selector
  const controlesSeleccionados = selectedDevices.filter((device: any) => {
    const deviceType = device.nombre.split(" ")[0];
    return deviceType.includes("control");
  });

  // Si el salón tiene un control y se seleccionaron 0 controles
  if (!!isThereAControl.length && !controlesSeleccionados.length) {
    return {
      isValid: false,
      requireAcceptOption: true,
      dialog: {
        title: "Alerta",
        description:
          "Usted seleccionó un salón que tiene un control de proyector. Pero no eligió ningun control, ¿Desea continuar?",
      },
    };
  }

  // Detectar si hay mas de un control
  if (controlesSeleccionados.length > 1) {
    return {
      isValid: false,
      requireAcceptOption: true,
      dialog: {
        title: "Alerta",
        description:
          "Te estás llevando mas de un control de proyector. ¿Deseas continuar?",
      },
    };
  }

  // Si el salón no tiene un control y se seleccionó 1 control
  if (!isThereAControl.length && !!controlesSeleccionados.length) {
    return {
      isValid: false,
      requireAcceptOption: true,
      dialog: {
        title: "Alerta",
        description:
          "Usted seleccionó un salón que no tiene un control de proyector. Pero eligió un control de proyector, ¿Desea continuar?",
      },
    };
  }

  // Si el salón tiene un control y se seleccionó 1 control que no le pertenece
  if (!!isThereAControl.length && !!controlesSeleccionados.length) {
    // Detectar si el control seleccionado pertenece al aula seleccionada
    const salonDelControl = controlesSeleccionados[0].nombre.split(" ")[1];
    if (salonDelControl !== formData.aulas.value) {
      return {
        isValid: false,
        requireAcceptOption: false,
        dialog: {
          title: "Alerta",
          description: `Solo puedes llevarte el control que pertenece al aula ${formData.aulas.value}`,
        },
      };
    }
  }

  return {
    isValid: true,
  };
};

const checkNew = (formData: any) => {
  let newDataNames = [];

  if (formData.aulas.hasOwnProperty("__isNew__")) {
    newDataNames.push("aula");
  }

  if (formData.maestros.hasOwnProperty("__isNew__")) {
    newDataNames.push("maestro");
  }

  if (formData.materias.hasOwnProperty("__isNew__")) {
    newDataNames.push("materia");
  }

  return newDataNames;
};
