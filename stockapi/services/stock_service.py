import boto3
from stockapi.exceptions import StockNotFoundException


class StockService(object):

    def insert_share(self, symbol):
        dynamodb = boto3.client('dynamodb')
        dynamodb.put_item(
            TableName='mystock_share',
            Item={
                'symbol': {
                    'S': symbol
                }
            }
        )

    def update_share(self, symbol):
        table = boto3.resource('dynamodb').Table('mystock_share')
        response = table.get_item(
            Key={
                'symbol': symbol
            }
        )
        if 'Item' not in response:
            raise StockNotFoundException(
              'Cannot find a share with symbol %s.' % symbol)

        item = response['Item']
        item['price'] = 1

        table.put_item(Item=item)
