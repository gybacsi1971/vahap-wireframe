#!/bin/bash

# VAHAP Backend Restart Script
# Használat: ./restart.sh [start|stop|restart]

# Színek a konzol outputhoz
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend port (vihar-api-config.js alapján)
BACKEND_PORT=3000

# PID fájl helye
PID_FILE="backend/.backend.pid"

# Függvény: Backend leállítása
stop_backend() {
    echo -e "${YELLOW}Backend leállítása...${NC}"

    # PID fájl alapú leállítás
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${YELLOW}Backend leállítása (PID: $PID)...${NC}"
            kill $PID
            sleep 2

            # Ha még mindig fut, erőszakos leállítás
            if ps -p $PID > /dev/null 2>&1; then
                echo -e "${RED}Erőszakos leállítás...${NC}"
                kill -9 $PID
            fi

            rm -f "$PID_FILE"
            echo -e "${GREEN}Backend leállítva.${NC}"
        else
            echo -e "${YELLOW}Backend nem fut (PID fájl elavult).${NC}"
            rm -f "$PID_FILE"
        fi
    else
        # Port alapú leállítás (ha nincs PID fájl)
        PORT_PID=$(lsof -ti:$BACKEND_PORT)
        if [ ! -z "$PORT_PID" ]; then
            echo -e "${YELLOW}Backend leállítása port $BACKEND_PORT alapján (PID: $PORT_PID)...${NC}"
            kill $PORT_PID
            sleep 2

            # Ellenőrzés
            PORT_PID=$(lsof -ti:$BACKEND_PORT)
            if [ ! -z "$PORT_PID" ]; then
                echo -e "${RED}Erőszakos leállítás...${NC}"
                kill -9 $PORT_PID
            fi

            echo -e "${GREEN}Backend leállítva.${NC}"
        else
            echo -e "${YELLOW}Backend nem fut a $BACKEND_PORT porton.${NC}"
        fi
    fi
}

# Függvény: Backend indítása
start_backend() {
    echo -e "${YELLOW}Backend indítása...${NC}"

    # Ellenőrzés: fut-e már
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${RED}Backend már fut (PID: $PID)!${NC}"
            echo -e "${YELLOW}Használd a 'restart' paramétert az újraindításhoz.${NC}"
            return 1
        fi
    fi

    # Port ellenőrzés
    PORT_PID=$(lsof -ti:$BACKEND_PORT)
    if [ ! -z "$PORT_PID" ]; then
        echo -e "${RED}A $BACKEND_PORT port már használatban van (PID: $PORT_PID)!${NC}"
        echo -e "${YELLOW}Leállítom a folyamatot...${NC}"
        kill $PORT_PID
        sleep 2
    fi

    # Backend mappa létezésének ellenőrzése
    if [ ! -d "backend" ]; then
        echo -e "${RED}Hiba: backend/ mappa nem található!${NC}"
        return 1
    fi

    # Node.js ellenőrzés
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Hiba: Node.js nincs telepítve!${NC}"
        return 1
    fi

    # server.js ellenőrzés
    if [ ! -f "backend/server.js" ]; then
        echo -e "${RED}Hiba: backend/server.js nem található!${NC}"
        return 1
    fi

    # Backend indítása háttérben
    cd backend
    nohup node server.js > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..

    # PID mentése
    echo $BACKEND_PID > "$PID_FILE"

    # Várakozás az indulásra
    sleep 2

    # Ellenőrzés
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${GREEN}Backend sikeresen elindítva!${NC}"
        echo -e "${GREEN}PID: $BACKEND_PID${NC}"
        echo -e "${GREEN}Port: $BACKEND_PORT${NC}"
        echo -e "${GREEN}Log fájl: backend.log${NC}"
        echo ""
        echo -e "${YELLOW}Backend állapot ellenőrzése:${NC}"
        echo "  ps -p $BACKEND_PID"
        echo ""
        echo -e "${YELLOW}Backend leállítása:${NC}"
        echo "  ./restart.sh stop"
    else
        echo -e "${RED}Hiba: Backend nem indult el!${NC}"
        echo -e "${YELLOW}Ellenőrizd a backend.log fájlt:${NC}"
        echo "  tail -f backend.log"
        rm -f "$PID_FILE"
        return 1
    fi
}

# Függvény: Backend újraindítása
restart_backend() {
    echo -e "${YELLOW}Backend újraindítása...${NC}"
    stop_backend
    sleep 1
    start_backend
}

# Függvény: Backend státusz
status_backend() {
    echo -e "${YELLOW}Backend állapot:${NC}"
    echo ""

    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Backend FUT${NC}"
            echo "  PID: $PID"
            echo "  Port: $BACKEND_PORT"
            echo ""
            echo -e "${YELLOW}Folyamat részletek:${NC}"
            ps -p $PID -o pid,ppid,cmd,%mem,%cpu,etime
        else
            echo -e "${RED}✗ Backend NEM FUT (PID fájl elavult)${NC}"
            rm -f "$PID_FILE"
        fi
    else
        PORT_PID=$(lsof -ti:$BACKEND_PORT)
        if [ ! -z "$PORT_PID" ]; then
            echo -e "${YELLOW}⚠ Backend fut, de nincs PID fájl${NC}"
            echo "  Port PID: $PORT_PID"
            echo ""
            echo -e "${YELLOW}Folyamat részletek:${NC}"
            ps -p $PORT_PID -o pid,ppid,cmd,%mem,%cpu,etime
        else
            echo -e "${RED}✗ Backend NEM FUT${NC}"
        fi
    fi

    echo ""
    echo -e "${YELLOW}Port használat ($BACKEND_PORT):${NC}"
    lsof -i:$BACKEND_PORT || echo "  Nincs folyamat a porton"
}

# Súgó
show_help() {
    echo "VAHAP Backend Restart Script"
    echo ""
    echo "Használat:"
    echo "  ./restart.sh [parancs]"
    echo ""
    echo "Parancsok:"
    echo "  start    - Backend indítása"
    echo "  stop     - Backend leállítása"
    echo "  restart  - Backend újraindítása (alapértelmezett)"
    echo "  status   - Backend állapot lekérdezése"
    echo "  help     - Súgó megjelenítése"
    echo ""
    echo "Példák:"
    echo "  ./restart.sh              # Újraindítás"
    echo "  ./restart.sh start        # Csak indítás"
    echo "  ./restart.sh stop         # Csak leállítás"
    echo "  ./restart.sh status       # Állapot ellenőrzés"
}

# Főprogram
case "$1" in
    start)
        start_backend
        ;;
    stop)
        stop_backend
        ;;
    restart|"")
        restart_backend
        ;;
    status)
        status_backend
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Ismeretlen parancs: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac