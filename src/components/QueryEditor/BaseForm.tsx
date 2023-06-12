import React, {useMemo} from "react";
import {BaseFormSqlProps} from "./types";
import {InlineField, InlineFieldRow, Select} from "@grafana/ui";
import {useSelectableValue} from "./useSelectableValue";
import {useChangeSelectableValue} from "./useChangeSelectableValue";
import {SIMPLE_SQL, SQL} from "../../constants";

const queryTypeOptions = [
    {label: SIMPLE_SQL, value: SIMPLE_SQL, show: true},
    {label: SQL, value: SQL, show: false}
]

const formatTypeOptions = [
    {label: 'Time series', value: 'Time series'},
    {label: 'Table', value: 'Table'}
]

export function BaseForm({isAdmin, ...props}: BaseFormSqlProps) {
    const filteredQueryTypeOptions = useMemo(() => queryTypeOptions.filter(({show}) => show || isAdmin), [isAdmin])

    const onChangeQueryType = useChangeSelectableValue(props, {propertyName: 'queryType', runQuery: true})
    const onChangeFormatType = useChangeSelectableValue(props, {propertyName: 'formatType', runQuery: true})

    const formatType = useSelectableValue(props.query.formatType)
    const queryType = useSelectableValue(props.query.queryType)

    return <InlineFieldRow>
        <InlineField id="queryType" label='Query Type' labelWidth={20}>
            <Select
                inputId="queryType"
                width={35}
                options={filteredQueryTypeOptions}
                defaultValue={filteredQueryTypeOptions[0]}
                onChange={onChangeQueryType}
                value={queryType}
            />
        </InlineField>
        <InlineField id="formatType" label="Format new col" labelWidth={20}>
            <Select
                inputId="formatType"
                width={35}
                options={formatTypeOptions}
                defaultValue={formatTypeOptions[0]}
                onChange={onChangeFormatType}
                value={formatType}
            />
        </InlineField>
        <div className="gf-form gf-form--grow">
            <div className="gf-form-label gf-form-label--grow"/>
        </div>
    </InlineFieldRow>
}