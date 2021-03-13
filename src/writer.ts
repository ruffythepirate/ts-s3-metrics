import {Metric, metricToString} from "./metric";
import {MergeMode} from "./merge-mode";
import S3 from 'aws-sdk/clients/s3';
import {MetricKey} from "./metric-key";
import {Builder, IBuilder} from 'builder-pattern';

/**
 * Class that writes metrics into an S3 bucket of your choice.
 */
class Writer {
  s3Bucket!: string;
  mergeMode!: MergeMode;
  s3Client!: S3;

  constructor(s3Bucket: string, mergeMode: MergeMode, s3Client: S3) {
    this.s3Client = s3Client;
    this.s3Bucket = s3Bucket;
    this.mergeMode = mergeMode;
  }

  static builder(): IBuilder<Writer> {
    return Builder(Writer, new Writer('N/A', MergeMode.merge, new S3()));
  }
  
  /**
   * Writes the metric into the S3 bucket. Metrics are located in the bucket
   * in a path based on their resolution, then group and finally key. Depending on resolution
   * there might then be sub folders created to save the values.
   */
  writeMetrics(metricKey: MetricKey,  metrics: Metric[]): Promise<any> {
      return new Promise((resolve, reject) => {
      
        const key = metricKey.getAwsPrefix() + new Date().getUTCFullYear();

        const body = 
          metrics
            .map(metricToString)
            .join('\n');

        const request: S3.Types.PutObjectRequest = {
          Bucket: this.s3Bucket,
          Key: key,
          Body: body
        };

        this.s3Client.putObject(request, (err) => {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }); 
  }
}

export default Writer;
