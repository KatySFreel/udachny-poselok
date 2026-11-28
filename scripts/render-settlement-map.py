"""Render a local map from OSM geometry using the home map's palette.
No network access. Example: python3 scripts/render-settlement-map.py --input area-*.osm
"""
import argparse, json, math
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape
parser=argparse.ArgumentParser()
parser.add_argument('--input',nargs='+',type=Path,required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
bounds=json.loads((root/'content/troitskaya-map-image.json').read_text())
W,H=bounds['width'],bounds['height']
merc=lambda lat: math.log(math.tan(math.pi/4+float(lat)*math.pi/360))
def project(lat,lon):
 return ((float(lon)-bounds['west'])/(bounds['east']-bounds['west'])*W,(merc(bounds['north'])-merc(lat))/(merc(bounds['north'])-merc(bounds['south']))*H)
nodes,ways={},{}
for path in args.input:
 for e in ET.parse(path).getroot():
  if e.tag=='node':nodes[e.attrib['id']]=e
  elif e.tag=='way':ways[e.attrib['id']]=e

def tags(e):return {t.attrib['k']:t.attrib['v'] for t in e.findall('tag')}
def points(e):return [project(nodes[n.attrib['ref']].attrib['lat'],nodes[n.attrib['ref']].attrib['lon'])for n in e.findall('nd')if n.attrib['ref']in nodes]
def path_d(p,closed=False):return 'M'+'L'.join(f'{x:.1f},{y:.1f}'for x,y in p)+('Z' if closed else '')
land,water,rivers,roads,labels=[],[],[],[],[]
for e in ways.values():
 t=tags(e);p=points(e)
 if len(p)<2:continue
 closed=e.findall('nd')[0].attrib['ref']==e.findall('nd')[-1].attrib['ref']
 if closed:
  if t.get('natural')in['wood','scrub','wetland'] or t.get('landuse')=='forest':land.append(f'<path d="{path_d(p,True)}" fill="#e4dcc8"/>')
  elif t.get('landuse')in['farmland','meadow','grass'] or t.get('natural')=='grassland':land.append(f'<path d="{path_d(p,True)}" fill="#efe1cf"/>')
  if t.get('natural')=='water' or t.get('waterway')=='riverbank':water.append(f'<path d="{path_d(p,True)}" fill="#c4d4e0"/>')
 if t.get('waterway')in['river','stream','canal']:
  stroke=3 if t.get('waterway')=='river' else 1.5
  rivers.append(f'<path d="{path_d(p)}" fill="none" stroke="#c4d4e0" stroke-width="{stroke}"/>')
 highway=t.get('highway')
 if highway in ['primary','secondary','tertiary','unclassified','residential','service','track','path','footway']:
  weight={'primary':9,'secondary':7,'tertiary':6,'unclassified':4,'residential':3.5,'service':2,'track':1.7,'path':1,'footway':1}[highway]
  roads.append((weight,path_d(p)))
for e in nodes.values():
 t=tags(e)
 if t.get('place')not in ['town','village','hamlet']:continue
 name=t.get('name:ru',t.get('name'))
 if not name:continue
 x,y=project(e.attrib['lat'],e.attrib['lon'])
 if not 35<x<W-35 or not 40<y<H-30:continue
 size=32 if t.get('place')in['town','village']else 24
 label_x,anchor=(x-60,'end') if name=='Лопухинка' else (x+12,'start')
 labels.append(f'<text x="{label_x:.1f}" y="{y-18:.1f}" text-anchor="{anchor}" font-size="{size}" fill="#615c4b" stroke="#f4e4d4" stroke-width="5" paint-order="stroke" font-family="Arial,sans-serif">{escape(name)}</text>')
road_paths=[]
for weight,d in sorted(roads,reverse=True):
 if weight>=6:road_paths.append(f'<path d="{d}" fill="none" stroke="#e9dccb" stroke-width="{weight+3}"/>')
 road_paths.append(f'<path d="{d}" fill="none" stroke="#fffaee" stroke-width="{weight}"/>')
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="#f4e4d4"/><g stroke-linecap="round" stroke-linejoin="round">'+''.join(land+water+rivers+road_paths+labels)+'</g></svg>'
output=root/'public/images/settlements/troitskaya-sloboda/surroundings-map.svg'
output.write_text(svg)
print(output,'roads',len(roads),'areas',len(land),'water',len(water)+len(rivers),'labels',len(labels),'bytes',len(svg))
