# 🎨 Shadcn Admin Dashboard

Una dashboard amministrativa moderna e completa costruita con React, TypeScript, TanStack Router e PostgreSQL. Offre un'interfaccia utente elegante con componenti shadcn/ui e funzionalità complete di autenticazione e gestione dati.

## 🌟 Caratteristiche Principali

- ⚡ **Frontend Moderno**: React 19 + TypeScript + Vite
- 🎨 **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- 🔀 **Routing**: TanStack Router con type-safety completa
- 🔐 **Autenticazione**: Clerk Auth + JWT Backend
- 📊 **State Management**: Zustand + TanStack Query
- 🗄️ **Database**: PostgreSQL con API Express.js
- 🐳 **Docker**: Setup completo per sviluppo e produzione
- 📱 **Responsive**: Design mobile-first
- 🌙 **Dark Mode**: Supporto completo tema scuro/chiaro
- 🌍 **i18n Ready**: Supporto RTL e multi-lingua

## 🏗️ Architettura

```
shadcn-admin/
├── src/
│   ├── features/          # Moduli funzionali organizzati per dominio
│   │   ├── auth/         # Autenticazione e gestione utenti
│   │   ├── dashboard/    # Dashboard principale con statistiche
│   │   ├── tables/       # Gestione tabelle e contatti
│   │   ├── users/        # Gestione utenti amministratori
│   │   ├── tasks/        # Gestione task e attività
│   │   └── settings/     # Impostazioni applicazione
│   ├── components/       # Componenti UI riutilizzabili
│   ├── routes/          # Routing con TanStack Router
│   ├── stores/          # State management globale
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilità e configurazioni
├── server/              # Backend Express.js + PostgreSQL
├── nginx/               # Configurazione proxy Nginx
└── docker-compose.yml   # Setup Docker completo
```

## 🚀 Quick Start

### Prerequisiti

- **Node.js** 18+ 
- **PostgreSQL** 12+
- **Docker** (opzionale)

### Installazione Rapida

```bash
# Clona il repository
git clone <repository-url>
cd shadcn-admin

# Rendi eseguibili gli script
chmod +x install.sh start.sh

# Installa tutte le dipendenze
./install.sh

# Configura l'ambiente
cp .env.example .env
# Modifica .env con le tue configurazioni

# Avvia l'applicazione completa
./start.sh
```

L'applicazione sarà disponibile su:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

## ⚙️ Variabili di Configurazione

### Frontend (.env)

```bash
# URL del backend API
VITE_API_BASE_URL=http://localhost:3001

# Chiave pubblica Clerk per autenticazione
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Modalità di sviluppo (development/production)
NODE_ENV=development
```

### Backend (server/.env)

```bash
# Configurazione Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret per autenticazione
JWT_SECRET=your_super_secret_jwt_key_here

# Porta del server
PORT=3001

# Ambiente (development/production)
NODE_ENV=development

# Origins CORS permessi
CORS_ORIGINS=http://localhost:5173,http://localhost:4173,http://localhost:3000
```

## 🛠️ Modalità di Sviluppo

### Avvio Manuale

```bash
# Terminal 1: Avvia il database PostgreSQL
# Assicurati che PostgreSQL sia in esecuzione

# Terminal 2: Avvia il backend
cd server
npm install
npm start

# Terminal 3: Avvia il frontend
npm install
npm run dev
```

### Script Automatico

```bash
# Avvia tutto con un comando
./start.sh
```

### Debugging

```bash
# Solo frontend con hot reload
npm run dev

# Solo backend con nodemon
cd server && npm run dev

# Visualizza logs database
docker logs postgres_container_name
```

## 🐳 Modalità Docker

### Sviluppo con Docker

```bash
# Avvia tutti i servizi
docker-compose -f docker-compose.yml up -d

# Logs in tempo reale
docker-compose logs -f

# Stop dei servizi
docker-compose down
```

### Produzione con Docker

```bash
# Build delle immagini ottimizzate
docker-compose -f docker-compose.prod.yml build

# Deploy in produzione
docker-compose -f docker-compose.prod.yml up -d

# Monitoring
docker-compose -f docker-compose.prod.yml ps
```

I servizi Docker includono:
- **Frontend React** (porta 5173)
- **Backend Express** (porta 3001)
- **Database PostgreSQL** (porta 5432)
- **Nginx Proxy** (porta 80)

## 🎯 Modalità Produzione

### Build Locale

```bash
# Build frontend ottimizzato
npm run build

# Anteprima build locale
npm run preview  # Porta 4173 (senza dev tools)

# Build backend (se necessario)
cd server
npm run build
```

### Deploy Cloud

#### Frontend (Vercel/Netlify)

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

#### Backend (Railway/Heroku)

```bash
# Railway
railway deploy

# Heroku
heroku create your-app-name
git push heroku main
```

#### Database (Supabase/PlanetScale)

```bash
# Configura URL database in produzione
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## 📊 Funzionalità Disponibili

### 🔐 Autenticazione
- Login/Register con Clerk
- Protezione route JWT
- Gestione sessioni
- Reset password

### 📈 Dashboard
- Statistiche in tempo reale
- Grafici interattivi (Recharts)
- KPI e metriche
- Widget personalizzabili

### 👥 Gestione Utenti
- CRUD completo utenti
- Ruoli e permessi
- Profili utente
- Bulk operations

### 📋 Tabelle Dinamiche
- Ordinamento e filtri
- Paginazione server-side
- Ricerca full-text
- Export CSV/Excel

### ⚙️ Impostazioni
- Configurazioni applicazione
- Preferenze utente
- Temi e personalizzazione
- Backup/Restore

## 🔧 Personalizzazione

### Aggiungere una Nuova Sezione

```bash
# Crea la struttura
mkdir -p src/features/products/{api,components,data}

# Implementa schema
# src/features/products/data/schema.ts

# Crea servizi API
# src/features/products/api/products.ts

# Implementa componenti
# src/features/products/components/

# Configura routing
# src/routes/_authenticated/products/index.tsx
```

### Customizzare UI

```bash
# Temi Tailwind
# src/styles/globals.css

# Componenti shadcn/ui
npx shadcn-ui@latest add button

# Icone
# Lucide React incluso
```

## 🧪 Testing

### Test Unit

```bash
# Esegui tutti i test
npm run test

# Test con coverage
npm run test:coverage

# Test in watch mode
npm run test:watch
```

### Test E2E

```bash
# Playwright (se configurato)
npm run test:e2e
```

## 📱 Performance

### Frontend
- **Lazy Loading**: Route e componenti
- **Code Splitting**: Bundle ottimizzati
- **React Query**: Cache intelligente
- **Service Worker**: Caching offline

### Backend
- **Connection Pooling**: PostgreSQL
- **Query Optimization**: Indici database
- **Rate Limiting**: API protection
- **Compression**: Gzip responses

## 🔍 Monitoring

### Development
- React DevTools
- TanStack Query DevTools
- TanStack Router DevTools

### Production
- Error Tracking: Sentry
- Analytics: Google Analytics
- Performance: Web Vitals
- Uptime: StatusPage

## 📚 Scripts Disponibili

### Frontend
```bash
npm run dev          # Sviluppo con hot reload
npm run build        # Build produzione
npm run preview      # Anteprima build
npm run lint         # ESLint check
npm run format       # Prettier format
npm run type-check   # TypeScript check
```

### Backend
```bash
npm start           # Produzione
npm run dev         # Sviluppo con nodemon
npm run test        # Test suite
npm run migrate     # Database migrations
```

### Docker
```bash
docker-compose up -d              # Avvia servizi
docker-compose down               # Stop servizi
docker-compose logs -f [service]  # Visualizza logs
docker-compose exec api bash      # Shell nel container
```

## 🆘 Troubleshooting

### Problemi Comuni

#### CORS Errors
```bash
# Verifica origine nel backend server.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173']
}));
```

#### Database Connection
```bash
# Verifica PostgreSQL sia in esecuzione
sudo service postgresql start

# Controlla configurazione
psql -h localhost -U postgres -d mydb
```

#### Build Errors
```bash
# Pulisci cache e reinstalla
rm -rf node_modules package-lock.json
npm install

# Controlla TypeScript
npm run type-check
```

#### Performance Issues
```bash
# Analizza bundle
npm run build -- --analyze

# Profiling React
npm run dev
# Apri React DevTools > Profiler
```

## 🤝 Contribuire

1. **Fork** del repository
2. **Crea** un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** delle modifiche (`git commit -m 'Add AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 🙏 Credits

- [shadcn/ui](https://ui.shadcn.com/) - Componenti UI
- [TanStack](https://tanstack.com/) - Router e Query
- [Radix UI](https://www.radix-ui.com/) - Primitivi UI
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Clerk](https://clerk.com/) - Autenticazione

## 📞 Supporto

- 📖 **Documentazione**: [README-DEVELOPMENT.md](./README-DEVELOPMENT.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/username/repo/issues)
- 💬 **Discussioni**: [GitHub Discussions](https://github.com/username/repo/discussions)
- 📧 **Email**: support@yourapp.com

---

<div align="center">
  <strong>Made with ❤️ and ☕</strong>
</div>
