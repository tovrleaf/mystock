import boto3
import click
import sys

@click.group('stock')
def cli():
  pass

@cli.command('new')
@click.option('-s', '--symbol',
              required=True,
              help='Identifier for share used in Nasdaq')
def add_new_share(symbol):
  dynamodb = boto3.client('dynamodb')
  dynamodb.put_item(
    TableName='mystock_share',
    Item={
      'symbol': {
        'S': symbol
      }
    }
  )
  click.echo('Adding %s as new share.' % symbol)

@cli.command('refresh')
@click.option('-s', '--symbol',
              required=True,
              help='Identifier for share used in Nasdaq')
def update_existing_share(symbol):
  table = boto3.resource('dynamodb').Table('mystock_share')
  response = table.get_item(
    Key={
      'symbol': symbol
    }
  )
  if 'Item' not in response:
    click.secho('Cannot find a share with symbol %s.' % symbol, fg='red')
    sys.exit(128)

  item = response['Item']
  item['price'] = 1

  table.put_item(Item=item)

  click.echo('Updating %s as existing share.' % symbol)
