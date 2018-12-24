const CronJob       = require('cron').CronJob;
const serpanalyzer  = require('./serpanalyzer.js');

let job = new CronJob({
  cronTime: "00 00 6,14,22 * * *",
  onTick: serpanalyzer.start,
  timeZone: "Europe/Rome"
});

console.log("serpanalyzer started...")

job.start();
