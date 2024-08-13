import { json } from '@sveltejs/kit';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';

const cache = new NodeCache({ stdTTL: 3600 });

const fetchExchangeRate = async () => {
    const authKey = 'ifhQ1q8SSUMMSVAqWAtf4OwDaZYeMWDa';

    const date = new Date();

    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) {
        date.setDate(date.getDate() - 2);
    } else if (dayOfWeek === 6) {
        date.setDate(date.getDate() - 1);
    }

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = (date.getDate()).toString().padStart(2, "0");
    const year = date.getFullYear();
    const searchDate = `${year}${month}${day}`;
    const dataType = 'AP01';

    const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authKey}&searchdate=${searchDate}&data=${dataType}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export async function GET() {
    let exchangeRate = cache.get('exchangeRate');

    if (!exchangeRate) {
        console.log('Fetching new exchange rate data...');
        exchangeRate = await fetchExchangeRate();
        cache.set('exchangeRate', exchangeRate);
    } else {
        console.log('Using cached exchange rate data...');
    }
    return json(exchangeRate);
}