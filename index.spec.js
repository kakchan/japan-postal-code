import {getWithFilter, transformDataArrayToAddress} from "./index";

describe('Japan Post code', () => {
  describe('getWithFilter()', () => {
    describe('undefined', () => {
      let results;
      beforeEach(() =>
        getWithFilter()
          .then(res => results = res)
      );

      it('should return undefined', () => {
        expect(results).toBeUndefined();
      });
    });

    describe('postcode length is less than 3', () => {
      let results;
      beforeEach(() =>
        getWithFilter("10")
          .then(res => results = res)
      );

      it('should return undefined', () => {
        expect(results).toBeUndefined();
      });
    });

    describe('postcode length is 3 - partial match', () => {
      let results;
      beforeEach(() =>
        getWithFilter("001")
          .then(res => results = res)
      );

      it('should return max 10 items', () => {
        expect(results).toEqual([{
            "address": "北海道札幌市北区",
            "addressEn": "Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "",
            "areaEn": "",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010000",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十条西",
            "addressEn": "Kita10-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十条西",
            "areaEn": "Kita10-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010010",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十一条西",
            "addressEn": "Kita11-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十一条西",
            "areaEn": "Kita11-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010011",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十二条西",
            "addressEn": "Kita12-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十二条西",
            "areaEn": "Kita12-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010012",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十三条西",
            "addressEn": "Kita13-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十三条西",
            "areaEn": "Kita13-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010013",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十四条西",
            "addressEn": "Kita14-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十四条西",
            "areaEn": "Kita14-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010014",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十五条西",
            "addressEn": "Kita15-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十五条西",
            "areaEn": "Kita15-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010015",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十六条西",
            "addressEn": "Kita16-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十六条西",
            "areaEn": "Kita16-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010016",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十七条西",
            "addressEn": "Kita17-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十七条西",
            "areaEn": "Kita17-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010017",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }, {
            "address": "北海道札幌市北区北十八条西",
            "addressEn": "Kita18-jonishi, Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "北十八条西",
            "areaEn": "Kita18-jonishi",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010018",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }]
        );
      });
    });

    describe('postcode length is 7 with dash - complete match', () => {
      let results;
      beforeEach(() =>
        getWithFilter("001-0000")
          .then(res => results = res)
      );

      it('should return 1 item', () => {
        expect(results).toEqual([{
            "address": "北海道札幌市北区",
            "addressEn": "Kita Ward, Sapporo, Hokkaido, Japan",
            "area": "",
            "areaEn": "",
            "city": "札幌市北区",
            "cityEn": "Kita Ward, Sapporo",
            "postcode": "0010000",
            "prefecture": "北海道",
            "prefectureEn": "Hokkaido",
            "prefectureId": 1,
            "street": "",
            "streetEn": ""
          }]
        );
      });
    });
  });
});