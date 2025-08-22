import { z } from 'zod'

export const contactSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, 'Nome è richiesto'),
  cognome: z.string().min(1, 'Cognome è richiesto'),
  telefono: z.string().min(1, 'Telefono è richiesto'),
  email: z.string().email('Email non valida'),
  indirizzo: z.string().min(1, 'Indirizzo è richiesto'),
})

export type Contact = z.infer<typeof contactSchema>

export const initialContactData: Omit<Contact, 'id'> = {
  nome: '',
  cognome: '',
  telefono: '',
  email: '',
  indirizzo: '',
}
