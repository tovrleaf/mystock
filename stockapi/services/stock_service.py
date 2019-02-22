import boto3
from decimal import Decimal
from stockapi.exceptions import StockNotFoundException
from stockapi.stock.stock_share import ShareApi


class StockService(object):

    table_name = 'mystock-shares'

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

        api = ShareApi(name)

        # Kurssi
        item['price'] = api.get_price()
        # Osinkotuotto
        item['dividendYield'] = api.get_divident_yield()
        # Tulos/Poma
        item['returnOnEquity'] = api.get_return_on_equity()
        # P/E
        item['priceToEarnings'] = api.get_price_to_earnings()
        # P/S
        item['priceToSales'] = api.get_price_to_sales()
        # P/B
        item['priceToBook'] = api.get_price_to_book()

        for k, v in item.iteritems():
            if type(v).__name__ == 'float':
                item[k] = Decimal(str(v))
