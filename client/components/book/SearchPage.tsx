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
      <section
        aria-labelledby="search-filter-heading"
        className="mb-6 rounded-md border border-border/40 bg-surface p-4 shadow-card"
      >
        <h1 id="search-filter-heading" className="text-xl font-bold text-secondary">
          Search books
        </h1>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div>
            <label htmlFor="search-postcode" className="mb-1 block text-sm font-semibold">
              Filter by postcode
            </label>
            <input
              id="search-postcode"
              type="text"
              inputMode="numeric"
              placeholder="Enter postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="min-h-11 w-full rounded-sm border border-border bg-background/50 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="search-radius" className="mb-1 block text-sm font-semibold">
              Radius
            </label>
            <select
              id="search-radius"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="min-h-11 rounded-sm border border-border bg-background/50 px-3 py-2"
            >
              <option value="5">5km</option>
              <option value="10">10km</option>
              <option value="20">20km</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleApplyFilters}
            className="min-h-11 rounded-sm bg-primary px-4 py-2 text-white"
          >
            Apply filters
          </button>
        </div>
      </section>

      {!hasSubmittedQuery ? (
        <div role="status" className="p-6 text-sm text-text-muted">
          Submit a search of at least 3 characters to find books.
        </div>
      ) : isLoading ? (
        <div role="status" aria-live="polite">Loading...</div>
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
