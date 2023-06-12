import {useEffect, useState} from "react";
import {HOST} from "../../constants";

enum UserRole {
    Admin = 'ADMIN',
    MultiBoat = 'MULTI_BOAT',
    SingleBoat = 'SINGLE_BOAT',
}

interface FetchUserResponse {
    user_id: number
    user_role: UserRole
}

export function useFetchUser(token: string) {
    const [isAdmin, setIsAdmin] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            const response = await fetch(`https://${HOST}/hdata-user/api/v1/user/me`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })

            const result = await response.json() as FetchUserResponse;

            if (result && result.user_role === UserRole.Admin) {
                setIsAdmin(true)
            }
        })();
    }, [token]);

    return isAdmin;
}
