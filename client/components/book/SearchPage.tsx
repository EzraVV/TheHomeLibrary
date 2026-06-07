import SearchResultsPage from '../pages/SearchResultsPage'
import { useSearchParams } from 'react-router'
import { useState } from 'react'
import { useBorrowBookSearch } from '../../hooks/useBooks'
import { getCoordsByPostcode } from '../../../server/utils/geo'
import { getDistanceKM } from '../../../server/utils/getDistance'
import { SelectableBook } from '../../../models/book'

type LocalBookWithLocation = SelectableBook & {
  lat?: number
  lon?: number
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') || ''
  const userLat = parseFloat(searchParams.get('lat') || '0')
  const userLon = parseFloat(searchParams.get('lon') || '0')

  const [postcode, setPostcode] = useState('')
  const [radius, setRadius] = useState(
    Number(searchParams.get('radius') || '5'),
  )

  const hasSubmittedQuery = query.trim().length >= 3
  const { data, isLoading } = useBorrowBookSearch(query)

  const handleApplyFilters = () => {
    const geo = getCoordsByPostcode(parseInt(postcode, 10))
    if (geo) {
      setSearchParams({
        query,
        lat: geo.Latitude.toString(),
        lon: geo.Longitude.toString(),
        radius: radius.toString(),
      })
    }
  }

  const processedLocal = (data?.localData || []).map((item) => {
    const book = item as LocalBookWithLocation
    return {
      ...book,
      distance:
        userLat && userLon && book.lat && book.lon
          ? getDistanceKM(userLat, userLon, book.lat, book.lon)
          : null,
    }
  })

  return (
    <>
      <section>
        <input
          placeholder="Enter Postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
        <select
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
        >
          <option value="5">5km</option>
          <option value="10">10km</option>
          <option value="20">20km</option>
        </select>
        <button onClick={handleApplyFilters}>Apply Filters</button>
      </section>

      {!hasSubmittedQuery ? (
        <div className="p-6 text-sm text-text-muted">
          Submit a search of at least 3 characters to find books.
        </div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <SearchResultsPage 
          data={{
            localData: processedLocal,
            externalData: data?.externalData || [],
            externalSource: data?.externalSource,
          }} 
        />
      )}
    </>
  )
}
