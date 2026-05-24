import { config } from "@/config.server";
import { logger } from "@/utils/logger";
import Queue from "bull";

export const createQueue = ({
  name,
  attempts = 1,
  removeOnComplete = true,
  backoff = "exponential",
}) => {
  logger.info(`New queue created - ${name}`);
  return new Queue(name, {
    redis: config.redisUrl,
    prefix: `rulemudra:${name}:${config.nodeEnv}`,
    defaultJobOptions: {
      attempts,
      removeOnComplete,
      backoff: { type: backoff },
    },
  });
};
