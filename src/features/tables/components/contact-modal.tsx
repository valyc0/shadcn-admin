import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Contact, initialContactData } from '../data/schema'
import { Loader2 } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contactData: Omit<Contact, 'id'>, editingContact?: Contact) => Promise<void>
  contactData: Omit<Contact, 'id'> | Contact
  setContactData: (data: Omit<Contact, 'id'> | Contact) => void
  editingContact?: Contact
}

export function ContactModal({
  isOpen,
  onClose,
  onSave,
  contactData,
  setContactData,
  editingContact,
}: ContactModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContactData({ ...contactData, [name]: value })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(contactData, editingContact)
      onClose()
      setContactData(initialContactData)
    } catch (error) {
      console.error('Errore nel salvataggio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setContactData(initialContactData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {editingContact ? 'Modifica Contatto' : 'Aggiungi Contatto'}
          </DialogTitle>
          <DialogDescription>
            {editingContact 
              ? 'Modifica le informazioni del contatto' 
              : 'Inserisci le informazioni del nuovo contatto'
            }
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='nome' className='text-right'>
              Nome
            </Label>
            <Input
              id='nome'
              name='nome'
              value={contactData.nome}
              onChange={handleInputChange}
              className='col-span-3'
              placeholder='Inserisci il nome'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='cognome' className='text-right'>
              Cognome
            </Label>
            <Input
              id='cognome'
              name='cognome'
              value={contactData.cognome}
              onChange={handleInputChange}
              className='col-span-3'
              placeholder='Inserisci il cognome'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='telefono' className='text-right'>
              Telefono
            </Label>
            <Input
              id='telefono'
              name='telefono'
              value={contactData.telefono}
              onChange={handleInputChange}
              className='col-span-3'
              placeholder='Inserisci il telefono'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={contactData.email}
              onChange={handleInputChange}
              className='col-span-3'
              placeholder="Inserisci l'email"
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='indirizzo' className='text-right'>
              Indirizzo
            </Label>
            <Input
              id='indirizzo'
              name='indirizzo'
              value={contactData.indirizzo}
              onChange={handleInputChange}
              className='col-span-3'
              placeholder="Inserisci l'indirizzo"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {editingContact ? 'Aggiorna' : 'Crea'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
