'use client'

import { useGetProfessionsQuery, useSearchProvidersQuery } from '@/lib/hooks/hooks'
import { useState } from 'react'

export function RTKExample() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Example: Fetching professions
  const { 
    data: professions, 
    error: professionsError, 
    isLoading: professionsLoading 
  } = useGetProfessionsQuery()

  // Example: Searching providers
  const { 
    data: searchResults, 
    error: searchError, 
    isLoading: searchLoading 
  } = useSearchProvidersQuery(
    { profession: searchTerm },
    { skip: !searchTerm } // Only search when we have a term
  )

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">RTK Query Example</h2>
      
      {/* Professions List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Professions</h3>
        {professionsLoading && <p>Loading professions...</p>}
        {professionsError && <p className="text-red-500">Error loading professions</p>}
        {professions && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professions.data.map((profession) => (
              <div key={profession.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{profession.name}</h4>
                <p className="text-sm text-gray-600">{profession.description}</p>
                <span className="text-xs text-blue-600">{profession.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Example */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Search Providers</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by profession..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          
          {searchLoading && <p>Searching...</p>}
          {searchError && <p className="text-red-500">Search failed</p>}
          {searchResults && searchResults.data.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Found {searchResults.data.length} providers
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.data.map((provider) => (
                  <div key={provider.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{provider.businessName}</h4>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                    <p className="text-sm">
                      <span className="font-medium">Rating:</span> {provider.rating}/5
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {provider.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
