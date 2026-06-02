// Haversine calculation to find distance in kilometres
// Use to locate books within x distance of user/within their preferred range

export function getDistanceKM(lat1: number, lon1: number, lat2: number, lon2:number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180; //radians, JS don't do degrees
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = //Cut through earth, straight line dist between postcodes.
    Math.sin(dLat/2) * Math.sin(dLat/2) +//North South
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);//East West, with scaling to cope with compression of lines at poles
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));//arctangents
  return R * c; // Returns distance in kilometres, slice of earth angle
}