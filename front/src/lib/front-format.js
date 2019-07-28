const keys = require('./fields');

export function getColumns() {

    function recommendationRenderer(instance, td, row, col, prop, value, cellProperties) {
      while (td.firstChild) {
        td.removeChild(td.firstChild);
      }

      var el = document.createElement('span');
      el.classList.add('badge');
      el.textContent = value;
      td.classList.add('htCenter')

      var cls = '';
      switch (value) {
        case 'Osta':
          cls = 'success';
          break;
        case 'Lisää':
          cls = 'info';
          break;
        case 'Vähennä':
          cls = 'warning';
          break;
        case 'Myy':
          cls = 'danger';
          break;
        default:
          cls = 'light'
          break;
      }
      el.classList.add('badge-' + cls);

      td.appendChild(el)
    }

    var addColorsToColumns = [
      keys.YIELD,
      keys.DIVIDEND_YIELD,
      keys.POTENTIAL,
      keys.YIELD_EUR,
      keys.EXPECTED_GROWTH_EUR,
      keys.EXPECTED_WIN_EUR,
      keys.EXPECTED_GROWTH_FROM_START,
    ];

    function formatTd(td, prop, value, suffix) {
      while (td.firstChild) {
        td.removeChild(td.firstChild);
      }
      if (! isNaN(value)) {

        if (addColorsToColumns.includes(prop)) {
          if (value >= 0) {
            td.classList.add('text-success');
          } else {
            td.classList.add('text-danger');
          }
        }

        value = Math.round(value * 10) / 10;
        if (('' + value).split('.').length === 1) {
          value += '.0'
        }
        value += ' ' + suffix;
        td.classList.add('htRight');
      }
      var el = document.createTextNode(value)
      td.appendChild(el)
    };

    function percentRenderer(instance, td, row, col, prop, value, cellProperties) {
      formatTd(td, prop, value, '%');
    };

    function euroRenderer(instance, td, row, col, prop, value, cellProperties) {
      formatTd(td, prop, value, 'EUR');
    };

    var cols = [];
    for (var k in keys) {
      var o = {data: keys[k]}

      switch (keys[k]) {
        case keys.INDERES_INSTRUCTION:
          o['renderer'] = recommendationRenderer
          break;

        case keys.YIELD:
        case keys.DIVIDEND_YIELD:
        case keys.POTENTIAL:
        case keys.EXPECTED_GROWTH_FROM_START:
        case keys.PERCENTAGE_OF_PORTFOLIO:
          o['renderer'] = percentRenderer
          break;

        case keys.MARKET_PRICE_EUR:
        case keys.YIELD_EUR:
        case keys.EXPECTED_GROWTH_EUR:
        case keys.EXPECTED_MARKET_PRICE_EUR:
        case keys.EXPECTED_WIN_EUR:
        case keys.MIDDLE_RATE:
        case keys.PURCHASE_PRICE:
        case keys.PRICE:
        case keys.INDERES_TARGET_PRICE:
        case keys.PURCHASE_PRICE_EUR:
          o['renderer'] = euroRenderer
          break;

        case keys.AMOUNT_OF_STOCK:
          o['type'] = 'numeric';
          o['numericFormat'] = {
            mantissa: '0'
          }
          break;

        default:
          break;
      }

      cols.push(o)
    }

    return cols;
}

export function getCells(colKeys) {

      var cells = [];
      function addComment(key, comment) {
        var i = colKeys.indexOf(key);
        cells.push(
          {row: 0, col: i, comment: {'value': comment}}
        );
      }

      addComment(keys.RESULT_EQUITY, 'Tulos/Oma pääoma näyttää yrityksen oman pääoman tuoton, eli se mittaa kannattavuutta. Luku kertoo yrityksen kyvyn kasvattaa osakkeenomistajien sijoittamaa pääomaa.');
      addComment(keys.PRICE_TO_EARNINGS, 'P/E-luku, eli voittokerroin (Price/Earnings), lasketaan jakamalla osakekurssi yrityksen osakekohtaisella tuloksella. P/E-luku siis kertoo, kuinka korkealle markkinat arvostavat yrityksen jokaista voitollista euroa.\n\nMitä suurempi P/E-luku on, sitä suuremmat ovat yrityksen kasvu- ja tulosodotukset. Korkea P/E-luku voi myös viestiä siitä, että osake on suhteellisen kallis ja mahdollisesti yliarvostettu sen tämän hetken tuloksentekokykyyn nähden.');
      addComment(keys.PRICE_TO_SALES, 'Osakkeen P/S-luku (Price/Sales) kertoo osakkeen kurssin ja osakekohtaisen liikevaihdon välisen suhteen. Luku osoittaa, kuinka korkealle markkinat arvostavat yrityksen jokaista myynnistä saamaa euroa.\n\nSuuri P/S-luku kuvastaa siten markkinoiden odottavan yritykseltä suurempaa liikevaihtoa.\n\nInvestointiyhtiöille ei lasketa myyntiä ja siten niillä ei ole P/S-lukua.');
      addComment(keys.PRICE_TO_BOOK, 'Osoittaa osakekurssin (Price) ja osakekohtaisen oman pääoman (Book value) välisen suhteen. Korkea P/B-luku indikoi sitä, että liiketoiminnan pääomantuottokyky on hyvää tasoa ja tulee todennäköisesti säilymään korkeana myös jatkossa.');

      return cells;
}
