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


@cli.command('inderes')
@click.option('-s', '--symbol',
              required=True,
              help='Identifier for share used in Nasdaq')
def set_inderes_values(symbol):
    click.echo('Enter values for share %s' % symbol)
    instruction = click.prompt('Ohjeistus - O(sta), L(isaa), V(ahenna), M(yy)')
    valid_instructions = {'o': 'Osta',
                          'l': 'Lisaa', 'v': 'Vahenna', 'm': 'Myy'}
    instruction = instruction.lower()
    if instruction not in valid_instructions.keys():
        click.secho('Instruction must be one of %s.' %
                    ', '.join(valid_instructions.keys()))
        sys.exit(128)

    amount = click.prompt('Maara', type=int)
    target_price = click.prompt('Tavoitehinta', type=float)
    purchase_price = click.prompt('Hankintahinta', type=float)

    service = StockService()
    try:
        service.update_inderes(symbol, instruction, amount,
                               target_price, purchase_price)
    except StockNotFoundException, e:
        click.secho(str(e), fg='red')
        sys.exit(128)

    click.echo('Updating %s as existing share with Inderes information.' %
               symbol)


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
