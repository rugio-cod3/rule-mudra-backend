import { createJob } from '@/utils/cron.utils'
import { logger } from '@/utils/logger'
import { LoanAgreementJob } from '../jobs/loanAgreementJob'

export class LoanAgreementScheduler {
    private readonly cronSchedule: string
    private readonly jobName: string
    private loanAgreementJob: LoanAgreementJob

    constructor() {
        // this.cronSchedule = '0 12 * * *'
        this.cronSchedule = '*/30 * * * *'
        this.jobName = 'LoanAgreementEmail'
        this.loanAgreementJob = new LoanAgreementJob()

        logger.info(`Initializing ${this.jobName} scheduler with schedule: ${this.cronSchedule}`)
        this.startScheduler()
    }

    private startScheduler(): void {
        createJob(this.cronSchedule, async () => {
            try {
                logger.info(`${this.jobName} cron job triggered`)
                await this.loanAgreementJob.execute()
                logger.info(`${this.jobName} cron job completed successfully`)
            } catch (error) {
                logger.error(`Error in ${this.jobName} cron job:`, error)

                if (error instanceof Error && error.message.includes('AWS SES account is paused')) {
                    logger.error(`Critical error in ${this.jobName}: Stopping scheduler`)
                }
            }
        })

        logger.info(`${this.jobName} scheduler started successfully`)
    }

    public async executeManually(): Promise<void> {
        logger.info(`Manual execution of ${this.jobName} triggered`)
        await this.loanAgreementJob.execute()
    }

    public getSchedule(): string {
        return this.cronSchedule
    }

    public getJobName(): string {
        return this.jobName
    }
}