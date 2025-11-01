import { ApiResponse } from "@/lib/utils/types/types";
import { api } from "../api";


export const professionService = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all professions
    getProfessions: builder.query<
      ApiResponse<Profession[]>,
      PaginationParams
       | void
    >({
      query: (params = {}) => ({
        url: "/professions",
        method: "GET",
        params,
      }),
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
} = professionService;
