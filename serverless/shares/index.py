import boto3
import json


def list_shares(event, context):
    table = boto3.resource('dynamodb').Table('mystock-shares')
    response = table.scan()

    ret = {}
    for i in response['Items']:
        obj = item_to_body(i)
        ret[obj['symbol']] = obj
    return form_response(ret)


def get_share(event, context):

    symbol = event['pathParameters']['symbol']
    table = boto3.resource('dynamodb').Table('mystock-shares')
    response = table.get_item(
        Key={
            'symbol': symbol
        }
    )

    if 'Item' not in response:
        return form_response(
            'Cannot find a share with symbol %s.' % symbol, 404)

    return form_response(item_to_body(response['Item']))


def form_response(payload, status_code=200):
    return {
        'statusCode': status_code,
        'body': json.dumps(payload),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    }


def item_to_body(row):
    obj = {}
    for key, val in row.iteritems():
        obj[key] = str(val)

    return obj
