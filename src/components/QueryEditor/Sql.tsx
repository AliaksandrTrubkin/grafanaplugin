import React from 'react'
import {EditorProps} from "./types";
import {InlineField, InlineFieldRow, Input} from "@grafana/ui";
import {useChangeOptions} from "./useChangeOptions";
import {SQL} from "../../constants";

export function Sql(props: EditorProps) {
    const onChangeSql = useChangeOptions(props, {propertyName: 'sql', runQuery: false})
    const onBlurSql = useChangeOptions(props, {propertyName: 'sql', runQuery: true})

    if (!props.query.queryType || props.query.queryType !== SQL) {
        return null
    }

    return <InlineFieldRow>
        <InlineField label='Input Sql' labelWidth={20} tooltip='' grow>
            <Input
                width={100}
                className={'min-width-30 max-width-100 gf-form--grow'}
                placeholder={'select avg(mem_system)  from log.dnodes_info where ts >= $from and ts < $to interval($interval)'}
                onChange={onChangeSql}
                onBlur={onBlurSql}
                value={props.query.sql}
            />
        </InlineField>
    </InlineFieldRow>
}
