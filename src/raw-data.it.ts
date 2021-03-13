import S3 from 'aws-sdk/clients/s3';
import {v4 as uuid} from 'uuid';
import {createMetricNow} from './metric';
import {Resolution} from './resolution';
import {MetricKey} from './metric-key';
import Writer from './writer'

describe('Integration Test raw data', () => {

  let s3Client: S3;
  let bucketName: string;
  beforeEach(async () => {

    s3Client = new S3({
      endpoint: 'http://localhost:4566/',
      accessKeyId: "123",
      secretAccessKey: "abc",
      sslEnabled: false,
      s3ForcePathStyle: true

    });

    bucketName = uuid();

    await s3Client.createBucket(
      {
        Bucket: bucketName
      }
    ).promise();
  });

  it('runs a test', async () => {
    const writer:Writer = Writer
      .builder()
      .s3Client(s3Client)
      .s3Bucket(bucketName)
      .build();

    const key = new MetricKey('group', 'key', Resolution.Day);
    await writer.writeMetrics(key, [createMetricNow(5.5)]);
  });

});
