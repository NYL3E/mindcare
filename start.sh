#!/bin/bash
# MindCare — Script de lancement
# Usage: ./start.sh

cd "$(dirname "$0")/app" || exit 1

# Tue tout ancien processus sur le port 3000
lsof -ti :3000 | xargs kill 2>/dev/null
sleep 1

echo ""
echo "  🧠 MindCare — Lancement..."
echo ""

# Lance le serveur de dev et ouvre le navigateur
npx next dev -p 3000 &
DEV_PID=$!

# Attend que le serveur soit prêt
for i in {1..30}; do
  if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    echo ""
    echo "  ✅ Serveur prêt !"
    echo "  🌐 Ouverture de http://localhost:3000"
    echo ""
    open "http://localhost:3000"
    break
  fi
  sleep 1
done

# Garde le script en vie tant que le serveur tourne
wait $DEV_PID
