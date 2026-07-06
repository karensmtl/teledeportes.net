const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const logger = require('../logger');

const TRANSCODE_QUEUE = 'transcode';

// Shared Redis connection. maxRetriesPerRequest:null is required by BullMQ.
const connection = new IORedis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});

const transcodeQueue = new Queue(TRANSCODE_QUEUE, { connection });

async function enqueueTranscode(videoId) {
    await transcodeQueue.add(
        'transcode',
        { videoId },
        {
            attempts: 2,
            backoff: { type: 'fixed', delay: 5000 },
            removeOnComplete: 50,
            removeOnFail: 100,
        },
    );
    logger.info({ videoId }, 'transcode job enqueued');
}

module.exports = { TRANSCODE_QUEUE, connection, transcodeQueue, enqueueTranscode };
