import { apiClient } from '@/hooks/use-api'
import { SAME_ORIGIN_API_BASE } from '@/lib/api-config'
import { endpoints } from '@/services/api'
import type { PaginatedResponse, Student, StudentCreateInput } from '@/types'

export interface FetchStudentsListParams {
  search?: string
  classId?: string
  status?: string
  year?: number
  page?: number
  limit?: number
}

function throwIfApiError(response: unknown, fallback: string): void {
  if (!response || typeof response !== 'object') return
  const r = response as { success?: boolean; error?: string; message?: string }
  if (r.success === false || r.error) {
    throw new Error(r.message ?? r.error ?? fallback)
  }
}

/** GET /api/v1/students/list */
export async function fetchStudentsList(
  params?: FetchStudentsListParams
): Promise<PaginatedResponse<Student>> {
  const queryParams: Record<string, string | number> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  }
  if (params?.search) queryParams.search = params.search
  if (params?.classId) queryParams.classId = params.classId
  if (params?.status) queryParams.status = params.status
  if (params?.year) queryParams.year = params.year

  const response = await apiClient.get(
    endpoints.student.list,
    queryParams,
    undefined,
    SAME_ORIGIN_API_BASE
  )
  throwIfApiError(response, 'Request failed')

  const result = response as PaginatedResponse<Student>
  return {
    data: result.data ?? [],
    meta: result.meta ?? {
      total: result.data?.length ?? 0,
      page: queryParams.page as number,
      limit: queryParams.limit as number,
      totalPages: 1,
    },
  }
}

/** POST /api/v1/students */
export async function createStudentApi(data: StudentCreateInput): Promise<Student> {
  const response = await apiClient.post(
    endpoints.student.create,
    data,
    undefined,
    SAME_ORIGIN_API_BASE
  )
  throwIfApiError(response, 'Failed to create student')

  const result = response as { data: Student }
  if (!result.data?.id) {
    throw new Error('Failed to create student')
  }
  return result.data
}

/** DELETE /api/v1/students/:id */
export async function deleteStudentApi(id: string): Promise<void> {
  const response = await apiClient.delete(
    endpoints.student.delete({ id }),
    undefined,
    SAME_ORIGIN_API_BASE
  )
  throwIfApiError(response, 'Failed to delete student')
}
