export async function load({ fetch }) {
    let cmbDataResponse = fetch('/CBM_COST_DATA.json');
    let exchangeRateResponse = fetch('/exchange_data.json');
    let exportDataResponse = fetch('/japan_export_data.json');
    let exportLightDataResponse = fetch('/japan_export_data_light.json');
    let [cmbDataResult, exchangeRateResult, exportDataResult, exportLightDataResult] = await Promise.all([cmbDataResponse, exchangeRateResponse, exportDataResponse, exportLightDataResponse]);

    let datas = await cmbDataResult.json();
    let japanDatas = await exportDataResult.json();
    let japanLightDatas = await exportLightDataResult.json();
    let exchangeRate = await exchangeRateResult.json();
    return { datas: datas, exchangeRate: exchangeRate, japanDatas: japanDatas, japanLightDatas: japanLightDatas };
};