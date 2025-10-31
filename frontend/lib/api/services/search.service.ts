import { ApiResponse } from "@/lib/utils/types";
import { api } from "../api";

export const searchService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Global search
    search: builder.query<SearchResponse, SearchFilters & PaginationParams>({
      query: (filters) => ({
        url: '/search',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Search'],
    }),

    // Search by profession
    searchByProfession: builder.query<SearchResponse, { profession: string; filters?: Omit<SearchFilters, 'profession'> & PaginationParams }>({
      query: ({ profession, filters = {} }) => ({
        url: '/search/profession',
        method: 'GET',
        params: { profession, ...filters },
      }),
      providesTags: ['Search'],
    }),

    // Search by location
    searchByLocation: builder.query<SearchResponse, { location: string; filters?: Omit<SearchFilters, 'location'> & PaginationParams }>({
      query: ({ location, filters = {} }) => ({
        url: '/search/location',
        method: 'GET',
        params: { location, ...filters },
      }),
      providesTags: ['Search'],
    }),

    // Get search suggestions
    getSearchSuggestions: builder.query<{ suggestions: string[] }, { query: string; type?: 'profession' | 'location' }>({
      query: ({ query, type }) => ({
        url: '/search/suggestions',
        method: 'GET',
        params: { q: query, type },
      }),
    }),

    // Get popular searches
    getPopularSearches: builder.query<{ searches: string[] }, void>({
      query: () => '/search/popular',
      providesTags: ['Search'],
    }),

    // Get search filters
    getSearchFilters: builder.query<{ 
      professions: string[]
      locations: string[]
      priceRanges: { min: number; max: number }[]
      ratings: number[]
    }, void>({
      query: () => '/search/filters',
      providesTags: ['Search'],
    }),

    // Save search
    saveSearch: builder.mutation<{ success: boolean }, { query: string; filters: SearchFilters }>({
      query: (searchData) => ({
        url: '/search/save',
        method: 'POST',
        body: searchData,
      }),
    }),

    // Get saved searches
    getSavedSearches: builder.query<{ searches: Array<{ id: string; query: string; filters: SearchFilters; createdAt: string }> }, void>({
      query: () => '/search/saved',
      providesTags: ['Search'],
    }),

    // Delete saved search
    deleteSavedSearch: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/search/saved/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Search'],
    }),
  }),
})

export const {
  useSearchQuery,
  useSearchByProfessionQuery,
  useSearchByLocationQuery,
  useGetSearchSuggestionsQuery,
  useGetPopularSearchesQuery,
  useGetSearchFiltersQuery,
  useSaveSearchMutation,
  useGetSavedSearchesQuery,
  useDeleteSavedSearchMutation,
} = searchService
