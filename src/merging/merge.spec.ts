import {createMetricNow} from "../metric";
import {mergeRawMetricsWithMerge, mergeRawMetricsWithOverride, mergeRawMetricsWithThrow} from "./merge";

describe('mergeRawMetrics', () => {


  [
    mergeRawMetricsWithMerge,
    mergeRawMetricsWithThrow,
    mergeRawMetricsWithOverride
  ].forEach(fn => {
    it(`should merge metrics well for ${fn}`, () => {
      const metric = createMetricNow(1.0);
      const metric2 = createMetricNow(2.0);
      metric2.startTimeAsUnixTimestamp += 10;

      const result = fn([metric], [metric2]);

      expect(result.length).toBe(2);
    });
  })

  describe(`override`, () => {
    it(`should remove duplicates`, () => {
      const metric = createMetricNow(1.0);

      const result = mergeRawMetricsWithOverride([metric], [metric]);

      expect(result.length).toBe(1);
    });

    it(`should take the new value`, () => {
      const metric1 = createMetricNow(1.0);
      const metric2 = createMetricNow(2.0);

      metric2.startTimeAsUnixTimestamp = metric1.startTimeAsUnixTimestamp;

      const result = mergeRawMetricsWithOverride([metric1], [metric2]);

      expect(result[0]).toEqual(metric2);
    });
  });

  describe(`merge`, () => {
    it(`should add both`, () => {
      const metric = createMetricNow(1.0);

      const result = mergeRawMetricsWithMerge([metric], [metric]);

      expect(result.length).toBe(2);
    });
  });

  describe(`throw`, () => {
    it(`should throw on duplicate`, () => {
      const metric = createMetricNow(1.0);

      expect(() => {
        const result = mergeRawMetricsWithThrow([metric], [metric]);
      }).toThrow();
    });
  });
})
