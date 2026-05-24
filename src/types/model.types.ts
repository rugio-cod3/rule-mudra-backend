import { Knex } from 'knex'

export type WhereQuery<T> =
  | Partial<T>
  | ((query: Knex.QueryBuilder) => any)
  | AlternateWhere<T>[]

export type UpdateQuery<T> = Partial<T>

export type SelectFields<T> = T[] | ['*']

type SortItem<T> =
  | T
  | { column: T; order?: 'asc' | 'desc'; nulls?: 'first' | 'last' }

export type SortCriteria<T> = SortItem<T>[]

export type InsertData<T> = T

export type DeleteWhere<T> = {
  column: T
  operator?: string
  value: string | number | boolean
}[]

export type AlternateWhere<T> = {
  [K in keyof T]: {
    column: K
    operator?: string
    value: T[K]
  }
}[keyof T]

export type WhereIn<T> = { column: T; value: string[] | number[] | boolean[] }

export type WhereRaw = {
  rawQuery: string
  values: string[] | number[] | boolean[]
}

export type WhereNotNull<T> = T[]
export type WhereNot<T> = WhereQuery<T>
export type Paginate = { page: number; perPage: number }

export type KnexFindParams<TModel, TSelectModel extends keyof TModel> = {
  where?: WhereQuery<TModel>
  select?: SelectFields<TSelectModel>
  order?: SortCriteria<TSelectModel>
  whereIn?: WhereIn<TSelectModel>[]
  whereRaw?: WhereRaw[]
  whereNotNull?: WhereNotNull<TSelectModel>
  whereNot?: WhereNot<TModel>
  paginate?: Paginate
  sum?: SelectFields<TSelectModel>
}

export enum Operators {
  NOT_EQUALS = '!=',
}
