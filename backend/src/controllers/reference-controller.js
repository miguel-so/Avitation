import {
  listAirports,
  listAircraftTypes,
  listOperators,
  listRoles,
  listDocumentTemplates,
} from "../services/reference-service.js";

export const handleListAirports = async (_req, res) => {
  const data = await listAirports();
  res.json({ data });
};

export const handleListAircraftTypes = async (_req, res) => {
  const data = await listAircraftTypes();
  res.json({ data });
};

export const handleListOperators = async (_req, res) => {
  const data = await listOperators();
  res.json({ data });
};

export const handleListRoles = async (_req, res) => {
  const data = await listRoles();
  res.json({ data });
};

export const handleListTemplates = async (_req, res) => {
  const data = await listDocumentTemplates();
  res.json({ data });
};

