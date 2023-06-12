import {useEffect, useState} from "react";
import {HOST} from "../../constants";

interface FetchVariablesResponse {
    label: string
    name: string
}

interface VariablesOption {
    value: string
    label: string
}

interface UseFetchVariablesArgs {
    token: string
    uuid?: string
}

export function useFetchVariables({uuid, token}: UseFetchVariablesArgs) {
    const [variablesOptions, setVariablesOptions] = useState<VariablesOption[]>([]);

    useEffect(() => {
        if (uuid) {
            (async () => {
                const response = await fetch(`https://${HOST}/hdata-boat/api/v1/boat/${uuid}/vars`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                })

                const result = await response.json() as FetchVariablesResponse[];

                if (result) {
                    const options = result.map(({name, label}) => ({
                        label,
                        value: name,
                    }));

                    setVariablesOptions(options);
                }
            })();
        }
    }, [token, uuid]);

    return variablesOptions;
}
