import {HOST, STORAGE_TOKEN_KEY} from "../../constants";
import {useEffect, useState} from "react";

interface FetchAccessTokenResponse {
    access_token: string;
}

export function useAuth(): string {
    const [token, setToken] = useState('');
    const userToken = localStorage.getItem(STORAGE_TOKEN_KEY);

    useEffect(() => {
        (async () => {
            const response = await fetch(`https://${HOST}/hdata-user/api/v1/user/refresh`, {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: userToken
                })
            });

            const {access_token} = await response.json() as FetchAccessTokenResponse;

            setToken(access_token)
        })();
    }, [userToken])

    return token;
}
