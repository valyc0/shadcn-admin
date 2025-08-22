# 🚀 Shadcn Admin - Guida allo Sviluppo

## 📖 Panoramica

Questo README fornisce una guida completa per sviluppatori su come estendere e personalizzare la dashboard Shadcn Admin. Il progetto utilizza un'architettura modulare basata su React, TypeScript, TanStack Router e un backend Express.js con PostgreSQL.

## 🏗️ Architettura del Progetto

```
shadcn-admin/
├── src/
│   ├── features/           # Moduli funzionali organizzati per dominio
│   │   ├── tables/        # Esempio: sezione tabelle/contatti
│   │   │   ├── api/       # Servizi API per la comunicazione backend
│   │   │   ├── components/ # Componenti UI specifici della feature
│   │   │   ├── data/      # Schema, tipi e dati mock
│   │   │   └── index.tsx  # Pagina principale della feature
│   │   ├── dashboard/     # Dashboard principale
│   │   ├── users/         # Gestione utenti
│   │   └── ...            # Altre features
│   ├── routes/            # Routing con TanStack Router
│   │   ├── _authenticated/ # Route protette da autenticazione
│   │   └── ...
│   ├── components/        # Componenti UI riutilizzabili
│   ├── hooks/            # Custom hooks React
│   ├── lib/              # Utilità e configurazioni
│   └── stores/           # Gestione stato globale (Zustand)
├── server/               # Backend Express.js
│   ├── server.js         # Server principale con API REST
│   └── package.json      # Dipendenze backend
└── package.json          # Dipendenze frontend
```

## 🛠️ Installazione e Configurazione

### Prerequisiti

- **Node.js** (versione 18+)
- **PostgreSQL** (versione 12+)
- **pnpm** (installato automaticamente se necessario)

### Installazione Rapida

```bash
# 1. Clona il repository
git clone <repository-url>
cd shadcn-admin

# 2. Rendi eseguibili gli script
chmod +x install.sh start.sh

# 3. Installa tutte le dipendenze
./install.sh

# 4. Configura l'ambiente (opzionale)
cp .env.example .env
# Modifica .env con le tue configurazioni

# 5. Avvia l'applicazione completa
./start.sh
```

### Installazione Manuale

```bash
# Frontend
pnpm install

# Backend
cd server
npm install
cd ..
```

### Configurazione Database

Assicurati che PostgreSQL sia in esecuzione con:
- **Host**: localhost
- **Porta**: 5432
- **Database**: mydb
- **User/Password**: configurati nel backend

## 🔧 Avvio dell'Applicazione

### Avvio Completo (Raccomandato)

```bash
./start.sh
```

Questo script avvia:
- Backend Express.js su `http://localhost:3001`
- Frontend Vite dev server su `http://localhost:5173`

### Avvio Separato

```bash
# Solo frontend
pnpm run dev

# Solo backend
cd server && npm start
```

## 📋 Come Implementare una Nuova Sezione

### Passo 1: Creare la Struttura delle Cartelle

```bash
# Esempio: creazione sezione "products"
mkdir -p src/features/products/{api,components,data}
```

### Passo 2: Definire i Tipi e Schema

Crea `src/features/products/data/schema.ts`:

```typescript
import { z } from 'zod'

// Schema di validazione Zod
export const productSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, 'Nome richiesto'),
  descrizione: z.string().optional(),
  prezzo: z.number().min(0, 'Prezzo deve essere positivo'),
  categoria: z.string().min(1, 'Categoria richiesta'),
  disponibile: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// Tipi TypeScript derivati
export type Product = z.infer<typeof productSchema>
export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

// Dati iniziali per i form
export const initialProductData: ProductFormData = {
  nome: '',
  descrizione: '',
  prezzo: 0,
  categoria: '',
  disponibile: true,
}

// Opzioni per select/dropdown
export const categorieOptions = [
  { value: 'elettronica', label: 'Elettronica' },
  { value: 'abbigliamento', label: 'Abbigliamento' },
  { value: 'casa', label: 'Casa e Giardino' },
] as const
```

### Passo 3: Implementare i Servizi API

Crea `src/features/products/api/products.ts`:

```typescript
const API_BASE = 'http://localhost:3001'

const getAuthToken = () => sessionStorage.getItem("token")

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Errore nella richiesta")
  }
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }
  return {}
}

export interface ProductsResponse {
  data: Product[]
  total: number
  page: number
  pageSize: number
}

// GET: Lista prodotti con paginazione e ordinamento
export const getProducts = async (
  page: number = 1,
  pageSize: number = 10,
  sort: { by: string; order: 'asc' | 'desc' } = { by: 'id', order: 'asc' },
  filters?: { categoria?: string; disponibile?: boolean }
): Promise<ProductsResponse> => {
  const token = getAuthToken()
  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy: sort.by,
    order: sort.order,
    ...(filters?.categoria && { categoria: filters.categoria }),
    ...(filters?.disponibile !== undefined && { disponibile: filters.disponibile.toString() }),
  })

  const response = await fetch(`${API_BASE}/api/products?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}

// POST: Crea nuovo prodotto
export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })
  return handleResponse(response)
}

// PUT: Aggiorna prodotto esistente
export const updateProduct = async (id: number, productData: ProductFormData): Promise<Product> => {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })
  return handleResponse(response)
}

// DELETE: Elimina prodotto
export const deleteProduct = async (id: number): Promise<void> => {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}

// GET: Ottieni singolo prodotto per ID
export const getProductById = async (id: number): Promise<Product> => {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(response)
}
```

### Passo 4: Creare i Componenti UI

Crea `src/features/products/components/products-table.tsx`:

```typescript
import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus } from 'lucide-react'
import { type Product } from '../data/schema'

interface ProductsTableProps {
  data: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onAddProduct: () => void
  isLoading?: boolean
  currentPage: number
  pageSize: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void
}

export function ProductsTable({
  data,
  onEdit,
  onDelete,
  onAddProduct,
  isLoading = false,
  currentPage,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSortChange,
}: ProductsTableProps) {
  
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('nome')}</div>
      ),
    },
    {
      accessorKey: 'categoria',
      header: 'Categoria',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('categoria')}</Badge>
      ),
    },
    {
      accessorKey: 'prezzo',
      header: 'Prezzo',
      cell: ({ row }) => {
        const prezzo = parseFloat(row.getValue('prezzo'))
        return <div className="text-right font-mono">€{prezzo.toFixed(2)}</div>
      },
    },
    {
      accessorKey: 'disponibile',
      header: 'Disponibile',
      cell: ({ row }) => (
        <Badge variant={row.getValue('disponibile') ? 'success' : 'destructive'}>
          {row.getValue('disponibile') ? 'Sì' : 'No'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Azioni',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original.id!)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalRows / pageSize),
    state: {
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
      sorting: sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [],
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: currentPage,
          pageSize,
        })
        onPageChange(newState.pageIndex)
        if (newState.pageSize !== pageSize) {
          onPageSizeChange(newState.pageSize)
        }
      }
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Caricamento prodotti...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Prodotti</CardTitle>
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Prodotto
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nessun prodotto trovato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Paginazione */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalRows)} di {totalRows} prodotti
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Precedente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalRows / pageSize) - 1}
            >
              Successivo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Passo 5: Creare la Pagina Principale

Crea `src/features/products/index.tsx`:

```typescript
import { useState, useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ProductsTable } from './components/products-table'
import { ProductModal } from './components/product-modal'
import { ConfirmDeleteDialog } from './components/confirm-delete-dialog'
import { getProducts, createProduct, updateProduct, deleteProduct } from './api/products'
import { type Product, type ProductFormData, initialProductData } from './data/schema'

export default function ProductsPage() {
  const search = useSearch({ from: '/_authenticated/products/' })
  const navigate = useNavigate({ from: '/products' })

  // State
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [productData, setProductData] = useState<ProductFormData>(initialProductData)
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Navigation handlers
  const handlePageChange = (page: number) => {
    navigate({
      search: { ...search, page: page + 1 }
    })
  }

  const handlePageSizeChange = (pageSize: number) => {
    navigate({
      search: { ...search, pageSize, page: 1 }
    })
  }

  const handleSortChange = (sortBy: string, order: 'asc' | 'desc') => {
    navigate({
      search: { ...search, sortBy, order }
    })
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await getProducts(
        search.page,
        search.pageSize,
        { by: search.sortBy, order: search.order }
      )
      setProducts(response.data)
      setTotalProducts(response.total)
    } catch (error) {
      console.error('Errore nel caricamento dei prodotti:', error)
      toast.error('Impossibile caricare i prodotti')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [search.page, search.pageSize, search.sortBy, search.order])

  const handleOpenModal = (product?: Product) => {
    setIsModalOpen(true)
    setEditingProduct(product)
    if (product) {
      setProductData(product)
    } else {
      setProductData(initialProductData)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(undefined)
    setProductData(initialProductData)
  }

  const handleSave = async (productData: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id!, productData)
        toast.success('Prodotto aggiornato con successo!')
      } else {
        await createProduct(productData)
        toast.success('Prodotto creato con successo!')
      }
      await fetchProducts()
      handleCloseModal()
    } catch (error) {
      console.error('Errore nel salvataggio del prodotto:', error)
      toast.error('Errore nel salvataggio del prodotto')
    }
  }

  const handleDelete = (id: number) => {
    setProductToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteProduct(productToDelete)
      await fetchProducts()
      toast.success('Prodotto eliminato con successo!')
    } catch (error) {
      console.error('Errore nell\'eliminazione del prodotto:', error)
      toast.error('Errore nell\'eliminazione del prodotto')
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
      setProductToDelete(null)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Gestione Prodotti</h1>
        <p className='text-muted-foreground'>
          Gestisci il catalogo prodotti con operazioni complete di CRUD
        </p>
      </div>

      <ProductsTable
        data={products}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        onAddProduct={() => handleOpenModal()}
        isLoading={loading}
        currentPage={search.page - 1}
        pageSize={search.pageSize}
        totalRows={totalProducts}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sortBy={search.sortBy}
        sortOrder={search.order}
        onSortChange={handleSortChange}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        productData={productData}
        setProductData={setProductData}
        editingProduct={editingProduct}
      />

      <ConfirmDeleteDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
```

### Passo 6: Configurare il Routing

Crea `src/routes/_authenticated/products/index.tsx`:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import ProductsPage from '@/features/products'

const productsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).max(100).catch(10),
  sortBy: z.string().catch('id'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  categoria: z.string().optional(),
  disponibile: z.coerce.boolean().optional(),
})

export const Route = createFileRoute('/_authenticated/products/')({
  component: ProductsPage,
  validateSearch: productsSearchSchema,
})
```

### Passo 7: Implementare l'API Backend

Aggiungi al file `server/server.js` le nuove route:

```javascript
// Route per prodotti
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      sortBy = 'id', 
      order = 'asc',
      categoria,
      disponibile 
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Filtri
    if (categoria) {
      query += ` AND categoria = $${++paramCount}`;
      params.push(categoria);
    }

    if (disponibile !== undefined) {
      query += ` AND disponibile = $${++paramCount}`;
      params.push(disponibile === 'true');
    }

    // Ordinamento
    query += ` ORDER BY ${sortBy} ${order}`;

    // Paginazione
    const offset = (page - 1) * pageSize;
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(pageSize, offset);

    const result = await pool.query(query, params);

    // Conta totale per paginazione
    let countQuery = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (categoria) {
      countQuery += ` AND categoria = $${++countParamCount}`;
      countParams.push(categoria);
    }

    if (disponibile !== undefined) {
      countQuery += ` AND disponibile = $${++countParamCount}`;
      countParams.push(disponibile === 'true');
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('Errore nel recupero prodotti:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { nome, descrizione, prezzo, categoria, disponibile } = req.body;
    
    const result = await pool.query(
      `INSERT INTO products (nome, descrizione, prezzo, categoria, disponibile, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [nome, descrizione, prezzo, categoria, disponibile]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Errore nella creazione prodotto:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descrizione, prezzo, categoria, disponibile } = req.body;
    
    const result = await pool.query(
      `UPDATE products 
       SET nome = $1, descrizione = $2, prezzo = $3, categoria = $4, disponibile = $5, updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [nome, descrizione, prezzo, categoria, disponibile, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Errore nell\'aggiornamento prodotto:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }
    
    res.json({ message: 'Prodotto eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione prodotto:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});
```

### Passo 8: Creare le Tabelle Database

Aggiungi la migrazione SQL per la tabella prodotti:

```sql
-- Tabella products
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descrizione TEXT,
    prezzo DECIMAL(10,2) NOT NULL DEFAULT 0,
    categoria VARCHAR(100) NOT NULL,
    disponibile BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_disponibile ON products(disponibile);
CREATE INDEX IF NOT EXISTS idx_products_prezzo ON products(prezzo);

-- Dati di esempio
INSERT INTO products (nome, descrizione, prezzo, categoria, disponibile) VALUES
('Laptop Dell XPS 13', 'Laptop ultrabook con schermo 13 pollici', 1299.99, 'elettronica', true),
('T-Shirt Nike', 'Maglietta sportiva in cotone', 29.99, 'abbigliamento', true),
('Aspirapolvere Dyson', 'Aspirapolvere senza filo potente', 349.99, 'casa', true),
('Smartphone Samsung', 'Telefono Android ultima generazione', 899.99, 'elettronica', false);
```

## 🔧 Gestione Stato e Hooks Personalizzati

### Custom Hook per API Calls

Crea `src/hooks/use-products.ts`:

```typescript
import { useState, useEffect } from 'react'
import { getProducts } from '@/features/products/api/products'
import { type Product } from '@/features/products/data/schema'

interface UseProductsOptions {
  page?: number
  pageSize?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  autoFetch?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'id',
    order = 'asc',
    autoFetch = true
  } = options

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getProducts(page, pageSize, { by: sortBy, order })
      setProducts(response.data)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchProducts()
    }
  }, [page, pageSize, sortBy, order, autoFetch])

  return {
    products,
    total,
    loading,
    error,
    refetch: fetchProducts,
  }
}
```

### Store Zustand per Stato Globale

Crea `src/stores/products-store.ts`:

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type Product } from '@/features/products/data/schema'

interface ProductsStore {
  products: Product[]
  selectedProduct: Product | null
  filters: {
    categoria?: string
    disponibile?: boolean
    search?: string
  }
  
  // Actions
  setProducts: (products: Product[]) => void
  setSelectedProduct: (product: Product | null) => void
  setFilters: (filters: Partial<ProductsStore['filters']>) => void
  clearFilters: () => void
  
  // Computed
  filteredProducts: Product[]
}

export const useProductsStore = create<ProductsStore>()(
  devtools(
    (set, get) => ({
      products: [],
      selectedProduct: null,
      filters: {},

      setProducts: (products) => set({ products }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setFilters: (newFilters) => 
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      clearFilters: () => set({ filters: {} }),

      get filteredProducts() {
        const { products, filters } = get()
        return products.filter(product => {
          if (filters.categoria && product.categoria !== filters.categoria) return false
          if (filters.disponibile !== undefined && product.disponibile !== filters.disponibile) return false
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            return product.nome.toLowerCase().includes(searchTerm) ||
                   product.descrizione?.toLowerCase().includes(searchTerm)
          }
          return true
        })
      },
    }),
    {
      name: 'products-store',
    }
  )
)
```

## 🎨 Componenti UI Riutilizzabili

### Filtri Avanzati

Crea `src/components/filters/product-filters.tsx`:

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { categorieOptions } from '@/features/products/data/schema'

interface ProductFiltersProps {
  filters: {
    categoria?: string
    disponibile?: boolean
    search?: string
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

export function ProductFilters({ filters, onFiltersChange, onClearFilters }: ProductFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtri</CardTitle>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Pulisci
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Cerca</Label>
          <Input
            id="search"
            placeholder="Cerca per nome o descrizione..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>

        <div>
          <Label>Categoria</Label>
          <Select
            value={filters.categoria || ''}
            onValueChange={(value) => onFiltersChange({ 
              ...filters, 
              categoria: value || undefined 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tutte le categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tutte le categorie</SelectItem>
              {categorieOptions.map((categoria) => (
                <SelectItem key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="disponibile"
            checked={filters.disponibile === true}
            onCheckedChange={(checked) => onFiltersChange({ 
              ...filters, 
              disponibile: checked ? true : undefined 
            })}
          />
          <Label htmlFor="disponibile">Solo prodotti disponibili</Label>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 🧪 Testing

### Test per Servizi API

Crea `src/features/products/api/__tests__/products.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProducts, createProduct } from '../products'

// Mock fetch
global.fetch = vi.fn()

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(() => 'mock-token'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockResponse = {
        data: [
          { id: 1, nome: 'Test Product', prezzo: 99.99, categoria: 'test' }
        ],
        total: 1,
        page: 1,
        pageSize: 10
      }

      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'application/json',
        },
        json: async () => mockResponse,
      })

      const result = await getProducts(1, 10, { by: 'id', order: 'asc' })

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/products?page=1&pageSize=10&sortBy=id&order=asc',
        {
          headers: {
            Authorization: 'Bearer mock-token',
          },
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Server error',
      })

      await expect(getProducts()).rejects.toThrow('Server error')
    })
  })
})
```

### Test per Componenti

Crea `src/features/products/components/__tests__/products-table.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductsTable } from '../products-table'

const mockProducts = [
  {
    id: 1,
    nome: 'Test Product',
    categoria: 'test',
    prezzo: 99.99,
    disponibile: true,
  },
]

const defaultProps = {
  data: mockProducts,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onAddProduct: vi.fn(),
  currentPage: 0,
  pageSize: 10,
  totalRows: 1,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
  onSortChange: vi.fn(),
}

describe('ProductsTable', () => {
  it('renders products correctly', () => {
    render(<ProductsTable {...defaultProps} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('€99.99')).toBeInTheDocument()
    expect(screen.getByText('Sì')).toBeInTheDocument() // disponibile
  })

  it('calls onAddProduct when add button is clicked', () => {
    render(<ProductsTable {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Aggiungi Prodotto'))
    expect(defaultProps.onAddProduct).toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<ProductsTable {...defaultProps} isLoading={true} />)
    
    expect(screen.getByText('Caricamento prodotti...')).toBeInTheDocument()
  })
})
```

## 📚 Best Practices

### 1. Struttura dei File
- Organizza per **feature** non per tipo di file
- Usa l'architettura **barrel exports** (`index.ts`)
- Mantieni i componenti **atomici** e riutilizzabili

### 2. Type Safety
- Usa **TypeScript** con strict mode
- Valida i dati con **Zod**
- Definisci **interfacce chiare** per API

### 3. Performance
- Implementa **lazy loading** per le route
- Usa **React.memo** per componenti pesanti
- Ottimizza le **query del database**

### 4. Error Handling
- Gestisci gli errori a **tutti i livelli**
- Usa **toast notifications** per feedback utente
- Implementa **error boundaries**

### 5. Testing
- Scrivi test per **servizi API**
- Testa i **componenti isolatamente**
- Usa **MSW** per mock API nei test

## 🔧 Configurazioni Avanzate

### Environment Variables

Crea `.env.example`:

```bash
# Frontend
VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
PORT=3001

# Optional
CORS_ORIGIN=http://localhost:5173
```

### Docker Support

Crea `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://localhost:3001
    depends_on:
      - backend

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/mydb
      - JWT_SECRET=your_secret_key
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🚀 Deploy in Produzione

### Build e Deploy

```bash
# Build frontend
pnpm run build

# Build backend (se necessario)
cd server
npm run build  # se hai un build step

# Deploy su Vercel/Netlify (frontend)
# Deploy su Railway/Heroku (backend)
```

### Configurazioni Produzione

1. **Database**: Usa PostgreSQL hosted (Supabase, Railway, etc.)
2. **Frontend**: Deploy su Vercel/Netlify
3. **Backend**: Deploy su Railway/Heroku/DigitalOcean
4. **Monitoring**: Aggiungi Sentry per error tracking
5. **Analytics**: Integra Google Analytics

## ❓ Troubleshooting

### Problemi Comuni

1. **CORS Errors**: Configura correttamente le origin nel backend
2. **Database Connection**: Verifica le credenziali e che PostgreSQL sia in esecuzione
3. **Build Errors**: Controlla le dipendenze e la configurazione TypeScript
4. **Performance Issues**: Implementa lazy loading e ottimizza le query

### Debug

```bash
# Logs backend
cd server && npm run dev

# Debug frontend
pnpm run dev

# Database logs
docker logs postgres_container_name
```

---

## 📞 Supporto

Per domande o problemi:

1. Controlla la documentazione esistente
2. Cerca nei **GitHub Issues**
3. Crea un nuovo issue con:
   - Descrizione del problema
   - Passi per riprodurre
   - Versioni coinvolte
   - Log di errore

**Happy Coding! 🚀**
