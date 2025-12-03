import { routes } from "@/config/routes";
import {
  PiAirplaneTiltDuotone,
  PiUsersFourDuotone,
  PiUserGearDuotone,
  PiMapPinLineDuotone,
  PiGlobeHemisphereWestDuotone,
  PiStackDuotone,
  PiShieldCheckDuotone,
  PiGearDuotone,
  PiIdentificationBadgeDuotone,
  PiQrCodeDuotone,
  PiFolderDuotone,
  PiGaugeDuotone,
} from "react-icons/pi";

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // label start
  {
    name: "Operations",
  },
  // label end
  {
    name: "Mission Control",
    href: routes.dashboard,
    icon: <PiGaugeDuotone />,
  },
  {
    name: "Flights",
    href: routes.flights.list,
    icon: <PiAirplaneTiltDuotone />,
  },
  {
    name: "Authority Console",
    href: routes.authority,
    icon: <PiShieldCheckDuotone />,
  },
  {
    name: "QR Pass Lookup",
    href: routes.qrPass.publicLookup("demo-token"),
    icon: <PiQrCodeDuotone />,
    badge: "SCAN",
  },

  {
    name: "Data Management",
  },
  {
    name: "Airports",
    href: routes.reference.airports,
    icon: <PiMapPinLineDuotone />,
  },
  {
    name: "Aircraft",
    href: routes.reference.aircraft,
    icon: <PiGlobeHemisphereWestDuotone />,
  },
  {
    name: "Operators",
    href: routes.reference.operators,
    icon: <PiUsersFourDuotone />,
  },
  {
    name: "Document Templates",
    href: routes.reference.templates,
    icon: <PiFolderDuotone />,
  },

  {
    name: "Access & Settings",
  },
  {
    name: "Users",
    href: routes.users,
    icon: <PiIdentificationBadgeDuotone />,
  },
  {
    name: "Roles",
    href: routes.roles,
    icon: <PiUserGearDuotone />,
  },
  {
    name: "Platform Settings",
    href: routes.settings,
    icon: <PiGearDuotone />,
  },
];

