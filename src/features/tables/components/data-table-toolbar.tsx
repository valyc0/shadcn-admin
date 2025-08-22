import { type Table } from '@tanstack/react-table'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type Contact } from '../data/schema'
import { Plus } from 'lucide-react'

interface DataTableToolbarProps {
  table: Table<Contact>
  onAddContact: () => void
}

export function DataTableToolbar({ table, onAddContact }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Cerca contatti...'
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <Button onClick={onAddContact} size='sm' className='h-8'>
        <Plus className='mr-2 h-4 w-4' />
        Aggiungi Contatto
      </Button>
    </div>
  )
}
