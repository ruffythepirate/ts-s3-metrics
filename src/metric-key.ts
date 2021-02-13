import {Resolution} from "./resolution";

/**
 * The metric key is a representation that allows you to find a metric.
 * The metrics are defined along three dimensions: their resolution,
 * what group they belong to and finally the metric's name.
 */
export class MetricKey {

  constructor(public group: string, public key: string, resolution: Resolution) {
  }

  /**
   * Gets the AWS prefix where you would expect to find entries
   * for this key. Within this prefix it is also expected to further
   * find folders based on what date the metrics were written.
   */
  getAwsPrefix(): string {
    return [this.group, this.resolution + '', this.key]
    .map(this.sanitizeInput)
    .join('/')
  }

  /**
   * Function that sanitizes keys etc. when creating paths
   */
  sanitizeInput: (string) => string = 
    (string) => {
    return string.replace('/', '_');
  }

}
