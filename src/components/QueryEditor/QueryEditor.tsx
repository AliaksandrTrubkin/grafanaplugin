import React from 'react'
import type {EditorProps} from './types'
import {SIMPLE_SQL} from "../../constants";
import {Sql} from "./Sql";
import {BaseForm} from "./BaseForm";
import {SimpleSql} from "./SimpleSql";
import {useFetchUser} from "./useFetchUser";
import {useAuth} from "./useAuth";


export function QueryEditor(props: EditorProps) {
    const {query} = props;
    if (!query.queryType) {
        query.queryType = SIMPLE_SQL
    }
    if (!query.formatType) {
        query.formatType = "Time series"
        query.queryType = SIMPLE_SQL
    }

    const token = useAuth()
    const isAdmin = useFetchUser(token)

    return (
        <div className='gf-form-group'>
            <BaseForm {...props} isAdmin={isAdmin}/>
            <SimpleSql {...props} token={token} isAdmin={isAdmin}/>
            <Sql {...props}/>
        </div>
    );
}


