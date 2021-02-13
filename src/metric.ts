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

export function metricFromString(raw: string): Metric {
  const chunks = raw.split(';');
  return {
    startTimeAsUnixTimestamp: parseInt(chunks[0]),
    value: parseFloat(chunks[1])
  }

}

export function metricToString(metric: Metric): string {
  return `${metric.startTimeAsUnixTimestamp};${metric.value}`;
}
