import { useState, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { getUsersData, saveUser, deleteUser, getRolesData } from './api/users'
import { type User } from './data/schema'
import { type Role } from './api/users'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // State
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  // Navigation handlers for pagination
  const handlePageChange = (page: number) => {
    navigate({
      search: { ...search, page: page + 1 } // TanStack Table uses 0-based, but our API uses 1-based
    })
  }

  const handlePageSizeChange = (pageSize: number) => {
    navigate({
      search: { ...search, pageSize, page: 1 } // Reset to first page when page size changes
    })
  }

  const handleSortChange = (sortBy: string, order: 'asc' | 'desc') => {
    navigate({
      search: { ...search, sortBy, order }
    })
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getUsersData(
        search.page || 1,
        search.pageSize || 10,
        { by: search.sortBy || 'id', order: search.order || 'asc' }
      )
      setUsers(response.data)
      setTotalUsers(response.total)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Unable to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await getRolesData()
      setRoles(response.data)
    } catch (error) {
      console.error('Error loading roles:', error)
      toast.error('Unable to load roles')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search.page, search.pageSize, search.sortBy, search.order])

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleSaveUser = async (userData: User, editingUser?: User) => {
    try {
      await saveUser(userData, editingUser)
      await fetchUsers()
      toast.success(`User ${editingUser ? 'updated' : 'created'} successfully!`)
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error('Error saving user')
      throw error
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId)
      await fetchUsers()
      toast.success('User deleted successfully!')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting user')
      throw error
    }
  }

  return (
    <UsersProvider 
      onSaveUser={handleSaveUser}
      onDeleteUser={handleDeleteUser}
      roles={roles}
    >
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable 
            data={users} 
            search={search} 
            navigate={navigate}
            isLoading={loading}
            currentPage={(search.page || 1) - 1} // Convert from 1-based to 0-based for TanStack Table
            pageSize={search.pageSize || 10}
            totalRows={totalUsers}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            sortBy={search.sortBy || 'id'}
            sortOrder={search.order || 'asc'}
            onSortChange={handleSortChange}
          />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
