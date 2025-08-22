#!/bin/bash

# Script semplice per avviare tutto con Docker Compose
echo "🐳 Avvio dell'applicazione con Docker Compose..."

# Ferma eventuali container in esecuzione
echo "Fermando eventuali container esistenti..."
docker-compose down

# Avvia tutti i servizi
echo "Avviando tutti i servizi..."
docker-compose up --build

echo "✅ Applicazione avviata!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:3001"
echo "Nginx: http://localhost:80"
echo ""
echo "Premi Ctrl+C per fermare tutti i servizi"
