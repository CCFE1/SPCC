import type { Item } from "@models/interfaces";

// Adaptar controller para usar en deviceSlice
export const selectOption = (selectedItems: any, value: any): any => {
  const selected: Item[] = selectedItems.map(
    (blockedItem: Item, index: number, array: Item[]) => {
      let item = { ...blockedItem };

      if (index === array.length - 1) {
        item.prestado = item.prestado + 1;
        console.log(item.prestado);
        if (item.stock - item.prestado <= 0) item.isDisabled = true;
      }

      return item;
    }
  );

  // Se aumenta la cantidad prestada
  const lastItem: Item = selected[selected.length - 1];

  // Verificar si existe el ultimo item en el array value
  const [result]: Item[] = value.filter(
    (item: Item) => item.value === lastItem.value
  );
  // Si existe el tag, modifica la cantidad, si no, agrega el nuevo item
  const tags: Item[] = !!result
    ? value.map((item: Item) => {
        return item.value !== lastItem.value
          ? item
          : {
              ...item,
              value: item.value,
              label: lastItem.labelPrestado,
            };
      })
    : [
        ...value,
        {
          ...lastItem,
          value: lastItem.value,
          label: lastItem.value,
        },
      ];

  return tags;
};

export const removeValue = (selected: any, values: Item[], options: Item[]) => {
  // Encontrar item eliminado
  const [itemDeleted]: Item[] = values.filter(
    (value: Item) => !selected.some((item: Item) => value.value === item.value)
  );
  // Actualizar la opción eliminada
  options = options.map((option: Item) => {
    return option.value !== itemDeleted.value
      ? option
      : ((option.prestado = 0), (option.isDisabled = false), option);
  });

  return selected;
};

export const clear = (options: Item[]) => {
  // Actualizar las opciones
  options = options.map((option: Item) => {
    option.prestado = 0;
    option.isDisabled = false;
    return option;
  });

  return [];
};
