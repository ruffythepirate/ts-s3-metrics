import {Metric} from '../metric';
import {MergeMode} from './merge-mode';

/**
 * Type for a function merging two values with the same time together.
 */
export type MergeValuesFn = (oldValue: Metric, newValue: Metric) => Metric[];

/**
 * Type for a function merging two arrays together.
 */
export type MergeArraysFn = (oldValues: Metric[], newValues: Metric[]) => Metric[];

/**
 * Merges the two metrics arrays. If a value is found at the same time, only the value from the newValues array will be used.
 */
export const mergeRawMetricsWithOverride = createMergeFunction((oldValue, newValue) => [newValue]);

/**
 * Merges the two metrics arrays. If a value is found at the same time, both values will be used.
 */
export const mergeRawMetricsWithMerge = createMergeFunction((oldValue, newValue) => [oldValue, newValue]);

/**
 * Merges the two metrics arrays. If a value is found at the same time an exception is thrown.
 */
export const mergeRawMetricsWithThrow = createMergeFunction((oldValue, newValue) => {
  throw Error('Duplicate value found!');
});

/**
 * Used to create a merge function for two arrays. The provided function handles when both arrays have an item with the same timestamp.
 */
export function createMergeFunction(mergeValuesFn: MergeValuesFn): MergeArraysFn {
  return function(oldValues: Metric[], newValues: Metric[]) {
    return mergeArrays(oldValues, newValues, mergeValuesFn);
  }
}

function mergeArrays(oldValues: Metric[], newValues: Metric[], mergeFunction: MergeValuesFn): Metric[] {
  const newArray = [];

  let i = 0;
  let j = 0;

  while(i < oldValues.length && j < oldValues.length) {
    if(oldValues[i].startTimeAsUnixTimestamp === newValues[j].startTimeAsUnixTimestamp) {

      const addValues = mergeFunction(oldValues[i++], newValues[j++]);
      newArray.push(...addValues);
    } else if (oldValues[i].startTimeAsUnixTimestamp < newValues[j].startTimeAsUnixTimestamp) {
      newArray.push(oldValues[i++]);
    } else {
      newArray.push(newValues[j++]);
    }
  }
  return newArray.concat(oldValues.slice(i)).concat(newValues.slice(j));
}
