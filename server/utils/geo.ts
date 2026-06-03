import postcodeCoords from '../data/postcodeCoords.json';

export const getCoordsByPostcode = (code: number) => {
  return postcodeCoords.find(p => p.Postcode === code);
};