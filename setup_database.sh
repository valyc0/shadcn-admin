#!/bin/bash

# Nome del container PostgreSQL
DB_CONTAINER="postgres-db-1"

# File di dump da importare
DUMP_FILE="db_dump.sql"

# Controlla se il file di dump esiste
if [ ! -f "$DUMP_FILE" ]; then
    echo "Errore: File di dump $DUMP_FILE non trovato."
    exit 1
fi

echo "Inizio ripristino del database dal dump..."

# 1. Elimina il database esistente per assicurare una partenza pulita (ignora errori se non esiste)
docker exec "$DB_CONTAINER" psql -U postgres -c "DROP DATABASE IF EXISTS mydb;"

# 2. Crea un nuovo database vuoto
docker exec "$DB_CONTAINER" psql -U postgres -c "CREATE DATABASE mydb;"

# 3. Importa il contenuto del file di dump nel nuovo database
cat "$DUMP_FILE" | docker exec -i "$DB_CONTAINER" psql -U postgres -d mydb

echo "Ripristino del database completato con successo."