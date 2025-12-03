import { validationResult } from "express-validator";
import {
  listFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
} from "../services/flight-service.js";
import { listPassengers } from "../services/passenger-service.js";
import { listCrew } from "../services/crew-service.js";
import { listBaggageByFlight } from "../services/baggage-service.js";
import { listDocuments } from "../services/document-service.js";
import { listNotificationsByFlight } from "../services/authority-service.js";
import { createId } from "../utils/uid.js";

export const handleListFlights = async (req, res) => {
  const result = await listFlights({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 20),
    search: req.query.search ?? "",
    status: req.query.status,
    operatorId: req.query.operatorId,
    originAirportId: req.query.originAirportId,
    destinationAirportId: req.query.destinationAirportId,
    departureDateFrom: req.query.departureDateFrom,
    departureDateTo: req.query.departureDateTo,
  });

  res.json(result);
};

export const handleGetFlight = async (req, res) => {
  const flight = await getFlightById(req.params.id);
  if (!flight) {
    return res.status(404).json({ message: "Flight not found" });
  }

  const [passengers, crew, baggage, documents, notifications] = await Promise.all([
    listPassengers(flight.id),
    listCrew(flight.id),
    listBaggageByFlight(flight.id),
    listDocuments(flight.id),
    listNotificationsByFlight(flight.id),
  ]);

  res.json({
    flight,
    passengers,
    crew,
    baggage,
    documents,
    notifications,
  });
};

export const handleCreateFlight = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed", errors: errors.array() });
  }

  const id = createId();
  const data = await createFlight(id, {
    ...req.body,
    flightUid: req.body.flightUid ?? createId(),
    createdBy: req.user?.sub,
    updatedBy: req.user?.sub,
  });

  res.status(201).json(data);
};

export const handleUpdateFlight = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed", errors: errors.array() });
  }

  const flight = await getFlightById(req.params.id);
  if (!flight) {
    return res.status(404).json({ message: "Flight not found" });
  }

  const data = await updateFlight(req.params.id, {
    ...req.body,
    updatedBy: req.user?.sub,
  });

  res.json(data);
};

export const handleDeleteFlight = async (req, res) => {
  const flight = await getFlightById(req.params.id);
  if (!flight) {
    return res.status(404).json({ message: "Flight not found" });
  }

  await deleteFlight(req.params.id);
  res.status(204).send();
};

