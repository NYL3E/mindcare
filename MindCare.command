#!/bin/bash
# Double-cliquer sur ce fichier pour lancer MindCare

cd "$(dirname "$0")/app" || exit 1

# Tue uniquement les serveurs node qui écoutent sur le port 3000
lsof -i :3000 -sTCP:LISTEN -t 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Lance le serveur
npx next dev -p 3000 &

# Attend que le serveur soit prêt puis ouvre le navigateur
for i in {1..30}; do
  if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    open "http://localhost:3000"
    break
  fi
  sleep 1
done

wait
