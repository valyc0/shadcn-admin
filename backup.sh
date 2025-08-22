#!/bin/bash

# Script di backup per shadcn-admin
# Crea un archivio tar.gz nella directory superiore

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica di essere nella directory corretta
if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
    log_error "Questo script deve essere eseguito dalla directory root di shadcn-admin"
    exit 1
fi

# Definisce il nome del backup con timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PROJECT_NAME="shadcn-admin"
BACKUP_NAME="${PROJECT_NAME}_backup_${TIMESTAMP}.tar.gz"
BACKUP_PATH="../${BACKUP_NAME}"

log_info "Creazione backup di ${PROJECT_NAME}..."
log_info "Nome file: ${BACKUP_NAME}"

# Crea una lista temporanea dei file da escludere
EXCLUDE_FILE=$(mktemp)
cat > "$EXCLUDE_FILE" << EOF
node_modules
.git
.github
.tanstack
.env
.env.local
.env.development
.env.production
dist
build
coverage
.nyc_output
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
Thumbs.db
*.tmp
*.temp
.vscode
.idea
*.swp
*.swo
*~
.cache
.parcel-cache
EOF

# Verifica spazio disponibile
CURRENT_DIR_SIZE=$(du -s . | cut -f1)
AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')

if [ "$CURRENT_DIR_SIZE" -gt "$AVAILABLE_SPACE" ]; then
    log_error "Spazio insufficiente per creare il backup"
    rm -f "$EXCLUDE_FILE"
    exit 1
fi

# Crea il backup
log_info "Creazione archivio tar.gz..."

if tar --exclude-from="$EXCLUDE_FILE" \
       --exclude="$BACKUP_NAME" \
       -czf "$BACKUP_PATH" \
       -C .. \
       "$(basename "$PWD")"; then
    
    # Calcola la dimensione del backup
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    
    log_info "Backup completato con successo!"
    log_info "File: $BACKUP_PATH"
    log_info "Dimensione: $BACKUP_SIZE"
    
    # Verifica l'integrità dell'archivio
    log_info "Verifica integrità dell'archivio..."
    if tar -tzf "$BACKUP_PATH" > /dev/null 2>&1; then
        log_info "Archivio verificato con successo!"
    else
        log_error "L'archivio potrebbe essere corrotto!"
        exit 1
    fi
    
else
    log_error "Errore durante la creazione del backup"
    rm -f "$EXCLUDE_FILE"
    exit 1
fi

# Pulisce il file temporaneo
rm -f "$EXCLUDE_FILE"

# Mostra il contenuto dell'archivio (prime 20 righe)
log_info "Primi 20 file nell'archivio:"
tar -tzf "$BACKUP_PATH" | head -20

# Mostra statistiche finali
echo
log_info "=== Backup completato ==="
log_info "Data: $(date)"
log_info "File backup: $BACKUP_PATH"
log_info "Dimensione: $BACKUP_SIZE"

# Suggerimenti
echo
log_warn "Suggerimenti:"
echo "  • Per ripristinare: tar -xzf $BACKUP_PATH"
echo "  • Per visualizzare contenuto: tar -tzf $BACKUP_PATH"
echo "  • Per verificare: tar -tzf $BACKUP_PATH > /dev/null && echo 'OK'"
