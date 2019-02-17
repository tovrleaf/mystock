import boto3
import click

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
