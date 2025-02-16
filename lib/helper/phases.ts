import { ExecutionPhase } from "@prisma/client";

export const GetPhasesTotalCost = (
  phases: Pick<ExecutionPhase, "creditsConsumed">[]
) => phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
