import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from './data-table-column-header'
import { type Contact } from '../data/schema'
import { Edit, Trash2 } from 'lucide-react'

interface ContactsColumnsProps {
  onEdit: (contact: Contact) => void
  onDelete: (id: number) => void
}

export const getContactsColumns = ({ onEdit, onDelete }: ContactsColumnsProps): ColumnDef<Contact>[] => [
  {
    accessorKey: 'nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nome' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('nome')}</div>,
    meta: {
      className: 'w-[15%]',
    },
  },
  {
    accessorKey: 'cognome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cognome' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('cognome')}</div>,
    meta: {
      className: 'w-[15%]',
    },
  },
  {
    accessorKey: 'telefono',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Telefono' />
    ),
    cell: ({ row }) => <div>{row.getValue('telefono')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'indirizzo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Indirizzo' />
    ),
    cell: ({ row }) => <div>{row.getValue('indirizzo')}</div>,
  },
  {
    id: 'actions',
    header: 'Azioni',
    cell: ({ row }) => {
      const contact = row.original
      
      return (
        <div className='flex space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(contact)}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => contact.id && onDelete(contact.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
