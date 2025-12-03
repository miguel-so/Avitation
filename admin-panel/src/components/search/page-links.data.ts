import { routes } from "@/config/routes";
// Note: do not add href in the label object, it is rendering as label
export const pageLinks = [
  {
    name: "Operations",
  },
  {
    name: "Mission Control",
    href: routes.dashboard,
  },
  {
    name: "Flight Registry",
    href: routes.flights.list,
  },
  {
    name: "Create Flight",
    href: routes.flights.create,
  },
  {
    name: "Authority Console",
    href: routes.authority,
  },
  {
    name: "QR Pass Lookup",
    href: routes.qrPass.publicLookup("demo-token"),
  },
  {
    name: "Data Management",
  },
  {
    name: "Airports",
    href: routes.reference.airports,
  },
  {
    name: "Operators",
    href: routes.reference.operators,
  },
  {
    name: "Aircraft Types",
    href: routes.reference.aircraft,
  },
  {
    name: "Document Templates",
    href: routes.reference.templates,
  },
  {
    name: "Platform & Access",
  },
  {
    name: "Users",
    href: routes.users,
  },
  {
    name: "Roles",
    href: routes.roles,
  },
  {
    name: "Account Settings",
    href: routes.settings,
  },
  {
    name: "Auth / Sign In",
    href: routes.auth.signIn,
  },
];
