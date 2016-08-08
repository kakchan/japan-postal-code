var postal_code = require('../index');
var expect = require('expect.js');

describe('#get', function () {
  it('fetch address', function(done) {
    postal_code.get('1000001', function(address) {
      expect(address.prefectureId).to.eql(13);
      expect(address.prefecture).to.eql('東京都');
      expect(address.city).to.eql('千代田区');
      expect(address.area).to.eql('千代田');
      expect(address.street).to.eql('');
      expect(address.address).to.eql('東京都千代田区千代田');
      expect(address.prefectureEn).to.eql("Tokyo");
      expect(address.cityEn).to.eql("Chiyoda Ward");
      expect(address.areaEn).to.eql("Chiyoda");
      expect(address.streetEn).to.eql("");
      expect(address.addressEn).to.eql("Chiyoda, Chiyoda Ward, Tokyo, Japan");
      delete global.zipdata;
      done();
    });
  });

  it('fetch address(hypen)', function(done) {
    postal_code.get('100-0001', function(address) {
      expect(address.prefectureId).to.eql(13);
      expect(address.prefecture).to.eql('東京都');
      expect(address.city).to.eql('千代田区');
      expect(address.area).to.eql('千代田');
      expect(address.street).to.eql('');
      expect(address.address).to.eql('東京都千代田区千代田');
      expect(address.prefectureEn).to.eql("Tokyo");
      expect(address.cityEn).to.eql("Chiyoda Ward");
      expect(address.areaEn).to.eql("Chiyoda");
      expect(address.streetEn).to.eql("");
      expect(address.addressEn).to.eql("Chiyoda, Chiyoda Ward, Tokyo, Japan");
      delete global.zipdata;
      done();
    });
  });

  it('returns null with short postalcode', function() {
    // // FIXME: I want to test, callback function is not invoke
    // postal_code.get('100', function(address) {
    //   expect().fail("Should not call callback function.");
    //   done();
    // });
    postal_code.get('100', function(address) {
      expect(address).to.be(null);
    });
  });
});

describe('#getMulti', function () {
  it('fetch addresses', function(done) {
    postal_code.getMulti('0995613', function(addresses) {
      expect(addresses.length).to.eql(4);

      expect(addresses[0].prefectureId).to.eql(1);
      expect(addresses[0].prefecture).to.eql("北海道");
      expect(addresses[0].city).to.eql("紋別郡滝上町");
      expect(addresses[0].area).to.eql("第３区");
      expect(addresses[0].street).to.eql("");
      expect(addresses[0].address).to.eql("北海道紋別郡滝上町第３区");
      expect(addresses[0].prefectureEn).to.eql("Hokkaido");
      expect(addresses[0].cityEn).to.eql("Takinoe, Mombetsu District");
      expect(addresses[0].areaEn).to.eql("Dai3-ku");
      expect(addresses[0].streetEn).to.eql("");
      expect(addresses[0].addressEn).to.eql("Dai3-ku, Takinoe, Mombetsu District, Hokkaido, Japan");

      expect(addresses[1].prefectureId).to.eql(1);
      expect(addresses[1].prefecture).to.eql("北海道");
      expect(addresses[1].city).to.eql("紋別郡滝上町");
      expect(addresses[1].area).to.eql("第４区");
      expect(addresses[1].street).to.eql("");
      expect(addresses[1].address).to.eql("北海道紋別郡滝上町第４区");
      expect(addresses[1].prefectureEn).to.eql("Hokkaido");
      expect(addresses[1].cityEn).to.eql("Takinoe, Mombetsu District");
      expect(addresses[1].areaEn).to.eql("Dai4-ku");
      expect(addresses[1].streetEn).to.eql("");
      expect(addresses[1].addressEn).to.eql("Dai4-ku, Takinoe, Mombetsu District, Hokkaido, Japan");

      expect(addresses[2].prefectureId).to.eql(1);
      expect(addresses[2].prefecture).to.eql("北海道");
      expect(addresses[2].city).to.eql("紋別郡滝上町");
      expect(addresses[2].area).to.eql("第５区");
      expect(addresses[2].street).to.eql("");
      expect(addresses[2].address).to.eql("北海道紋別郡滝上町第５区");
      expect(addresses[2].prefectureEn).to.eql("Hokkaido");
      expect(addresses[2].cityEn).to.eql("Takinoe, Mombetsu District");
      expect(addresses[2].areaEn).to.eql("Dai5-ku");
      expect(addresses[2].streetEn).to.eql("");
      expect(addresses[2].addressEn).to.eql("Dai5-ku, Takinoe, Mombetsu District, Hokkaido, Japan");

      expect(addresses[3].prefectureId).to.eql(1);
      expect(addresses[3].prefecture).to.eql("北海道");
      expect(addresses[3].city).to.eql("紋別郡滝上町");
      expect(addresses[3].area).to.eql("滝西");
      expect(addresses[3].street).to.eql("");
      expect(addresses[3].address).to.eql("北海道紋別郡滝上町滝西");
      expect(addresses[3].prefectureEn).to.eql("Hokkaido");
      expect(addresses[3].cityEn).to.eql("Takinoe, Mombetsu District");
      expect(addresses[3].areaEn).to.eql("Takinishi");
      expect(addresses[3].streetEn).to.eql("");
      expect(addresses[3].addressEn).to.eql("Takinishi, Takinoe, Mombetsu District, Hokkaido, Japan");

      delete global.zipdata;
      done();
    });
  });

  it('returns empty array [] with short postalcode', function() {
    postal_code.getMulti('100', function(address) {
      expect(address).to.be.an('array');
      expect(address.length).to.eql(0);
    });
  });
});
