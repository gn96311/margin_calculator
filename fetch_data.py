import requests
import json
import os
from datetime import datetime, timedelta

auth_key = 'inputYourAuthKey'

date = datetime.now()
day_of_week = date.weekday()

if day_of_week == 6:
    date -= timedelta(days=2)
elif day_of_week == 5:
    date -= timedelta(days=1)

search_date = date.strftime('%Y%m%d')
data_type = 'AP01'


url = f'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey={auth_key}&searchdate={search_date}&data={data_type}'

base_dir = os.path.dirname(os.path.abspath(__file__))

response = requests.get(url, verify = False)
response.raise_for_status()
data = response.json()

filename = os.path.join(base_dir, 'static', 'exchange_data.json')

with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)
