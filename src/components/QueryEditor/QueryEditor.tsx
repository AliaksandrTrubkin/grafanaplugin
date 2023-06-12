import React, {ReactElement} from 'react'
import {InlineField, InlineFieldRow, Select} from '@grafana/ui'
import {useSelectableValue} from './useSelectableValue'
import {useChangeSelectableValue} from './useChangeSelectableValue'
import type {EditorProps} from './types'
import {SimpleSql} from "./SimpleSql";
import {SIMPLE_SQL, SQL} from "../../constants";
import {Sql} from "./Sql";

const queryTypeOptions = [
    {label: SIMPLE_SQL, value: SIMPLE_SQL},
    {label: SQL, value: SQL}
]

export function QueryEditor(props: EditorProps): ReactElement {
    const {query} = props;
    if (!query.queryType) {
        query.queryType = SIMPLE_SQL
    }

    const onChangeQueryType = useChangeSelectableValue(props, {propertyName: 'queryType', runQuery: true})

    return (
        <div className='gf-form-group'>
            <InlineFieldRow>
                <InlineField id="queryType" label='Query Type' labelWidth={20}>
                    <Select
                        inputId={"queryType"}
                        width={20}
                        options={queryTypeOptions}
                        defaultValue={queryTypeOptions[0]}
                        onChange={onChangeQueryType}
                        value={useSelectableValue(query.queryType)}
                    />
                </InlineField>
                <div className="gf-form gf-form--grow">
                    <div className="gf-form-label gf-form-label--grow"></div>
                </div>
            </InlineFieldRow>
            <SimpleSql {...props} />
            <Sql {...props}/>
        </div>
    );
}


