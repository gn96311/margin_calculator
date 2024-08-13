import fetch from 'node-fetch';
import https from 'https';

export async function load({ fetch }) {
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    let cmbDataResponse = fetch('https://your-domain.com/CBM_COST_DATA.json', { agent });
    let exchangeRateResponse = fetch('https://your-domain.com/api/exchange-rate', { agent });
    let exportDataResponse = fetch('https://your-domain.com/japan_export_data.json', { agent });
    let exportLightDataResponse = fetch('https://your-domain.com/japan_export_data_light.json', { agent });

    let [cmbDataResult, exchangeRateResult, exportDataResult, exportLightDataResult] = await Promise.all([cmbDataResponse, exchangeRateResponse, exportDataResponse, exportLightDataResponse]);

    let datas = await cmbDataResult.json();
    let japanDatas = await exportDataResult.json();
    let japanLightDatas = await exportLightDataResult.json();
    let exchangeRate = await exchangeRateResult.json();
    return { datas: datas, exchangeRate: exchangeRate, japanDatas: japanDatas, japanLightDatas: japanLightDatas };
};