import {DataQuery, DataSourceJsonData, SelectableValue} from '@grafana/data'

export interface Query extends DataQuery {
    alias?: string
    colNameFormatStr: string
    colNameToGroup: string
    formatType: string
    queryType: string
    sql: string
    timeShiftPeriod: number
    timeShiftUnit: string
    expression: string
    aggregation?: string
    interval?: string
    boat?: string
    partitionBy?: SelectableValue[]
    variables?: SelectableValue[]
}

export const DEFAULT_QUERY: Partial<Query> = {
    sql: 'show databases'
};

/**
 * These are options configured for each DataSource instance
 */
export interface DataSourceOptions extends DataSourceJsonData {
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface SecureJsonData {
    url?: string
    user?: string
    password?: string
    token?: string
    basicAuth?: string
    basicAuthPassword?: string
}

export type ChangeOptions<T> = {
    propertyName: keyof T;
    runQuery: boolean
    isMulti?: boolean
    customValue?: boolean
    defaultValue?: String
}
