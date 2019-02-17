import click
import sys
from stockapi.exceptions import StockNotFoundException
from stockapi.services.stock_service import StockService


@click.group('stock')
def cli():
    pass


@cli.command('new')
@click.option('-s', '--symbol',
              required=True,
              help='Identifier for share used in Nasdaq')
def add_new_share(symbol):
    service = StockService()
    service.insert_share(symbol)
    click.echo('Adding %s as new share.' % symbol)


@cli.command('refresh')
@click.option('-s', '--symbol',
              required=True,
              help='Identifier for share used in Nasdaq')
def update_existing_share(symbol):
    service = StockService()
    try:
        service.update_share(symbol)
    except StockNotFoundException, e:
        click.secho(str(e), fg='red')
        sys.exit(128)

    click.echo('Updating %s as existing share.' % symbol)
