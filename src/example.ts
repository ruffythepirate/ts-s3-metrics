import { Reader } from './reader';
import {MetricKey} from './metric-key';
import {Resolution} from './resolution';
import Writer from './writer';
import {createMetricNow} from './metric';
import {MergeMode} from './merge-mode';

const s3Bucket = process.env.S3_BUCKET;

const reader = new Reader(s3Bucket as string);
const writer = new Writer(s3Bucket as string, MergeMode.merge);

const key = new MetricKey('group', 'key', Resolution.Day);

async function doWork() {
  console.log('writing metrics');
  await writer.writeMetrics(key, [createMetricNow(5.5)])
  console.log(`reading metrics from ${key.getAwsPrefix()}`);
  const response = await reader.readMetrics(key, new Date(), new Date());
  console.log('got response', response);
}

