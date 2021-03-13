import S3 from 'aws-sdk/clients/s3';
import {MetricKey} from './metric-key';
import {Metric, metricFromString} from './metric';
import {MergeMode} from "./merge-mode";
import {Builder, IBuilder} from "builder-pattern";

/**
 * Class that supports reading metrics from S3. It initializes an
 * S3 client, and then uses this to read metrics based on their key
 * and a time interval.
 */
export class Reader {

  s3Client: S3;
  s3Bucket: string;

  constructor(s3Bucket: string, s3Client: S3) {
    this.s3Client = s3Client;
    this.s3Bucket = s3Bucket;
  }

  static builder(): IBuilder<Reader> {
    return Builder(Reader, new Reader('N/A', new S3()));
  }

  /**
   * Reads all the metrics for the given key that are within the given time interval.
   * @param key
   * The metric we are looking for.
   * @param from
   * The date from which we want to read the metrics
   * @param to
   * The to date we want to read the metrics to.
   */
  readMetrics(key: MetricKey, from: Date, to: Date): Promise<Metric[]> {
    return new Promise((resolve, reject) => {
      const request: S3.Types.ListObjectsV2Request = {
        Bucket: this.s3Bucket,
        Prefix: key.getAwsPrefix()
      }

      this.s3Client.listObjectsV2(request, (err, data) => {
        if(err) {
          reject(err);
        } else {
          const allObjectRequests = data.Contents!.
          filter(obj => obj?.Key !== undefined)
          .map(
            (object) => this.readMetricsFromObject(object.Key as string)
          );
          const allRequestPromise = Promise.all(allObjectRequests);

          allRequestPromise.then((result) => {
            const allMetrics = result.reduce((a, v) => a.concat(v), []);

            resolve(allMetrics);
          }, reject);
        }

      });

    });
  }

  private readMetricsFromObject(objectKey: string) : Promise<Metric[]> {
    return new Promise((resolve, reject) => {
      const request: S3.Types.GetObjectRequest = {
        Bucket: this.s3Bucket,
        Key: objectKey,
      }

      this.s3Client.getObject(request, (err, data) => {
        if(err) {
          reject(err);
        } else {
          const bodyAsString = data?.Body ? data.Body.toString('utf-8'): '';
          const response = bodyAsString
          .split('\n')
          .map(metricFromString);

          resolve(response);
        }
      });
    });
  }
}
