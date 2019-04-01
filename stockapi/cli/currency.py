import click
import sys
from stockapi.services.currency_service import CurrencyService
from stockapi.exceptions import CurrencyNotFoundException


@click.group('currency')
def cli():
    pass


@cli.command('new')
@click.option('-c', '--currency',
              required=True,
              help='Currency identifier, eg. EUR, SEK, ...')
def add_new_currency(currency):
    service = CurrencyService()
    service.insert_currency(currency)
    click.echo('Adding %s as new currency.' % currency)


@cli.command('delete')
@click.option('-c', '--currency',
              required=True,
              help='Currency identifier, eg. EUR, SEK, ...')
def delete_share(currency):
    service = CurrencyService()
    service.delete_currency(currency)
    click.echo('Deleting %s currency.' % currency)


@cli.command('refresh')
@click.option('-c', '--currency',
              help='Currency identifier, eg. EUR, SEK, ...')
def update_existing_share(currency):
    service = CurrencyService()
    if currency is None:
        click.echo('Updating all currencies')
        currencies = service.get_all_currencies()
        for c in currencies:
            service.update_currency(c['currency'])
            click.echo(c['currency'])
        return

    try:
        service.update_currency(currency)
    except CurrencyNotFoundException, e:
        click.secho(str(e), fg='red')
        sys.exit(128)

    click.echo('Updating %s as existing currency.' % currency)
