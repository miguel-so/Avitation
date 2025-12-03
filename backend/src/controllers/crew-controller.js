import { validationResult } from "express-validator";
import {
  listCrew,
  createCrewMember,
  updateCrewMember,
  getCrewMember,
  deleteCrewMember,
} from "../services/crew-service.js";
import { createId } from "../utils/uid.js";

export const handleListCrew = async (req, res) => {
  const crew = await listCrew(req.params.flightId);
  res.json({ data: crew });
};

export const handleCreateCrew = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const crewId = createId();
  const crewMember = await createCrewMember(crewId, req.params.flightId, {
    ...req.body,
    crewUid: req.body.crewUid ?? createId(),
  });
  res.status(201).json(crewMember);
};

export const handleUpdateCrew = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const existing = await getCrewMember(req.params.crewId);
  if (!existing) {
    return res.status(404).json({ message: "Crew member not found" });
  }

  const crewMember = await updateCrewMember(req.params.crewId, req.body);
  res.json(crewMember);
};

export const handleDeleteCrew = async (req, res) => {
  const existing = await getCrewMember(req.params.crewId);
  if (!existing) {
    return res.status(404).json({ message: "Crew member not found" });
  }

  await deleteCrewMember(req.params.crewId);
  res.status(204).send();
};

