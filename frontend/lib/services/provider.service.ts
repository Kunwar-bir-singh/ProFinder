import { api } from '../api'
import type { 
  Provider, 
  CreateProviderRequest,
  ApiResponse,
  PaginationParams,
  SearchFilters 
} from '../types'

export const providerService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all providers
    getProviders: builder.query<ApiResponse<Provider[]>, PaginationParams | void>({
      query: (params = {}) => ({
        url: '/providers',
        method: 'GET',
        params,
      }),
      providesTags: ['Provider'],
    }),

    // Get provider by ID
    getProviderById: builder.query<ApiResponse<Provider>, string>({
      query: (id) => `/providers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Provider', id }],
    }),

    // Create new provider
    createProvider: builder.mutation<ApiResponse<Provider>, CreateProviderRequest>({
      query: (providerData) => ({
        url: '/providers',
        method: 'POST',
        body: providerData,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Update provider
    updateProvider: builder.mutation<ApiResponse<Provider>, { id: string; data: Partial<CreateProviderRequest> }>({
      query: ({ id, data }) => ({
        url: `/providers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Provider', id },
        'Provider'
      ],
    }),

    // Delete provider
    deleteProvider: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/providers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Provider'],
    }),

    // Get providers by profession
    getProvidersByProfession: builder.query<ApiResponse<Provider[]>, { professionId: string; params?: PaginationParams }>({
      query: ({ professionId, params = {} }) => ({
        url: `/providers/profession/${professionId}`,
        method: 'GET',
        params,
      }),
      providesTags: ['Provider'],
    }),

    // Search providers
    searchProviders: builder.query<ApiResponse<Provider[]>, SearchFilters & PaginationParams>({
      query: (filters) => ({
        url: '/providers/search',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['Provider', 'Search'],
    }),

    // Get featured providers
    getFeaturedProviders: builder.query<ApiResponse<Provider[]>, PaginationParams | void>({
      query: (params = {}) => ({
        url: '/providers/featured',
        method: 'GET',
        params,
      }),
      providesTags: ['Provider'],
    }),

    // Get providers by location
    getProvidersByLocation: builder.query<ApiResponse<Provider[]>, { location: string; params?: PaginationParams }>({
      query: ({ location, params = {} }) => ({
        url: `/providers/location/${encodeURIComponent(location)}`,
        method: 'GET',
        params,
      }),
      providesTags: ['Provider'],
    }),

    // Update provider availability
    updateAvailability: builder.mutation<ApiResponse<Provider>, { id: string; availability: string }>({
      query: ({ id, availability }) => ({
        url: `/providers/${id}/availability`,
        method: 'PATCH',
        body: { availability },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Provider', id },
        'Provider'
      ],
    }),

    // Upload provider images
    uploadImages: builder.mutation<ApiResponse<{ urls: string[] }>, { id: string; images: File[] }>({
      query: ({ id, images }) => {
        const formData = new FormData()
        images.forEach((image, index) => {
          formData.append(`images`, image)
        })
        return {
          url: `/providers/${id}/images`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Provider', id },
        'Provider'
      ],
    }),
  }),
})

export const {
  useGetProvidersQuery,
  useGetProviderByIdQuery,
  useCreateProviderMutation,
  useUpdateProviderMutation,
  useDeleteProviderMutation,
  useGetProvidersByProfessionQuery,
  useSearchProvidersQuery,
  useGetFeaturedProvidersQuery,
  useGetProvidersByLocationQuery,
  useUpdateAvailabilityMutation,
  useUploadImagesMutation,
} = providerService
