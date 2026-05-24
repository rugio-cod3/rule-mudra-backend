// workers/razorpayConsumerWorker.ts
import { parentPort, workerData, isMainThread } from 'worker_threads';
import { startRazorpayRepaymentConsumer } from '../consumers/razorpay.repayment.consumer';
import { logger } from '../utils/logger';

(async () => {
  try {
    if (!isMainThread) {
      logger.info(`Worker ${workerData.id} started`, { workerId: workerData.id });
      
  
      //await startRazorpayRepaymentConsumer();
      
      parentPort?.postMessage({ status: 'running' });
    }
  } catch (error) {
    logger.error(`Worker ${workerData.id} failed:`, { 
      error: error.message,
      stack: error.stack,
      workerId: workerData.id
    });
    
    process.exit(1); // Exit with error code
  }
})();