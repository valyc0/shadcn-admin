#!/bin/bash

# Script per fermare tutti i container Docker
echo "🛑 Fermando tutti i servizi Docker..."

# Ferma e rimuove tutti i container
docker-compose down

# Opzionale: rimuovi anche i volumi (decommentare se necessario)
# docker-compose down -v

echo "✅ Tutti i servizi sono stati fermati!"
