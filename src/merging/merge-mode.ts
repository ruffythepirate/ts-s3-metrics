/**
 * Depicts ways that data can be merged if data already exists
 * for metrics that should be written.
 */
export enum MergeMode {
  /**
   * The values gets merged with the preexisting values.
   */
  merge,
  /**
   * If there are preexisting values an exception is thrown.
   */
  throwOnDuplicate,
  /**
   * If there are preexisting values they are overriden by the new values.
   */
  override
}
