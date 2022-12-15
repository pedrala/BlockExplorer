import cronjob from 'cron';
import { 
  getMaindata,
  getLatestBlocksData,
  getLatestTransactionsData

} from "../../controllers/apiController.js";

const CronJobSchduler = cronjob.CronJob;

getMaindata();
getLatestBlocksData();
getLatestTransactionsData();


const job = new CronJobSchduler('10 * * * * *', function () {
  getMaindata();
  getLatestBlocksData();
  getLatestTransactionsData();

}, null, true, 'Asia/Seoul');

job.start();