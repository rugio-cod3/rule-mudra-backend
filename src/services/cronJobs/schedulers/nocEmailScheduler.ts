import { createJob } from "@/utils/cron.utils";
import { logger } from "@/utils/logger";
import { NocEmailJob } from "../jobs/nocEmailJob";

export class NocEmailScheduler {
  private readonly cronSchedule: string;
  private readonly jobName: string;
  private nocEmailJob: NocEmailJob;

  constructor() {
    this.cronSchedule = "30 6 * * *";
    // this.cronSchedule = '*/1 * * * *'

    this.jobName = "NocEmail";
    this.nocEmailJob = new NocEmailJob();
    logger.info(
      `Initializing ${this.jobName} scheduler with schedule: ${this.cronSchedule}`
    );
    this.startScheduler();
  }

  private startScheduler(): void {
    createJob(this.cronSchedule, async () => {
      try {
        logger.info(`${this.jobName} cron job triggered`);
        await this.nocEmailJob.execute();
        logger.info(`${this.jobName} cron job completed successfully`);
      } catch (error) {
        logger.error(`Error in ${this.jobName} cron job:`, error);
        // Handle critical errors that should stop the cron
        if (
          error instanceof Error &&
          error.message.includes("AWS SES account is paused")
        ) {
          logger.error(`Critical error in ${this.jobName}: Stopping scheduler`);
        }
      }
    });
    logger.info(`${this.jobName} scheduler started successfully`);
  }

  public async executeManually(): Promise<void> {
    logger.info(`Manual execution of ${this.jobName} triggered`);
    await this.nocEmailJob.execute();
  }

  public getSchedule(): string {
    return this.cronSchedule;
  }

  public getJobName(): string {
    return this.jobName;
  }

  public stop(): void {
    logger.info(`Stopping ${this.jobName} scheduler`);
  }
}
