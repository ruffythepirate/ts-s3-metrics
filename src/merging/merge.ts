import {Metric} from '../metric';
import {MergeMode} from './merge-mode';

type MergeFunction = (oldValue: Metric, newValue: Metric) => Metric[];

export function mergeRawMetrics(oldValues: Metric[], newValues: Metric[], mergeMode: MergeMode): Metric[] {
  return mergeArrays(oldValues, newValues, getMergeFunction(mergeMode));
}

function getMergeFunction(mergeMode: MergeMode): MergeFunction {
  if(mergeMode === MergeMode.override) {
    return (oldValue, newValue) => [ newValue];
  } else if (mergeMode === MergeMode.merge) {
    return (oldValue, newValue) => [oldValue, newValue];
  }
  return (oldValue, newValue) => { throw Error('Duplicate value found!'); }
}

function mergeArrays(oldValues: Metric[], newValues: Metric[], mergeFunction: MergeFunction): Metric[] {
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
