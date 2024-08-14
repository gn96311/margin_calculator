import https from 'https';
import fs from 'fs';

export async function load({ fetch }) {
	const ca = fs.readFileSync('/etc/letsencrypt/live/margin-calculator.site/cert.pem');
	const agent = new https.Agent({ca});
    let cmbDataResponse = fetch('/CBM_COST_DATA.json', { agent });
    let exchangeRateResponse = fetch('/api/exchange-rate', { agent });
    let exportDataResponse = fetch('/japan_export_data.json', { agent });
    let exportLightDataResponse = fetch('/japan_export_data_light.json', { agent });
    let [cmbDataResult, exchangeRateResult, exportDataResult, exportLightDataResult] = await Promise.all([cmbDataResponse, exchangeRateResponse, exportDataResponse, exportLightDataResponse]);

    let datas = await cmbDataResult.json();
    let japanDatas = await exportDataResult.json();
    let japanLightDatas = await exportLightDataResult.json();
    let exchangeRate = await exchangeRateResult.json();
    return { datas: datas, exchangeRate: exchangeRate, japanDatas: japanDatas, japanLightDatas: japanLightDatas };
};
