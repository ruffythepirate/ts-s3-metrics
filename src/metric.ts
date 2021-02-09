/**
 * Interface describing a metric.
 */
export interface Metric {
  /**
   * The start time of this metric. These metrics might be 
   * read from aggregated values. The developer need to keep
   * track of what aggregation was used for this value in that
   * case
   */
  startTimeAsUnixTimestamp: number
  /**
   * The value of the metric.
   */
  value: number
}
