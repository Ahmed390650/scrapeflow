import {
  Log,
  LogCollector,
  LogFunction,
  logLevel,
  logLevels,
} from "@/types/logs";

export const createLogColletor = (): LogCollector => {
  const logs: Log[] = [];

  const logFunctions = {} as Record<logLevel, LogFunction>;
  logLevels.forEach((level) => {
    logFunctions[level] = (message: string) => {
      logs.push({
        level,
        message,
        timestamp: new Date(),
      });
    };
  });
  return {
    getAll: () => logs,
    ...logFunctions,
  };
};
