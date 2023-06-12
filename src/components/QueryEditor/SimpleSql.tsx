import React from 'react';
import {InlineField, InlineFieldRow, MultiSelect, Select} from "@grafana/ui";
import {useChangeSelectableValue} from "./useChangeSelectableValue";
import type {EditorProps} from './types'
import {useSelectableValue} from "./useSelectableValue";
import {useAuth} from "./useAuth";
import {useFetchBoats} from "./useFetchBoats";
import {SIMPLE_SQL} from "../../constants";
import {useFetchVariables} from "./useFetchVariables";
import {useMultiSelectableValue} from "./useMultiSelectableValue";

const aggregationOptions = [
    {
        label: 'avg',
        value: 'avg'
    },
    {
        label: 'min',
        value: 'min'
    },
    {
        label: 'max',
        value: 'max'
    },
    {
        label: 'first',
        value: 'first'
    },
    {
        label: 'last',
        value: 'last'
    },
    {
        label: 'count',
        value: 'count'
    },
    {
        label: 'sum',
        value: 'sum'
    },
];

const defaultAggregationValue = {
    label: 'Select aggregation',
    value: ''
};

const intervalOptions = [
    {
        label: '1s',
        value: '1s'
    },
    {
        label: '10s',
        value: '10s'
    },
    {
        label: '1m',
        value: '1m'
    },
    {
        label: '10m',
        value: '10m'
    },
    {
        label: '1h',
        value: '1h'
    },
    {
        label: '1d',
        value: '1d'
    },
    {
        label: '1M',
        value: '1M'
    },
    {
        label: '1y',
        value: '1y'
    },
];

const defaultIntervalValue = {
    label: 'Select interval',
    value: ''
};

const defaultBoatValue = {
    label: 'Select boat uuid',
    value: ''
};

const partitionByOptions = [
    {
        label: 'Boat uuid',
        value: 'boat_uuid'
    },
    {
        label: 'Variable name',
        value: 'variable_name'
    },
];

export function SimpleSql(props: EditorProps) {
    const onChangeAggregation = useChangeSelectableValue(props, {propertyName: 'aggregation', runQuery: true})
    const onChangeInterval = useChangeSelectableValue(props, {propertyName: 'interval', runQuery: true})
    const onChangeBoat = useChangeSelectableValue(props, {propertyName: 'boat', runQuery: true})
    const onChangeVariables = useChangeSelectableValue(props, {
        propertyName: 'variables',
        runQuery: true,
        isMulti: true
    })
    const onChangePartitionBy = useChangeSelectableValue(props, {
        propertyName: 'partitionBy',
        runQuery: true,
        isMulti: true
    })

    const aggregation = useSelectableValue(props.query.aggregation)
    const interval = useSelectableValue(props.query.interval)
    const boat = useSelectableValue(props.query.boat)
    const variables = useMultiSelectableValue(props.query.variables)
    const partitionBy = useMultiSelectableValue(props.query.partitionBy)

    const token = useAuth()
    const boatOptions = useFetchBoats(token)
    const variableOptions = useFetchVariables({token, uuid: boat?.value})

    if (!props.query.queryType || props.query.queryType !== SIMPLE_SQL) {
        return null
    }

    return <InlineFieldRow>
        <InlineFieldRow>
            <InlineField id="partitionBy" label="Partition By" labelWidth={20}>
                <MultiSelect
                    inputId="partitionBy"
                    width={35}
                    options={partitionByOptions}
                    placeholder="Select partition by"
                    onChange={onChangePartitionBy}
                    value={partitionBy}
                />
            </InlineField>
            <InlineField id="boats" label="Uuid" labelWidth={20}>
                <Select
                    inputId="boats"
                    width={35}
                    options={[defaultBoatValue, ...boatOptions]}
                    defaultValue={defaultBoatValue}
                    onChange={onChangeBoat}
                    value={boat}
                />
            </InlineField>
            {Boolean(variableOptions.length) && <InlineField id="variables" label="Variables" labelWidth={20}>
                <MultiSelect
                    inputId="variables"
                    width={35}
                    options={variableOptions}
                    placeholder="Select variables"
                    onChange={onChangeVariables}
                    value={variables}
                />
            </InlineField>}
        </InlineFieldRow>
        <InlineFieldRow>
            <InlineField id="aggregation" label="Aggregation" labelWidth={20}>
                <Select
                    inputId="aggregation"
                    width={35}
                    options={[defaultAggregationValue, ...aggregationOptions]}
                    defaultValue={defaultAggregationValue}
                    onChange={onChangeAggregation}
                    value={aggregation}
                />
            </InlineField>
            <InlineField id="interval" label="Interval" labelWidth={20}>
                <Select
                    inputId="interval"
                    width={35}
                    options={[defaultIntervalValue, ...intervalOptions]}
                    defaultValue={defaultIntervalValue}
                    onChange={onChangeInterval}
                    value={interval}
                />
            </InlineField>
        </InlineFieldRow>
    </InlineFieldRow>
}
