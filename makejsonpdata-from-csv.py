#!/usr/bin/env python
# coding: utf-8
# -*- coding: utf-8 -*-

# dataフォルダ内の郵便番号データをJSONP形式にしてzipdataフォルダ内に保存します
# See: http://www.post.japanpost.jp/zipcode/dl/roman-zip.html
#     wget http://www.post.japanpost.jp/zipcode/dl/roman/ken_all_rome.zip
#     unzip ken_all_rome.zip
#     nkf -Sw KEN_ALL_ROME.CSV > KEN_ALL_ROME.UTF8.CSV
#     python ./makejsonpdata-from-csv.py KEN_ALL_ROME.UTF8.CSV

import sys
import csv
import re
reload(sys)
sys.setdefaultencoding("UTF-8")

prefmap_ja = [
    None,       '北海道',   '青森県',   '岩手県',   '宮城県',
    '秋田県',   '山形県',   '福島県',   '茨城県',   '栃木県',
    '群馬県',   '埼玉県',   '千葉県',   '東京都',   '神奈川県',
    '新潟県',   '富山県',   '石川県',   '福井県',   '山梨県',
    '長野県',   '岐阜県',   '静岡県',   '愛知県',   '三重県',
    '滋賀県',   '京都府',   '大阪府',   '兵庫県',   '奈良県',
    '和歌山県', '鳥取県',   '島根県',   '岡山県',   '広島県',
    '山口県',   '徳島県',   '香川県',   '愛媛県',   '高知県',
    '福岡県',   '佐賀県',   '長崎県',   '熊本県',   '大分県',
    '宮崎県',   '鹿児島県', '沖縄県'
]

prefmap_en = [
    None,        'Hokkaido',  'Aomori',    'Iwate',    'Miyagi',
    'Akita',     'Yamagata',  'Fukushima', 'Ibaraki',  'Tochigi',
    'Gumma',     'Saitama',   'Chiba',     'Tokyo',    'Kanagawa',
    'Niigata',   'Toyama',    'Ishikawa',  'Fukui',    'Yamanashi',
    'Nagano',    'Gifu',      'Shizuoka',  'Aichi',    'Mie',
    'Shiga',     'Kyoto',     'Osaka',     'Hyogo',    'Nara',
    'Wakayama',  'Tottori',   'Shimane',   'Okayama',  'Hiroshima',
    'Yamaguchi', 'Tokushima', 'Kagawa',    'Ehime',    'Kochi',
    'Fukuoka',   'Saga',      'Nagasaki',  'Kumamoto', 'Oita',
    'Miyazaki',  'Kagoshima', 'Okinawa'
]

def prefecture_ja_to_prefecture_id(prefecture_ja):
    """ Convert prefecture name in Japanese to PrefectureID
    >>> prefecture_ja_to_prefecture_id('北海道')
    1
    >>> prefecture_ja_to_prefecture_id('東京都')
    13
    >>> prefecture_ja_to_prefecture_id('沖縄県')
    47
    """
    return prefmap_ja.index(prefecture_ja)

def normalize_prefecture_en(prefecture_ro):
    """ Normalize english prefecture name
    >>> normalize_prefecture_en('HOKKAIDO')
    'Hokkaido'
    >>> normalize_prefecture_en('TOKYO TO')
    'Tokyo'
    >>> normalize_prefecture_en('SAITAMA KEN')
    'Saitama'
    >>> normalize_prefecture_en('KYOTO FU')
    'Kyoto'
    """
    words = prefecture_ro.split(' ')
    words = map(lambda word: word.capitalize(), words)
    return words[0]

def normalize_city_ja(city_ja):
    u""" Normalize japanese city name
    >>> print normalize_city_ja('球磨郡　五木村')
    球磨郡五木村
    >>> print normalize_city_ja('名古屋市　千種区')
    名古屋市千種区
    """
    return city_ja.replace('　', '')

def normalize_city_en(city_ro):
    """ Normalize english city name
    >>> normalize_city_en('KUMA GUN ITSUKI MURA')
    'Itsuki, Kuma District'
    >>> normalize_city_en('OSAKA SHI CHUO KU')
    'Chuo Ward, Osaka'
    >>> normalize_city_en('NAGOYA SHI CHIKUSA KU')
    'Chikusa Ward, Nagoya'
    >>> normalize_city_en('SEMBOKU SHI')
    'Semboku'
    >>> normalize_city_en('AOMORI SHI')
    'Aomori'
    >>> normalize_city_en('DATE GUN KORI MACHI')
    'Kori, Date District'
    >>> normalize_city_en('OSAKI SHI')
    'Osaki'
    >>> normalize_city_en('ISHIKARI GUN TOBETSU CHO')
    'Tobetsu, Ishikari District'
    >>> normalize_city_en('SAIHAKU GUN HIEZU SON')
    'Hiezu, Saihaku District'
    """

    words = city_ro.split(' ')
    words = map(lambda word: word.capitalize(), words)
    sections = []
    section_words = []
    for word in words:
        if word == 'Ku':
            section_words.append('Ward')
            sections.append(' '.join(section_words))
            section_words = []
        elif word == 'Gun':
            section_words.append('District')
            sections.append(' '.join(section_words))
            section_words = []
        elif word in ['Shi', 'Cho', 'Machi', 'Son', 'Mura']:
            sections.append(' '.join(section_words))
            section_words = []
        else:
            section_words.append(word)

    if 0 < len(section_words):
        sections.append(' '.join(section_words))

    sections.reverse()
    city_en = ', '.join(sections)
    return city_en

def normalize_area_ja(area_ja):
    u""" Normalize japanese area name
    >>> normalize_area_ja('以下に掲載がない場合')
    ''
    >>> print normalize_area_ja('北二条西（１〜１９丁目）')
    北二条西
    >>> print normalize_area_ja('角館町　薗田')
    角館町薗田
    """
    if area_ja == '以下に掲載がない場合': return ''
    words = re.sub(r'（([０-９]+階)）', r'\1', area_ja)
    words = re.sub(r'（.*', '', words)
    return words.replace('　', '')

def normalize_area_en(area_ro):
    """ Normalize english area name
    >>> normalize_area_en('IKANIKEISAIGANAIBAAI')
    ''
    >>> normalize_area_en('KITA2-JONISHI(1-19-CHOME)')
    'Kita2-jonishi'
    >>> normalize_area_en('KAKUNODATEMACHI SONODA')
    'Kakunodatemachi Sonoda'
    """
    if area_ro == 'IKANIKEISAIGANAIBAAI': return ''
    words = re.sub(r'\((\d+)-KAI\)', r' \1F', area_ro)
    words = re.sub(r'\(.*', '', words)
    words = words.split(' ')
    words = map(lambda word: word.capitalize(), words)
    return ' '.join(words)

def address_in_english(address):
    postalcode, prefecture_id, city_ja, area_ja, street_ja, city_en, area_en, street_en = address
    address_en = [city_en, prefmap_en[prefecture_id]]
    if 0 < len(street_en): address_en.insert(0, street_en)
    if 0 < len(area_en):   address_en.insert(0, area_en)
    name = ', '.join(address_en) + ', Japan ' + postalcode[0:3] + '-' + postalcode[3:7]
    return name

def address_in_japanese(address):
    postalcode, prefecture_id, city_ja, area_ja, street_ja, city_en, area_en, street_en = address
    name = postalcode[0:3] + '-' + postalcode[3:7] + ' ' + prefmap_ja[prefecture_id] + city_ja + area_ja + street_ja
    return name

def loadAddresses(file_name):
    addresses = {}

    with open(file_name, 'rb') as f:
        reader = csv.reader(f)
        for row in reader:
            postalcode, prefecture_ja, city_ja, area_ja, prefecture_ro, city_ro, area_ro = row
            street_ja, street_ro, street_en = '', '', ''
            original_city_ja = city_ja

            postalcode3   = postalcode[0:3]
            prefecture_id = prefecture_ja_to_prefecture_id(prefecture_ja)
            prefecture_en = normalize_prefecture_en(prefecture_ro)
            city_ja = normalize_city_ja(city_ja)
            city_en = normalize_city_en(city_ro)
            area_ja = normalize_area_ja(area_ja)
            area_en = normalize_area_en(area_ro)

            address = [postalcode, prefecture_id, city_ja, area_ja, street_ja, city_en, area_en, street_en]

            # print "%-90s          %-s" % (address_in_english(address), address_in_japanese(address))

            if postalcode3 not in addresses: addresses[postalcode3] = {}
            if postalcode  not in addresses[postalcode3]: addresses[postalcode3][postalcode] = []

            addresses[postalcode3][postalcode].append(address)

    return addresses

def writeAddressesIntoJsonpFiles(addresses, path_prefix, callback_name):
    postalcode3_list = addresses.keys()
    postalcode3_list.sort()

    for postalcode3 in postalcode3_list:
        postalcode_list = addresses[postalcode3].keys()
        postalcode_list.sort()

        record_sets = []
        for postalcode in postalcode_list:
            records = []
            for address in sorted(addresses[postalcode3][postalcode], key=lambda a: a[0]):
                record = '[{0[1]},"{0[2]}","{0[3]}","{0[4]}","{0[5]}","{0[6]}","{0[7]}"]'.format(address)
                records.append(record)
            record_sets.append('"%s":[%s]' % (postalcode, ','.join(records)))

        jsonp = callback_name + "({" + ",".join(record_sets) + "})\n"
 
        path = path_prefix + postalcode3 + '.js'
        f = open(path, "w")
        f.write(jsonp)
        f.close()

if __name__ == "__main__":

    if '--test' in sys.argv:

        import doctest
        doctest.testmod()

    else:

        path_prefix = 'zipdata/zip-'
        callback_name = 'zipdata'

        if 1 < len(sys.argv):
            file_name = sys.argv[1]
        else:
            file_name = 'KEN_ALL_ROME.UTF8.CSV'

        addresses = loadAddresses(file_name)

        writeAddressesIntoJsonpFiles(addresses, path_prefix, callback_name);
