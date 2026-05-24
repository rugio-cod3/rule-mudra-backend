import { logger } from "@/utils/logger";

class CronJobService {
  private schedulers: any[] = [];

  constructor() {
    logger.info("Initializing Cron Job Service...");
    this.initializeSchedulers();
  }

  private initializeSchedulers(): void {
    try {
      // const loanAgreementScheduler = new LoanAgreementScheduler();
      // this.schedulers.push(loanAgreementScheduler)

      // const nocEmailScheduler = new NocEmailScheduler();
      // this.schedulers.push(nocEmailScheduler)

      logger.info(`Initialized ${this.schedulers.length} cron schedulers`);
    } catch (error) {
      logger.error("Error initializing cron schedulers:", error);
    }
  }

  public getActiveSchedulers(): any[] {
    return this.schedulers;
  }

  public async stopAllSchedulers(): Promise<void> {
    logger.info("Stopping all cron schedulers...");
    this.schedulers.forEach((scheduler) => {
      if (scheduler.stop) {
        scheduler.stop();
      }
    });
  }
}

export default CronJobService;
