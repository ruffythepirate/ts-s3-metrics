import S3 from 'aws-sdk/clients/s3';
import {v4 as uuid} from 'uuid';
import {createMetricNow} from './metric';
import {Resolution} from './resolution';
import {MetricKey} from './metric-key';
import Writer from './writer'
import {Reader} from "./reader";

describe('Integration Test raw data', () => {

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

    await s3Client.createBucket(
      {
        Bucket: bucketName
      }
    ).promise();
  });

  it('Saves and reads data.', async () => {
    const key = new MetricKey('group', 'key', Resolution.Day);
    const metricsToWrite = [createMetricNow(5.5)];
    await writer.writeMetrics(key, metricsToWrite);
    const response = await reader.readMetrics(key, new Date(), new Date());
    expect(response).toEqual(metricsToWrite);
  });

});
