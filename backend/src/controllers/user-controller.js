import { listUsers } from "../services/user-service.js";

export const handleListUsers = async (_req, res) => {
  const users = await listUsers();
  res.json({ data: users });
};

