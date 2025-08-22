import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type User } from '../data/schema'
import { type Role } from '../api/users'

type UsersDialogType = 'add' | 'edit' | 'delete'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  onSaveUser?: (userData: User, editingUser?: User) => Promise<void>
  onDeleteUser?: (userId: number) => Promise<void>
  roles: Role[]
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ 
  children, 
  onSaveUser, 
  onDeleteUser, 
  roles = [] 
}: { 
  children: React.ReactNode
  onSaveUser?: (userData: User, editingUser?: User) => Promise<void>
  onDeleteUser?: (userId: number) => Promise<void>
  roles?: Role[]
}) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  return (
    <UsersContext value={{ 
      open, 
      setOpen, 
      currentRow, 
      setCurrentRow, 
      onSaveUser, 
      onDeleteUser,
      roles 
    }}>
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
