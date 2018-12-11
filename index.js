import fetchPromise from 'node-fetch';
import { take } from 'ramda';


let CALLBACK_NAME = 'zipdata';
const CACHE = [];


const PREFMAP = [
  null, '北海道', '青森県', '岩手県', '宮城県',
  '秋田県', '山形県', '福島県', '茨城県', '栃木県',
  '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県',
  '長野県', '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県',
  '和歌山県', '鳥取県', '島根県', '岡山県', '広島県',
  '山口県', '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県',
  '宮崎県', '鹿児島県', '沖縄県'
];

const PREFMAP_EN = [
  null, 'Hokkaido', 'Aomori', 'Iwate', 'Miyagi',
  'Akita', 'Yamagata', 'Fukushima', 'Ibaraki', 'Tochigi',
  'Gumma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
  'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi',
  'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie',
  'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
  'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima',
  'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
  'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita',
  'Miyazaki', 'Kagoshima', 'Okinawa'
];

exports.setCallbackName = function(name) {
  CALLBACK_NAME = name;
};

const cache = function (postalcode3, records) {
  if (records) {
    CACHE[postalcode3] = records;
  }
  return CACHE[postalcode3];
};

const postCodeFileUrl = fileName => `https://static-assets.handcarry.co.jp/data/japan_postcode/zip-${fileName}.js`;

const normalizePostalcode = postCode => {
  if (!postCode) { return null; }
  return postCode.replace(/[^0-9]/, '');
};

const lookupAddresses = function (postalcode, _records) {
  var rows = _records[postalcode];
  // Opera バグ対策：0x00800000 を超える添字は +0xff000000 されてしまう
  var opera = (postalcode - 0 + 0xff000000) + "";
  if (!rows && _records[opera]) rows = _records[opera];
  if (!rows) return null;

  var addresses = [];
  for (var i = 0; i < rows.length; i++) {
    addresses.push(parse(rows[i]));
  }

  return addresses;
};

const parse = function(row) {
  if (!row) return null;
  let prefectureId = row[0];
  if (!prefectureId) return null;
  let prefectureJa = PREFMAP[prefectureId];
  if (!prefectureJa) return null;
  let prefectureEn = PREFMAP_EN[prefectureId];
  if (!prefectureEn) return null;

  const cityJa = row[1] || '';
  const areaJa = row[2] || '';
  const streetJa = row[3] || '';
  const cityEn = row[4] || '';
  const areaEn = row[5] || '';
  const streetEn = row[6] || '';
  const postcode = row[7] || '';

  const addressJa = prefectureJa + cityJa + areaJa + streetJa;
  let addressEn = prefectureEn + ', Japan';
  if (cityEn)   addressEn = cityEn   + ', ' + addressEn;
  if (areaEn)   addressEn = areaEn   + ', ' + addressEn;
  if (streetEn) addressEn = streetEn + ', ' + addressEn;

  return {
    'prefectureId': prefectureId,  // 都道府県ID
    'prefecture':   prefectureJa,  // 都道府県名
    'city':         cityJa,        // 市区町村名
    'area':         areaJa,        // 町域名
    'street':       streetJa,      // 番地
    'address':      addressJa,     // 都道府県名 + 市区町村名 + 町域名 + 番地
    'prefectureEn': prefectureEn,  // Prefecture
    'cityEn':       cityEn,        // City
    'areaEn':       areaEn,        // Area
    'streetEn':     streetEn,      // Street
    'addressEn':    addressEn,     // Street, Area, City, Prefecture, Japan
    'postcode': postcode
  };
};

const MAX_RETURN_ITEMS = 10;

export const getWithFilter = (_postCode, maxItems) => {
  const postCode = normalizePostalcode(_postCode);
  if (!postCode || postCode.length < 3) {
    return Promise.resolve();
  }
  const fileName = postCode.substr(0, 3);
  return fetchPromise(postCodeFileUrl(fileName), {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })
    .then(resp => resp.json())
    .then(json => {
      let returnArray = [];
      for (let postcode in json) {
        if ((new RegExp(postCode)).test(postcode)) {
          const newItems = json[postcode].map(item => item.concat(postcode));
          returnArray = returnArray.concat(newItems);
          if (returnArray.length >= MAX_RETURN_ITEMS) {
            break;
          }
        }
      }
      return take(maxItems || MAX_RETURN_ITEMS, returnArray).map(item => parse(item));
    });
};

exports.get = (_postalcode, maxItems) => getWithFilter(_postalcode, maxItems);
