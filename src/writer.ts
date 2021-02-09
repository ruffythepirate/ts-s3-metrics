import {Metric} from "./metric";
import {Resolution} from "./resolution";
import {MergeMode} from "./merge_mode";

/**
 * Class that writes metrics into an S3 bucket of your choice.
 */
class Writer {

  constructor(s3Bucket: string, mergeMode: MergeMode) {
  }

  /**
   * Writes the metric into the S3 bucket. Metrics are located in the bucket
   * in a path based on their resolution, then group and finally key. Depending on resolution
   * there might then be sub folders created to save the values.
   */
  writeMetrics(resolution: Resolution, group: string, key: string, metrics: Metric[]) {
    
  }

}

export default Writer;
