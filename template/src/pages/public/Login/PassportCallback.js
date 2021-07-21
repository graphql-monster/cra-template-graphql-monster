import axios from 'axios'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { login } from '../../../app/reducers/userSlice'
import { getGraphqlMonsterClientAppRoot } from '../../../app/utils'

export const tokenFromFacebookCode = async (type, code) => {
    return axios.get(`${getGraphqlMonsterClientAppRoot()}/auth/${type}/callback?code=${code}`)
}

export const PassportCallback = ({ type }) => {
    const location = useLocation()
    const codeRaw = _.get(location, 'search', '').split('?code=')
    const code = codeRaw.length > 1 ? codeRaw[1] : ''


    const history = useHistory()
    const dispatch = useAppDispatch();

    const [error, setError] = useState()

    const showError = (errorMessage) => {
        setError(errorMessage)
        setTimeout(() => {
            history.replace('/login')
        }, 4000)
    }

    useEffect(() => {
        const request = async () => {
            try {
                const data = await tokenFromFacebookCode(type, code)
                dispatch(login(data))
                history.replace('/user/projects')
            } catch (ex) {
                const response = JSON.parse(_.get(ex, 'request.response', '{}'))
                showError(response.error?.message || ex.message)
            }


        }

        if (code) request()
        else showError('User denied')
    })

    return (<>
        {error && <Alert variant={'danger'}>{type} login isn't work due "{error}" You will be redirect back to <Link to="/login">Login</Link></Alert>}
    </>)
}
