import { apiRequest } from '@/lib/api-config';

export interface Contact {
  id?: number;
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  indirizzo: string;
}

export interface ContactsResponse {
  data: Contact[];
  total: number;
}

export const getRubricaData = async (
  page: number, 
  pageSize: number, 
  sort: { by: string; order: string }
): Promise<ContactsResponse> => {
  return apiRequest(
    `/api/rubrica?page=${page}&pageSize=${pageSize}&sortBy=${sort.by}&order=${sort.order}`
  );
};

export const saveRubricaContact = async (
  contactData: Contact, 
  editingContact?: Contact
): Promise<void> => {
  const method = editingContact ? "PUT" : "POST";
  const endpoint = editingContact
    ? `/api/rubrica/${editingContact.id}`
    : `/api/rubrica`;

  return apiRequest(endpoint, {
    method,
    body: JSON.stringify(contactData),
  });
};

export const deleteRubricaContact = async (contactId: number): Promise<void> => {
  return apiRequest(`/api/rubrica/${contactId}`, {
    method: "DELETE",
  });
};
