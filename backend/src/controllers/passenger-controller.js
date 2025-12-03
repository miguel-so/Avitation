import { validationResult } from "express-validator";
import {
  listPassengers,
  createPassenger,
  updatePassenger,
  getPassenger,
  deletePassenger,
} from "../services/passenger-service.js";
import { createId } from "../utils/uid.js";

export const handleListPassengers = async (req, res) => {
  const passengers = await listPassengers(req.params.flightId);
  res.json({ data: passengers });
};

export const handleCreatePassenger = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const passengerId = createId();
  const passenger = await createPassenger(passengerId, req.params.flightId, {
    ...req.body,
    passengerUid: req.body.passengerUid ?? createId(),
  });

  res.status(201).json(passenger);
};

export const handleUpdatePassenger = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const existing = await getPassenger(req.params.passengerId);
  if (!existing) {
    return res.status(404).json({ message: "Passenger not found" });
  }

  const passenger = await updatePassenger(req.params.passengerId, req.body);
  res.json(passenger);
};

export const handleDeletePassenger = async (req, res) => {
  const existing = await getPassenger(req.params.passengerId);
  if (!existing) {
    return res.status(404).json({ message: "Passenger not found" });
  }

  await deletePassenger(req.params.passengerId);
  res.status(204).send();
};

