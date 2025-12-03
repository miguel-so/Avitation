import { validationResult } from "express-validator";
import {
  listNotificationsByFlight,
  createNotification,
  updateNotificationStatus,
} from "../services/authority-service.js";
import { createId } from "../utils/uid.js";

export const handleListAuthorityNotifications = async (req, res) => {
  const notifications = await listNotificationsByFlight(req.params.flightId);
  res.json({ data: notifications });
};

export const handleCreateAuthorityNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const notificationId = createId();
  await createNotification(notificationId, {
    ...req.body,
    flightId: req.params.flightId,
    status: "PENDING",
  });
  res.status(201).json({ id: notificationId });
};

export const handleUpdateAuthorityNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  await updateNotificationStatus(req.params.notificationId, req.body);
  res.status(200).json({ message: "Notification updated" });
};

