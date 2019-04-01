import requests
import urllib


class CurrencyApi(object):

    def __init__(self, currency):
        self.data = {}
        self.currency = currency

    def get_rate(self):
        """Kurssi
        """
        return self.__get_data(self.currency)['data'][0][1]

    def __get_data(self, key):
        if key in self.data:
            return self.data[key]

        try:
            url = (
                'https://fx-rate.net/json.php?'
                'days=30day&currency=EUR&currency_pair={}'
                )
            r = requests.get(url.format(urllib.quote_plus(key)))
            r.raise_for_status()
            json = r.json()
            self.data[key] = json
        except requests.exceptions.HTTPError:
            self.data[key] = None

        return self.data[key]
