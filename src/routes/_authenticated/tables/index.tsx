import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import TablesPage from '@/features/tables'

const tablesSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).max(100).catch(10),
  sortBy: z.string().catch('id'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/tables/')({
  component: TablesPage,
  validateSearch: tablesSearchSchema,
})
