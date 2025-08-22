import { useState, useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ContactsTable } from './components/contacts-table'
import { ContactModal } from './components/contact-modal'
import { ConfirmDeleteDialog } from './components/confirm-delete-dialog'
import { getRubricaData, saveRubricaContact, deleteRubricaContact } from './api/contacts'
import { type Contact, initialContactData } from './data/schema'

export default function TablesPage() {
  const search = useSearch({ from: '/_authenticated/tables/' })
  const navigate = useNavigate({ from: '/tables' })

  // State
  const [contacts, setContacts] = useState<Contact[]>([])
  const [totalContacts, setTotalContacts] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | undefined>()
  const [contactData, setContactData] = useState<Omit<Contact, 'id'> | Contact>(initialContactData)
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Navigation handlers for pagination
  const handlePageChange = (page: number) => {
    navigate({
      search: { ...search, page: page + 1 } // TanStack Table usa 0-based, ma il nostro API usa 1-based
    })
  }

  const handlePageSizeChange = (pageSize: number) => {
    navigate({
      search: { ...search, pageSize, page: 1 } // Reset alla prima pagina quando cambia il page size
    })
  }

  const handleSortChange = (sortBy: string, order: 'asc' | 'desc') => {
    navigate({
      search: { ...search, sortBy, order }
    })
  }

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const response = await getRubricaData(
        search.page,
        search.pageSize,
        { by: search.sortBy, order: search.order }
      )
      setContacts(response.data)
      setTotalContacts(response.total)
    } catch (error) {
      console.error('Errore nel caricamento dei contatti:', error)
      toast.error('Impossibile caricare i contatti')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [search.page, search.pageSize, search.sortBy, search.order])

  const handleOpenModal = (contact?: Contact) => {
    setIsModalOpen(true)
    setEditingContact(contact)
    if (contact) {
      setContactData(contact)
    } else {
      setContactData(initialContactData)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingContact(undefined)
    setContactData(initialContactData)
  }

  const handleSave = async (contactData: Omit<Contact, 'id'>, editingContact?: Contact) => {
    try {
      await saveRubricaContact(contactData, editingContact)
      await fetchContacts()
      toast.success(`Contatto ${editingContact ? 'aggiornato' : 'creato'} con successo!`)
    } catch (error) {
      console.error('Errore nel salvataggio del contatto:', error)
      toast.error('Errore nel salvataggio del contatto')
      throw error
    }
  }

  const handleDelete = (id: number) => {
    setContactToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!contactToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteRubricaContact(contactToDelete)
      await fetchContacts()
      toast.success('Contatto eliminato con successo!')
    } catch (error) {
      console.error('Errore nell\'eliminazione del contatto:', error)
      toast.error('Errore nell\'eliminazione del contatto')
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
      setContactToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false)
    setContactToDelete(null)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Rubrica Contatti</h1>
        <p className='text-muted-foreground'>
          Gestisci i tuoi contatti con operazioni complete di CRUD
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contatti</CardTitle>
          <CardDescription>
            Lista completa dei contatti con funzionalità di ordinamento, filtro e paginazione
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactsTable
            data={contacts}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onAddContact={() => handleOpenModal()}
            isLoading={loading}
            currentPage={search.page - 1} // Converte da 1-based a 0-based per TanStack Table
            pageSize={search.pageSize}
            totalRows={totalContacts}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            sortBy={search.sortBy}
            sortOrder={search.order}
            onSortChange={handleSortChange}
          />
        </CardContent>
      </Card>

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        contactData={contactData}
        setContactData={setContactData}
        editingContact={editingContact}
      />

      <ConfirmDeleteDialog
        isOpen={deleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
