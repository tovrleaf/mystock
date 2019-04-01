import boto3
from decimal import Decimal
from stockapi.currency.currency_api import CurrencyApi
from stockapi.exceptions import CurrencyNotFoundException


class CurrencyService(object):

    table_name = 'mystock-currencies'

    def insert_currency(self, currency):
        dynamodb = boto3.client('dynamodb')
        dynamodb.put_item(
            TableName=self.table_name, Item={'currency': {
                'S': currency
            }})

    def update_currency(self, currency):
        table = boto3.resource('dynamodb').Table(self.table_name)
        item = self.__get_item_from_table(table, currency)

        api = CurrencyApi(currency)
        rate = api.get_rate()

        item['rate'] = Decimal(str(rate))
        table.put_item(Item=item)

    def get_all_currencies(self):
        table = boto3.resource('dynamodb').Table(self.table_name)
        response = table.scan()
        return response['Items']

    def __get_item_from_table(self, table, currency):
        response = table.get_item(
            Key={
                'currency': currency
            }
        )
        if 'Item' not in response:
            raise CurrencyNotFoundException(
                'Cannot find a currency with identifier %s.' % currency)

        return response['Item']

    def delete_currency(self, currency):
        table = boto3.resource('dynamodb').Table(self.table_name)
        table.delete_item(
            Key={
                'currency': currency
            }
        )
