import boto3
from decimal import Decimal
import requests
from stockapi.exceptions import StockNotFoundException


class StockService(object):

    table_name = 'mystock_share'

    def insert_share(self, symbol):
        dynamodb = boto3.client('dynamodb')
        dynamodb.put_item(
            TableName=self.table_name, Item={'symbol': {
                'S': symbol
            }})

    def update_share(self, symbol):
        table = boto3.resource('dynamodb').Table(self.table_name)
        response = table.get_item(
            Key={
                'symbol': symbol
            }
        )
        if 'Item' not in response:
            raise StockNotFoundException(
                'Cannot find a share with symbol %s.' % symbol)

        item = response['Item']

        self.__update_item_by_name(symbol, item)

        table.put_item(Item=item)

    def __update_item_by_name(self, name, item):

        def get_movement_for_share(name):
            url = ('https://www.kauppalehti.fi/backend/'
                   'stock;cache=false;endpoint=stock/'
                   'intraday/graph/{}/LATEST')
            r = requests.get(url.format(name))
            r.raise_for_status()
            return r.json()['movement']

        def get_balance_for_share(name, kind):
            url = ('https://www.kauppalehti.fi/backend/'
                   'stock;cache=false;endpoint=balance/'
                   '{}/{}/5')
            r = requests.get(url.format(kind, name))
            r.raise_for_status()
            return r.json()

        valuation = get_balance_for_share(name, 'valuation')
        interimreports = get_balance_for_share(name, 'interimreports')
        share_price = get_movement_for_share(name)[0][1]

        def f2d(v):
            """Float to Decimal"""
            return Decimal(str(v))

        # Kurssi
        item['price'] = f2d(share_price)
        # Osinkotuotto
        item['dividendYield'] = f2d(valuation['dividendYield'])
        # Tulos/Poma
        item['returnOnEquity'] = f2d(
            interimreports['adjustedReturnOnEquity12M'])
        # P/E
        item['priceToEarnings'] = f2d(
            valuation['currentPriceEarningsRatio']['value'])
        # P/S: market value per share / sales per share
        item['priceToSales'] = f2d(
            share_price /
            ((interimreports['sales12M'])
             / interimreports['interimReports'][0]['numberOfShares']))
        # P/B
        item['priceToBook'] = f2d(valuation['latestPriceToBookRatio'])
