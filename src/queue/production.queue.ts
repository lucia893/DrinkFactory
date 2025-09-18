import Bull from "bull";
import config from "../config";

const queue = new Bull(config.productionQueueName, { redis: config.redisUrl });
export default queue;
