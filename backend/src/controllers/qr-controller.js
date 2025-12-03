import { validationResult } from "express-validator";
import { createQrPass, getQrPassByToken, updateQrPass } from "../services/qr-service.js";
import { createId } from "../utils/uid.js";
import { getPassenger } from "../services/passenger-service.js";
import { getCrewMember } from "../services/crew-service.js";

const fetchEntitySummary = async (entityType, entityId) => {
  if (entityType === "PASSENGER") {
    const passenger = await getPassenger(entityId);
    if (!passenger) return null;
    return {
      id: passenger.id,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      nationality: passenger.nationality,
      passportNumber: passenger.passportNumber,
      seatNumber: passenger.seatNumber,
    };
  }

  if (entityType === "CREW") {
    const crew = await getCrewMember(entityId);
    if (!crew) return null;
    return {
      id: crew.id,
      firstName: crew.firstName,
      lastName: crew.lastName,
      position: crew.position,
      dutyType: crew.dutyType,
    };
  }

  return null;
};

export const handleCreateQrPass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const qrId = createId();
  const entitySummary = await fetchEntitySummary(
    req.body.entityType,
    req.body.entityId
  );

  if (!entitySummary) {
    return res.status(404).json({ message: "Linked entity not found" });
  }

  const result = await createQrPass(qrId, req.params.flightId, {
    ...req.body,
    payload: {
      ...entitySummary,
      accessLevel: req.body.accessLevel ?? "PASSENGER",
      generatedBy: req.user?.sub ?? null,
    },
  });

  res.status(201).json({
    id: qrId,
    token: result.token,
  });
};

export const handleUpdateQrPass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  await updateQrPass(req.params.qrId, req.body);
  res.status(200).json({ message: "QR pass updated" });
};

export const handleGetQrPassPublic = async (req, res) => {
  const qrPass = await getQrPassByToken(req.params.token);
  if (!qrPass) {
    return res.status(404).json({ message: "QR pass not found" });
  }

  res.json({
    id: qrPass.id,
    flightId: qrPass.flightId,
    entityType: qrPass.entityType,
    entityId: qrPass.entityId,
    accessLevel: qrPass.accessLevel,
    status: qrPass.status,
    issuedAt: qrPass.issuedAt,
    expiresAt: qrPass.expiresAt,
    payload: qrPass.payload,
  });
};

