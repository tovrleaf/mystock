import { fieldRenderer } from './field-renderer';
const keys = require('./fields');

export function getColumns() {
    var cols = [];
    for (var k in keys) {
      var o = {data: keys[k]}

      o = fieldRenderer(keys[k], o);

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
