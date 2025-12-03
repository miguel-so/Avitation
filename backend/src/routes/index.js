import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { flightRouter } from "./flight.routes.js";
import { passengerRouter } from "./passenger.routes.js";
import { crewRouter } from "./crew.routes.js";
import { baggageRouter } from "./baggage.routes.js";
import { documentRouter } from "./document.routes.js";
import { qrRouter } from "./qr.routes.js";
import { authorityRouter } from "./authority.routes.js";
import { referenceRouter } from "./reference.routes.js";
import { userRouter } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/flights", flightRouter);
apiRouter.use("/", passengerRouter);
apiRouter.use("/", crewRouter);
apiRouter.use("/", baggageRouter);
apiRouter.use("/", documentRouter);
apiRouter.use("/", qrRouter);
apiRouter.use("/", authorityRouter);
apiRouter.use("/reference", referenceRouter);
apiRouter.use("/", userRouter);

