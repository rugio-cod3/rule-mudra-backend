/**
 * Cache Dependency Types
 * This interface defines the relationships between different cache types
 * and which cache should be invalidated when a specific type is updated.
 */
export interface ICacheDependency {
  /** Cache key prefix */
  prefix: string

  /** Pattern for cache invalidation */
  pattern: string

  /**
   * Dependencies that should be invalidated when this cache is updated
   * These are the other cache types that depend on this data
   */
  dependencies?: string[]
}
// File: src/interfaces/cache.interface.ts
/**
 * Cache Resource Map
 * Maps cache tags to their corresponding resource configuration
 */
export interface ICacheResourceMap {
  [key: string]: ICacheDependency
}
