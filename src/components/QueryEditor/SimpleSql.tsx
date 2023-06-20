import React from 'react';
import {InlineField, InlineFieldRow, Input, MultiSelect, Select} from "@grafana/ui";
import {useChangeSelectableValue} from "./useChangeSelectableValue";
import {useSelectableValue} from "./useSelectableValue";
import {useFetchBoats} from "./useFetchBoats";
import {SIMPLE_SQL} from "../../constants";
import {useFetchVariables} from "./useFetchVariables";
import {useMultiSelectableValue} from "./useMultiSelectableValue";
import {SimpleSqlProps} from "./types";
import {useChangeOptions} from "./useChangeOptions";

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

const filteringOptions = [
    {
        label: '>',
        value: '>'
    },
    {
        label: '>=',
        value: '>='
    },
    {
        label: '<',
        value: '<'
    },
    {
        label: '<=',
        value: '<='
    },
    {
        label: '=',
        value: '='
    }
];

const defaultIntervalValue = {
    label: 'Select interval',
    value: ''
};

const defaultBoatValue = {
    label: 'Select boat',
    value: ''
};

const partitionByOptions = [
    {
        label: 'Variable name',
        value: 'variable_name'
    },
];

const defaultFilteringOptions = {
    label: 'Select filter',
    value: ''
}

export function SimpleSql({token, isAdmin, ...props}: SimpleSqlProps) {
    const onChangeAggregation = useChangeSelectableValue(props, {propertyName: 'aggregation', runQuery: true})
    const onChangeInterval = useChangeSelectableValue(props, {propertyName: 'interval', runQuery: true})
    const onChangeBoat = useChangeSelectableValue(props, {propertyName: 'boat', runQuery: true})
    const onChangeFilter = useChangeSelectableValue(props, {propertyName: 'filter', runQuery: true})
    const onChangeFilterValue = useChangeOptions(props, {propertyName: 'filterValue', runQuery: false})
    const onBlurFilterValue = useChangeOptions(props, {propertyName: 'filterValue', runQuery: true})
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
    const filter = useSelectableValue(props.query.filter)
    const variables = useMultiSelectableValue(props.query.variables)
    const partitionBy = useMultiSelectableValue(props.query.partitionBy)

    const boatOptions = useFetchBoats(token)
    const variableOptions = useFetchVariables({token, uuid: boat?.value})

    const generatedSql = props.datasource.lastSimpleSql;

    if (!props.query.queryType || props.query.queryType !== SIMPLE_SQL) {
        return null
    }

    return <>
        <InlineFieldRow>
            <InlineField id="boats" label="Boat name" labelWidth={20}>
                <Select
                    inputId="boats"
                    width={25}
                    options={[defaultBoatValue, ...boatOptions]}
                    defaultValue={defaultBoatValue}
                    onChange={onChangeBoat}
                    value={boat}
                />
            </InlineField>
            <InlineField id="variables" label="Variables" labelWidth={20}>
                <MultiSelect
                    inputId="variables"
                    width={25}
                    options={variableOptions}
                    placeholder="Select variables"
                    onChange={onChangeVariables}
                    value={variables}
                />
            </InlineField>
            <InlineField id="partitionBy" label="Partition By" labelWidth={20}>
                <MultiSelect
                    inputId="partitionBy"
                    width={25}
                    options={partitionByOptions}
                    placeholder="Select partition by"
                    onChange={onChangePartitionBy}
                    value={partitionBy}
                />
            </InlineField>
            <div className="gf-form gf-form--grow">
                <div className="gf-form-label gf-form-label--grow"/>
            </div>
        </InlineFieldRow>
        <InlineFieldRow>
            <InlineField id="aggregation" label="Aggregation" labelWidth={20}>
                <Select
                    inputId="aggregation"
                    width={25}
                    options={[defaultAggregationValue, ...aggregationOptions]}
                    defaultValue={defaultAggregationValue}
                    onChange={onChangeAggregation}
                    value={aggregation}
                />
            </InlineField>
            <InlineField id="interval" label="Interval" labelWidth={20}>
                <Select
                    inputId="interval"
                    width={25}
                    options={[defaultIntervalValue, ...intervalOptions]}
                    defaultValue={defaultIntervalValue}
                    onChange={onChangeInterval}
                    value={interval}
                />
            </InlineField>
            <InlineField id="filtering" label="Filter" labelWidth={20}>
                <>
                    <Select
                        inputId="filtering"
                        width={25}
                        options={[defaultFilteringOptions, ...filteringOptions]}
                        defaultValue={defaultFilteringOptions}
                        onChange={onChangeFilter}
                        value={filter}
                    />
                    <Input
                        width={25}
                        placeholder="Filter value"
                        onChange={onChangeFilterValue}
                        onBlur={onBlurFilterValue}
                        value={props.query.filterValue}
                    />
                </>
            </InlineField>
        </InlineFieldRow>
        {isAdmin && <InlineField label="Sql output" labelWidth={20} grow>
            <Input
                style={{"width": "100%"}}
                className="min-width-30 max-width-100 gf-form--grow"
                width={100}
                disabled
                value={generatedSql}
            />
        </InlineField>}
    </>
}
