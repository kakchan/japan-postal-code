# Japan Postal code
JavaScript module for Japan Postal Code.

Forked from https://github.com/ajaxzip3/ajaxzip3.github.io

Forked from https://github.com/mzp/japan-postal-code

Then add addess in English support.

## How to install
```
npm install "git://github.com/meltedice/japan-postal-code.git#support-address-in-english"
```

## How to use
```js
var postal_code = require('japan-postal-code');

// Upload /zipdata/*.js to CDN.
// ex) http://example.com/zipdata/
//     http://example.com/zipdata/zip-001.js
postal_code.setJsonDataUrl('http://example.com/zipdata/zip-');

postal_code.get('1000001', function(address) {
  console.log(address.prefectureId); // => 13
  console.log(address.prefecture);   // => '東京都'
  console.log(address.city);         // => '千代田区'
  console.log(address.area);         // => '千代田'
  console.log(address.street);       // => ''
  console.log(address.prefectureEn); // => "Tokyo"
  console.log(address.cityEn);       // => "Chiyoda Ward"
  console.log(address.areaEn);       // => "Chiyoda"
  console.log(address.streetEn);     // => ""
});
```

## Tests
```
npm run test-local
npm run test-makejsonpdata-from-csv --test
```

## How to update postalcode data

```
wget http://www.post.japanpost.jp/zipcode/dl/roman/ken_all_rome.zip
unzip ken_all_rome.zip
nkf -Sw KEN_ALL_ROME.CSV > KEN_ALL_ROME.UTF8.CSV
python ./makejsonpdata-from-csv.py KEN_ALL_ROME.UTF8.CSV
```

## LICENSE
MIT License
