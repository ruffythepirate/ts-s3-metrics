import S3 from 'aws-sdk/clients/s3';
import {MetricKey} from './metric-key';
import {Metric} from './metric';

/**
 * Class that supports reading metrics from S3. It initializes an
 * S3 client, and then uses this to read metrics based on their key
 * and a time interval.
 */
export class Reader {

  s3Client: S3; 

  constructor(public s3Bucket: string) {
    this.s3Client = new S3();
  }

  /**
   * Reads all the metrics for the given key that are within the given time interval.
   */
  readMetrics(key: MetricKey, from: Date, to: Date): Promise<Metric[]> {
    return new Promise((resolve, reject) => {
      const request: S3.Types.ListObjectsV2Request = {
        Bucket: this.s3Bucket,
        Prefix: key.getAwsPrefix()
      }

      this.s3Client.listObjectsV2(listParams, (err, data) => {
        if(err) {
          reject(err);
        } else {
          allObjectRequests = data.Contents?.map((object) => this.readMetricsFromObject(object.Key)
          );
          const allRequestPromise = Promise.all(allObjectRequests);

          allRequestPromise.then((result) => {
            allMetrics = result.flat();

            resolve(allMetrics);
          }, reject);
        }

      });

    });
  }

  readMetricsFromFile(objectKey: string) : Promise<Metrics[]> {
    return new Promise((resolve, reject) => {
      const request: S3.Types.GetObjectRequest = {
        Bucket: this.s3Bucket,
        Key: objectKey,
      }

      this.s3Client.getObject(request, (err, data) => {
        if(err) {
          reject(err);
        } else {
          const bodyAsString = data.Body.toString('utf-8');

          bodyAsString
          .split('\n')
          .map(Metric.fromString);:w
          
        }
      });
    });
  }
}
