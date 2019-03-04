import requests


class ShareApi(object):

    data = {}

    def __init__(self, symbol):
        self.symbol = symbol

    def get_price(self):
        """Kurssi
        Provided by Nasdaq derived API"""
        return self.__get_data('movement')[0][1]

    def get_divident_yield(self):
        """Osinkotuotto
        Provided by Nasdaq derived API"""
        return self.__get_data('valuation')['dividendYield']

    def get_return_on_equity(self):
        """Tulos/Paaoma
        Provided by Nasdaq derived API"""
        return self.__get_data('interimreports')['adjustedReturnOnEquity12M']

    def get_price_to_earnings(self):
        """P/E
        Provided by Nasdaq derived API"""
        return \
            self.__get_data('valuation')['currentPriceEarningsRatio']['value']

    def get_price_to_sales(self):
        """P/S: market value per share / sales per share
        Provided by Nasdaq derived API"""
        return (self.get_price() / (
                self.__get_data('interimreports')['sales12M'] /
                self.__get_data('interimreports')[
                    'interimReports'][0]['numberOfShares']
                ))

    def get_price_to_book(self):
        """P/B
        Provided by Nasdaq derived API"""
        return self.__get_data('valuation')['latestPriceToBookRatio']

    def __get_data(self, key):
        if key in self.data:
            return self.data[key]

        if key == 'movement':
            self.data[key] = self.__get_movement_for_share(self.symbol)

        if key == 'valuation' or key == 'interimreports':
            self.data[key] = self.__get_balance_for_share(self.symbol, key)

        return self.data[key]

    def __get_movement_for_share(self, name):
        url = ('https://www.kauppalehti.fi/backend/'
               'stock;cache=false;endpoint=stock/'
               'intraday/graph/{}/LATEST')
        r = requests.get(url.format(name))
        r.raise_for_status()
        return r.json()['movement']

    def __get_balance_for_share(self, name, kind):
        url = ('https://www.kauppalehti.fi/backend/'
               'stock;cache=false;endpoint=balance/'
               '{}/{}/5')
        r = requests.get(url.format(kind, name))
        r.raise_for_status()
        return r.json()
