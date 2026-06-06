import SearchResultsPage from "../pages/SearchResultsPage";
import { useSearchParams } from "react-router";
import { useState } from "react";
import { useBorrowBookSearch } from "../../hooks/useBooks";
import { getCoordsByPostcode } from "../../../server/utils/geo";
import  { getDistanceKM }  from '../../../server/utils/getDistance'
import { SelectableBook } from '../../../models/book'

type LocalBookWithLocation = SelectableBook & { lat?: number; lon?: number }


export default function SearchPage() {

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const userLat = parseFloat(searchParams.get('lat') || '0');
  const userLon = parseFloat(searchParams.get('lon') || '0');

  const [postcode, setPostcode] = useState('')
  const [radius, setRadius] = useState(5); //Default 5km; TODO - no distance limit?

  //const {userProfile } = useAuth() 

  const { data, isLoading } = useBorrowBookSearch(query);

  const handleApplyFilters = () => {
    const geo = getCoordsByPostcode(parseInt(postcode, 10)) //Base 10, convert to number if not already. Source might be json file.
    if (geo) {
      setSearchParams({ 
        query, 
        lat: geo.Latitude.toString(), 
        lon: geo.Longitude.toString(),
        radius: radius.toString() 
      });
    }
  };


  //This needs to connect book owner postcode via book, then compare with borrower postcode
  const processedLocal = (data?.localData || []).map(item => {
    const book = item as LocalBookWithLocation
    return {
    ...book,
    //Calculate book lat and long by owner look up
    distance: userLat && userLon && book.lat && book.lon ? getDistanceKM(userLat, userLon, book.lat, book.lon) : null
  }});


return (
  <>
    <section>
      <input 
        placeholder="Enter Postcode" 
        onChange={(e) => setPostcode(e.target.value)} 
      />
      <select onChange={(e) => setRadius(parseInt(e.target.value))}>
         <option value="5">5km</option>
         <option value="10">10km</option>
         <option value="20">20km</option>
      </select>
      <button onClick={handleApplyFilters}>Apply Filters</button>
    </section>

    {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SearchResultsPage 
          data={{
            localData: processedLocal,
            externalData: data?.externalData || [],
            externalSource: data?.externalSource // optional, will be undefined if not present
          }} 
        />
      )}
    </>
  );
}
