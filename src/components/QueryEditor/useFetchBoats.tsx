import {useEffect, useState} from "react";
import {HOST, STORAGE_USER_KEY} from "../../constants";

interface FetchBoatsResponse {
    boat_uuid: string;
}

interface BoatsOption {
    value: string;
    label: string;
}

export function useFetchBoats(token: string) {
    const [boatsOptions, setBoatsOptions] = useState<BoatsOption[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`https://${HOST}/hdata-boat/api/v1/boat/me?user_id=${localStorage.getItem(STORAGE_USER_KEY)}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })

            const result = await response.json() as FetchBoatsResponse[];

            if (result) {
                const options = result.map(({boat_uuid}) => ({
                    label: boat_uuid,
                    value: boat_uuid,
                }));

                setBoatsOptions(options);
            }
        })();
    }, [token]);

    return boatsOptions;
}
