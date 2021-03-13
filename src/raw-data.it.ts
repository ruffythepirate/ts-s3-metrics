import S3 from 'aws-sdk/clients/s3';
import {v4 as uuid} from 'uuid';
import {createMetricNow} from './metric';
import {Resolution} from './resolution';
import {MetricKey} from './metric-key';
import Writer from './writer'
import {Reader} from "./reader";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('Integration Test raw data', () => {

  jest.setTimeout(20 * 1000);

  let s3Client: S3;
  let bucketName: string;
  let writer: Writer;
  let reader: Reader;

  beforeEach(async () => {
    s3Client = new S3({
      endpoint: 'http://localhost:4566/',
      accessKeyId: "123",
      secretAccessKey: "abc",
      sslEnabled: false,
      s3ForcePathStyle: true
    });

    bucketName = uuid();

    writer = Writer.builder()
        .s3Client(s3Client)
        .s3Bucket(bucketName)
        .build();

    reader = Reader.builder()
        .s3Client(s3Client)
        .s3Bucket(bucketName)
        .build();

    for(let i = 0; i < 10 ; i++) {
        try{
          await s3Client.createBucket(
              {
                Bucket: bucketName
              }
          ).promise();
          await sleep(1000);
           break;
        } catch(e) {
          if (i === 10) {
            throw e;
          }
        }
    }
  });

  it('Saves and reads data.', async () => {
    const key = new MetricKey('group', 'key', Resolution.Raw);
    const metricsToWrite = [createMetricNow(5.5)];
    await writer.writeMetrics(key, metricsToWrite);
    const response = await reader.readMetrics(key, new Date(), new Date());
    expect(response).toEqual(metricsToWrite);
  });

  it('Doesnt read data from other group', async () => {
    const key = new MetricKey('group', 'key', Resolution.Raw);
    const keyOtherGroup = new MetricKey('group1', 'key', Resolution.Raw);
    const keyOtherKey = new MetricKey('group', 'key1', Resolution.Raw);
    const metricsToWrite = [createMetricNow(5.5)];
    await writer.writeMetrics(key, metricsToWrite);
    expect(await reader.readMetrics(keyOtherGroup, new Date(), new Date())).toEqual([]);
    expect(await reader.readMetrics(keyOtherKey, new Date(), new Date())).toEqual([]);

  });
});
