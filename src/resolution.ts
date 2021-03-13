/**
 * Shows to what resolution values are aggregated to.
 */
export enum Resolution {
  /**
   * On a daily basis.
   */
  Day = 'Day',
  /**
   * No aggregation happens, every unique unix timestamp is put in.
   */
  Raw = 'Raw'
};
