import click
import re
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


@cli.command('delete')
@click.option('-s', '--symbol',
              required=True,
              help='Identifier for share used in Nasdaq')
def delete_share(symbol):
    service = StockService()
    service.delete_share(symbol)
    click.echo('Deleting %s share.' % symbol)


@cli.command('populate')
@click.option('-s', '--symbol',
              required=True,
              help='Identifier for share used in Nasdaq')
def populate_share_values(symbol):

    service = StockService()
    try:
        share = service.get_share(symbol)
    except StockNotFoundException, e:
        click.secho(str(e), fg='red')
        sys.exit(128)

    # populate empty keys
    for k in ['inderesInstruction', 'amountOfStocks', 'inderesTargetPrice',
              'purchasePrice', 'currency']:
        if k not in share:
            share[k] = ''

    click.echo('Enter values for share %s' % symbol)
    instruction = click.prompt(
        'Ohjeistus - O(sta), L(isaa), V(ahenna), M(yy), -',
        default=share['inderesInstruction'])
    valid_instructions = {'o': 'Osta',
                          'l': 'Lisaa',
                          'v': 'Vahenna', 'm': 'Myy', '-': 'Ei seurannassa'}
    instruction = instruction.lower()
    if instruction not in valid_instructions.keys():
        click.secho('Instruction must be one of %s.' %
                    ', '.join(valid_instructions.keys()), fg='red')
        sys.exit(128)

    amount = click.prompt('Maara', type=int, default=share['amountOfStocks'])

    purchase_price = click.prompt('Hankinta-arvo (EUR)',
                                  type=float,
                                  default=share['purchasePrice'])

    currency = click.prompt('Valuutta', default=share['currency'])

    target_price = str(click.prompt('Tavoitehinta (%s)' % currency,
                                    default=share['inderesTargetPrice']))
    match = re.match(r'^(\d+(\.\d+)?|-)$', target_price)
    if not match:
        click.secho('Target price needs to be numberic or -', fg='red')
        sys.exit(128)

    service.update_inderes(symbol, instruction, amount,
                           target_price, purchase_price, currency)

    click.echo('Updating %s as existing share with Inderes information.' %
               symbol)


@cli.command('refresh')
@click.option('-s', '--symbol',
              help='Identifier for share used in Nasdaq')
def update_existing_share(symbol):
    service = StockService()
    if symbol is None:
        click.echo('Updating all shares')
        shares = service.get_all_shares()
        for s in shares:
            service.update_share(s['symbol'])
            click.echo(s['symbol'])
        return

    try:
        service.update_share(symbol)
    except StockNotFoundException, e:
        click.secho(str(e), fg='red')
        sys.exit(128)

    click.echo('Updating %s as existing share.' % symbol)
