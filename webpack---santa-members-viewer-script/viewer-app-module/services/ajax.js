const axios = require('axios')
const {
    wixAxiosConfig
} = require('@wix/wix-axios-config');

let isWixAxiosSetuped = false;

function maybeConfigWixAxios(baseURL) {
    if (!isWixAxiosSetuped) {
        wixAxiosConfig(axios, {
            baseURL
        });
        isWixAxiosSetuped = true;
    }
}

function getAjaxJson({
    baseURL,
    url,
    authorizationHeader,
    onSuccess
}) {
    maybeConfigWixAxios(baseURL)
    return axios({
            url,
            method: 'GET',
            headers: {
                Authorization: authorizationHeader
            }
        })
        .then(res => onSuccess(res.data))
        .catch(e => {
            console.log('error fetching data', e.message)
            onSuccess({})
        })
}

function postAjaxJson({
    baseURL,
    url,
    instance,
    payload,
    onSuccess
}) {
    maybeConfigWixAxios(baseURL)
    return axios({
            url,
            method: 'POST',
            headers: {
                Authorization: instance,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload)
        })
        .then(res => onSuccess(res.data))
        .catch(e => {
            console.log('error fetching data', e.message)
            onSuccess({})
        })
}

module.exports = {
    getAjaxJson,
    postAjaxJson
}