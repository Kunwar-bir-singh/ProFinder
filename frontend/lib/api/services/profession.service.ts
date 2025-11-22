import {
  ApiResponse,
  Profession,
  CreateProfessionRequest,
  PaginationParams,
  RawProviderData,
  TransformedProvider,
  SearchResponse,
} from "@/lib/utils/types/types";
import { api } from "@/lib/api/api";

// Transform raw provider data to UI format
const transformProviderData = (
  rawData: RawProviderData[],
  profession: string
): TransformedProvider[] => {
  return rawData.map((provider) => ({
    id: provider.user_id,
    user_id: provider.user_id,
    username: provider.email.split("@")[0],
    fullname: provider.fullname,
    profession: profession,
    phone: provider.phone,
    address: provider.address,
    rating: provider.rating,
    reviewCount: Math.floor(Math.random() * 100) + 20, // Mock review count
    verified: provider.is_verified,
    yearsExperience: provider.year_of_experience,
    profileImage: "/placeholder-user.jpg",
    email: provider.email,
    bio: provider.bio,
    isAvailable: provider.is_available,
    serviceArea: provider.service_area,
  }));
};

export const professionService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all professions
    getProfessions: builder.query<
      ApiResponse<Profession[]>,
      PaginationParams | void
    >({
      query: (params) => {
        const queryParams = params ? params : undefined;
        return {
          url: "/professions",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Profession"],
    }),

    // Get profession by ID
    getProfessionById: builder.query<ApiResponse<Profession>, string>({
      query: (id) => `/professions/${id}`,
      providesTags: (result, error, id) => [{ type: "Profession", id }],
    }),

    // Create new profession
    createProfession: builder.mutation<
      ApiResponse<Profession>,
      CreateProfessionRequest
    >({
      query: (professionData) => ({
        url: "/professions",
        method: "POST",
        body: professionData,
      }),
      invalidatesTags: ["Profession"],
    }),

    // Update profession
    updateProfession: builder.mutation<
      ApiResponse<Profession>,
      { id: string; data: Partial<CreateProfessionRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/professions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Profession", id },
        "Profession",
      ],
    }),

    // Delete profession
    deleteProfession: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/professions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profession"],
    }),

    // Get professions by category
    getProfessionsByCategory: builder.query<ApiResponse<Profession[]>, string>({
      query: (category) => `/professions/category/${category}`,
      providesTags: ["Profession"],
    }),

    // Search professions
    searchProfessions: builder.query<
      ApiResponse<Profession[]>,
      { query: string; category?: string }
    >({
      query: ({ query, category }) => ({
        url: "/professions/search",
        method: "GET",
        params: { q: query, category },
      }),
      providesTags: ["Profession"],
    }),

    // Search providers by profession and city
    searchProvidersByProfessionAndCity: builder.query<
      SearchResponse,
      { city: string; profession: string }
    >({
      query: ({ city, profession }) => ({
        url: "/profession-providers",
        method: "GET",
        params: { city, profession },
      }),
      transformResponse: (response: ApiResponse<RawProviderData[]>, meta, args) => {
        return {
          success: true,
          data: transformProviderData(response.data, args.profession),
        };
      },
      providesTags: ["Provider"],
    }),
  }),
});

export const {
  useGetProfessionsQuery,
  useGetProfessionByIdQuery,
  useCreateProfessionMutation,
  useUpdateProfessionMutation,
  useDeleteProfessionMutation,
  useGetProfessionsByCategoryQuery,
  useSearchProfessionsQuery,
  useSearchProvidersByProfessionAndCityQuery,
} = professionService;
