import {metricToString, metricFromString} from "./metric";

describe('Metric', () => {

  describe('Transform', () => {

    [
      {startTimeAsUnixTimestamp: 5, value: 4.64},
      {startTimeAsUnixTimestamp: 50000, value: 4},
    ].map( testCase => {
      it(`correctly translates ${testCase}`, () => {
        const asString = metricToString(testCase);
        expect(metricFromString(asString)).toEqual(testCase);
      });
    });
  });
});
