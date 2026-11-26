export type MapRoute = {label:string;icon:string;href:string};
export function mapRoutes(query: string, coordinates?: {latitude:number;longitude:number}): MapRoute[] {
  const destination = coordinates ? `${coordinates.latitude},${coordinates.longitude}` : encodeURIComponent(query);
  return [
    {label:'Яндекс',icon:'yandex',href:`https://yandex.ru/maps/?rtext=~${destination}&rtt=auto`},
    {label:'Google',icon:'google',href:`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`},
    {label:'2ГИС',icon:'2gis',href:coordinates ? `https://2gis.ru/spb/directions/points/|${coordinates.longitude},${coordinates.latitude}` : `https://2gis.ru/spb/search/${destination}`},
  ];
}
