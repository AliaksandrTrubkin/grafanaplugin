import type {QueryEditorProps} from '@grafana/data'
import type {DataSource} from 'datasource'
import type {DataSourceOptions, Query} from '../../types'

export type EditorProps = QueryEditorProps<DataSource, Query, DataSourceOptions>

export interface SimpleSqlProps extends EditorProps {
    token: string
    isAdmin: boolean
}

export interface BaseFormSqlProps extends EditorProps {
    isAdmin: boolean
}
