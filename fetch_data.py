import requests
import json
from datetime import datetime, timedelta

auth_key = 'ifhQ1q8SSUMMSVAqWAtf4OwDaZYeMWDa'

date = datetime.now()
day_of_week = date.weekday()

if day_of_week == 6:
    date -= timedelta(days=2)
elif day_of_week == 5:
    date -= timedelta(days=1)

search_date = date.strftime('%Y%m%d')
data_type = 'AP01'


url = f'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey={auth_key}&searchdate={search_date}&data={data_type}'

timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

response = requests.get(url)
response.raise_for_status()
data = response.json()

filename = f'./static/exchange_data.json'

with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)
