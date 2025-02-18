export const logLevels = ["error", "info"] as const;
export type logLevel = (typeof logLevels)[number];

export type Log = { message: string; timestamp: Date; level: logLevel };
export type LogFunction = (message: string) => void;

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in logLevel]: LogFunction;
};
