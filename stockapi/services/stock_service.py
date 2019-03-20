import boto3
from decimal import Decimal
from stockapi.exceptions import StockNotFoundException
from stockapi.stock.share_api import ShareApi


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
        item = self.__get_item_from_table(table, symbol)

        self.__update_item_by_name(symbol, item)

        table.put_item(Item=item)

    def get_all_shares(self):
        table = boto3.resource('dynamodb').Table(self.table_name)
        response = table.scan()
        return response['Items']

    def delete_share(self, symbol):
        table = boto3.resource('dynamodb').Table(self.table_name)
        table.delete_item(
            Key={
                'symbol': symbol
            }
        )

    def update_inderes(self, symbol, instruction, amount,
                       target_price, purchase_price):
        table = boto3.resource('dynamodb').Table(self.table_name)
        item = self.__get_item_from_table(table, symbol)

        item['inderesInstruction'] = instruction
        item['amountOfStocks'] = amount
        item['inderesTargetPrice'] = Decimal(str(target_price))
        item['purchasePrice'] = Decimal(str(purchase_price))

        table.put_item(Item=item)

    def __get_item_from_table(self, table, symbol):
        response = table.get_item(
            Key={
                'symbol': symbol
            }
        )
        if 'Item' not in response:
            raise StockNotFoundException(
                'Cannot find a share with symbol %s.' % symbol)

        return response['Item']

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
            if type(v).__name__ == 'NoneType':
                item[k] = '-'
