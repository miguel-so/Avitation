export const routes = {
  dashboard: "/dashboard",
  flights: {
    list: "/flights",
    create: "/flights/create",
    details: (id: string) => `/flights/${id}`,
  },
  passengers: {
    import: (flightId: string) => `/flights/${flightId}?view=passengers`,
  },
  crew: {
    manage: (flightId: string) => `/flights/${flightId}?view=crew`,
  },
  baggage: {
    overview: (flightId: string) => `/flights/${flightId}?view=baggage`,
  },
  documents: {
    overview: (flightId: string) => `/flights/${flightId}?view=documents`,
  },
  qrPass: {
    manage: (flightId: string) => `/flights/${flightId}?view=qr`,
    publicLookup: (token: string) => `/qr/${token}`,
  },
  reference: {
    airports: "/airports",
    operators: "/operators",
    aircraft: "/aircraft",
    templates: "/document-templates",
  },
  authority: "/authority-console",
  users: "/users",
  roles: "/roles",
  settings: "/settings",
  auth: {
    signIn: "/signin",
  },
};
