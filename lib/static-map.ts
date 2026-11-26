export type MapBounds = { north: number; south: number; west: number; east: number };
export type MapPoint = { id: string; latitude: number; longitude: number };
const mercator = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));

/** Match the Web Mercator projection of the saved map image, without a map SDK. */
export function projectMapPoint(point: Pick<MapPoint,'latitude' | 'longitude'>, bounds: MapBounds, width: number, height: number) {
  return {
    x: (point.longitude - bounds.west) / (bounds.east - bounds.west) * width,
    y: (mercator(bounds.north) - mercator(point.latitude)) / (mercator(bounds.north) - mercator(bounds.south)) * height,
  };
}

/** Group nearby objects without shifting them or drawing leader lines. */
export function groupMapMarkers<T extends MapPoint>(points: T[], bounds: MapBounds, width: number, height: number) {
  const markers = points.map(point => ({ point, anchor: projectMapPoint(point,bounds,width,height) }));
  const groups: number[][] = [];
  markers.forEach((_,i) => {
    const touching = groups.filter(group => group.some(j => Math.abs(markers[i].anchor.x-markers[j].anchor.x)<150 && Math.abs(markers[i].anchor.y-markers[j].anchor.y)<75));
    if (!touching.length) { groups.push([i]); return; }
    const merged = [i,...touching.flat()];
    touching.forEach(group => groups.splice(groups.indexOf(group),1)); groups.push(merged);
  });
  return groups.map(group => ({
    id: group.map(i=>markers[i].point.id).sort().join('|'),
    points: group.map(i=>markers[i].point),
    x: group.reduce((sum,i)=>sum+markers[i].anchor.x,0)/group.length,
    y: group.reduce((sum,i)=>sum+markers[i].anchor.y,0)/group.length,
  }));
}

export function mapDistanceKm(a: Pick<MapPoint,'latitude' | 'longitude'>, b: Pick<MapPoint,'latitude' | 'longitude'>) {
  const radians = (degrees: number) => degrees*Math.PI/180;
  const h = Math.sin(radians(b.latitude-a.latitude)/2)**2 + Math.cos(radians(a.latitude))*Math.cos(radians(b.latitude))*Math.sin(radians(b.longitude-a.longitude)/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}
