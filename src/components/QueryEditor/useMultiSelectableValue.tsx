import {useMemo} from "react";
import {SelectableValue} from "@grafana/data";

export function useMultiSelectableValue(value?: SelectableValue[]): Array<SelectableValue<string>> | undefined {
    return useMemo(() => {
        if (!value) {
            return [];
        }

        return value.map(({value, label}) => ({
            label,
            value
        }))
    }, [value]);
}
