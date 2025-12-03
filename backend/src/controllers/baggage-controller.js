import { validationResult } from "express-validator";
import {
  listBaggageByFlight,
  createBaggage,
  updateBaggageStatus,
  deleteBaggage,
} from "../services/baggage-service.js";
import { createId } from "../utils/uid.js";

export const handleListBaggage = async (req, res) => {
  const baggage = await listBaggageByFlight(req.params.flightId);
  res.json({ data: baggage });
};

export const handleCreateBaggage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const baggageId = createId();
  await createBaggage(baggageId, req.params.flightId, req.body);
  res.status(201).json({ id: baggageId });
};

export const handleUpdateBaggage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  await updateBaggageStatus(req.params.baggageId, req.body);
  res.status(200).json({ message: "Baggage updated" });
};

export const handleDeleteBaggage = async (req, res) => {
  await deleteBaggage(req.params.baggageId);
  res.status(204).send();
};

