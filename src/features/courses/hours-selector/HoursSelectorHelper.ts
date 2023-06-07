// Obtener la lista de horas para el input inicial
export const getInitialHoursList = (hourNumber: number) => {
  let list: ValueList[] = [
    {
      label: "Elegir",
      value: -1,
    },
  ];

  for (let i = hourNumber; i < hourNumber + 3; i++) {
    if (i > 20) break;
    list.push({
      label: `${i}:00`,
      value: i,
    });
  }

  return list;
};

//Obtener la lista de horas para el input final
export const getLastHoursList = (hourNumber: number) => {
  let list: ValueList[] = [
    {
      label: "Elegir",
      value: -1,
    },
  ];

  for (let i = hourNumber + 1; i < hourNumber + 6; i++) {
    if (i > 21) break;
    list.push({
      label: `${i}:00`,
      value: i,
    });
  }

  return list;
};

export interface ValueList {
  label: string;
  value: number;
}
