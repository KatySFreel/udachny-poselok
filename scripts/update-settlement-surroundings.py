"""Refresh the local OSM snapshot; browsers never query the editing API.
Run: python3 scripts/update-settlement-surroundings.py [--input map.osm]
"""
import argparse
import datetime
import json
import math
from pathlib import Path
import urllib.request
import xml.etree.ElementTree as ET

LAT, LON = 59.687813286417885, 29.406918545286945
SOURCE = 'https://api.openstreetmap.org/api/0.6/map?bbox=29.38,59.67,29.45,59.755'
parser = argparse.ArgumentParser()
parser.add_argument('--input', type=Path)
args = parser.parse_args()
if args.input:
    xml = args.input.read_bytes()
else:
    request = urllib.request.Request(SOURCE, headers={'User-Agent': 'UdachnyPoselokMapData/1.0 (+https://udachniyposelok.ru/)'})
    with urllib.request.urlopen(request, timeout=45) as response:
        xml = response.read()
root = ET.fromstring(xml)
nodes = {n.attrib['id']: (float(n.attrib['lat']), float(n.attrib['lon'])) for n in root.findall('node')}

def distance(lat, lon):
    a = math.sin(math.radians(lat-LAT)/2)**2 + math.cos(math.radians(LAT))*math.cos(math.radians(lat))*math.sin(math.radians(lon-LON)/2)**2
    return 6371000*2*math.atan2(math.sqrt(a), math.sqrt(1-a))

def area(points):
    projected = [(lon*111320*math.cos(math.radians(LAT)), lat*111320) for lat,lon in points]
    return abs(sum(projected[i-1][0]*p[1]-p[0]*projected[i-1][1] for i,p in enumerate(projected)))/2

points, forests = [], []
for element in root:
    tags = {t.attrib['k']: t.attrib['v'] for t in element.findall('tag')}
    amenity, shop, leisure = tags.get('amenity'), tags.get('shop'), tags.get('leisure')
    category, fallback = None, ''
    if amenity in ['hospital','clinic','doctors','pharmacy','dentist']:
        category, fallback = 'medicine', 'Аптека' if amenity=='pharmacy' else 'Медицинский центр'
    elif amenity in ['school','kindergarten','college']:
        category, fallback = 'education', 'Детский сад' if amenity=='kindergarten' else 'Образовательное учреждение'
    elif shop in ['supermarket','convenience','greengrocer','bakery','general','mall']:
        category, fallback = 'shops', 'Продуктовый магазин'
    elif leisure in ['park','garden','nature_reserve']:
        category, fallback = 'parks', 'Природная территория' if leisure=='nature_reserve' else 'Парк'
    elif tags.get('landuse')=='forest' or tags.get('natural')=='wood':
        category, fallback = 'forest', 'Лесной массив'
    if not category or element.tag not in ['node','way']:
        continue
    geometry = []
    if element.tag=='node':
        lat,lon = nodes[element.attrib['id']]
    else:
        geometry = [nodes[n.attrib['ref']] for n in element.findall('nd') if n.attrib['ref'] in nodes]
        if not geometry: continue
        lat,lon = [sum(p[i] for p in geometry)/len(geometry) for i in [0,1]]
    meters = distance(lat,lon)
    if meters>6000: continue
    if category=='forest' and (len(geometry)<4 or area(geometry)<300000): continue
    point = {'id': f"{element.tag}/{element.attrib['id']}", 'category': category,
             'name': tags.get('name:ru',tags.get('name',fallback)),
             'latitude': round(lat,7), 'longitude': round(lon,7)}
    address = ', '.join(filter(None,[tags.get('addr:street'),tags.get('addr:housenumber')]))
    if address: point['address'] = address
    if category in ['parks','forest'] and geometry:
        stride = max(1,math.ceil(len(geometry)/100))
        point['boundary'] = [[round(a,7),round(b,7)] for a,b in geometry[::stride]]
    if category=='forest': forests.append((meters,point))
    else: points.append(point)
# Keep the six nearest substantial forest areas rather than dozens of tiny tree stands.
points.extend(point for _,point in sorted(forests,key=lambda pair:pair[0])[:6])
points.sort(key=lambda point:(point['category'],point['name'],point['id']))
output = {'updatedAt': datetime.date.today().isoformat(), 'source': SOURCE,
          'latitude': LAT, 'longitude': LON, 'radiusKm': 6, 'points': points}
path = Path(__file__).resolve().parent.parent/'content'/'troitskaya-surroundings.json'
path.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
from collections import Counter
print(path, Counter(point['category'] for point in points))
