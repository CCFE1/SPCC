import type { DrawerOption } from "@models/interfaces";
/*
  These are options to load on Hamburguer menu, it depends if user is admin or not
*/

export const userOptions: DrawerOption[] = [
  { label: "Principal", link: "/main", icon: "home" },
  { label: "Préstamos", link: "/prestamos", icon: "view_list" },
];

export const adminOptions: DrawerOption[] = [
  ...userOptions,
  { label: "Dispositivos", link: "", icon: "devices" },
  { label: "Reportes", link: "/reportes", icon: "assessment" },
  { label: "Subir Horarios", link: "/subir-horarios", icon: "cloud_upload" },
  { label: "Configuración", link: "", icon: "settings" },
];

export const bottomListOptions: DrawerOption[] = [
  {
    label: "Modo Oscuro",
    link: "",
    icon: "dark_mode",
  },  
  {
    label: "Cerrar Sesión",
    link: "/",
    icon: "logout",
    action: () => localStorage.clear(),
  },
];
