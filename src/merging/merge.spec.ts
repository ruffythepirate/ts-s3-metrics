import {MergeMode} from "./merge-mode"
import {createMetricNow} from "../metric";
import {mergeRawMetrics} from "./merge";

describe('mergeRawMetrics', () => {


  [
    MergeMode.override,
    MergeMode.merge,
    MergeMode.throwOnDuplicate
  ].forEach(m => {
    it(`should merge metrics well for ${m}`, () => {
      const metric = createMetricNow(1.0);
      const metric2 = createMetricNow(2.0);
      metric2.startTimeAsUnixTimestamp += 10;

      const result = mergeRawMetrics([metric], [metric2], m);

      expect(result.length).toBe(2);
    });
  })

  describe(`${MergeMode.override}`, () => {
    it(`should remove duplicates`, () => {
      const metric = createMetricNow(1.0);

      const result = mergeRawMetrics([metric], [metric], MergeMode.override);

      expect(result.length).toBe(1);
    });

    it(`should take the new value`, () => {
      const metric1 = createMetricNow(1.0);
      const metric2 = createMetricNow(2.0);

      metric2.startTimeAsUnixTimestamp = metric1.startTimeAsUnixTimestamp;

      const result = mergeRawMetrics([metric1], [metric2], MergeMode.override);

      expect(result[0]).toEqual(metric2);
    });
  });

  describe(`${MergeMode.merge}`, () => {
    it(`should add both`, () => {
      const metric = createMetricNow(1.0);

      const result = mergeRawMetrics([metric], [metric], MergeMode.merge);

      expect(result.length).toBe(2);
    });
  });

  describe(`${MergeMode.throwOnDuplicate}`, () => {
    it(`should throw on duplicate`, () => {
      const metric = createMetricNow(1.0);

      expect(() => {
        const result = mergeRawMetrics([metric], [metric], MergeMode.throwOnDuplicate);
      }).toThrow();
    });
  });
})
