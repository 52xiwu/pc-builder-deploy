#!/bin/bash
# Health check script for www.aixiwu.cn
# Cron: */10 * * * * /tmp/pc-builder/scripts/health-check.sh >> /tmp/pc-builder/logs/health-check.log 2>&1

LOG="/tmp/pc-builder/logs/health-check.log"
SITE="https://www.aixiwu.cn"
API="https://www.aixiwu.cn/api/hardware/cpu"
FAIL_COUNT=0
MAX_FAILS=3

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG"; }

# Check API
HTTP_CODE=$(curl -fsS -o /dev/null -w "%{http_code}" "$API" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    log "API OK (200)"
    FAIL_COUNT=0
else
    log "API FAIL (HTTP $HTTP_CODE)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    if [ "$FAIL_COUNT" -ge "$MAX_FAILS" ]; then
        log "连续${MAX_FAILS}次失败 — 重启后端..."
        fuser -k 3000/tcp 2>/dev/null
        sleep 2
        cd /tmp/pc-builder && PORT=3000 node server.js >> /tmp/pc-builder/logs/server.log 2>&1 &
        sleep 5
        NEW_CODE=$(curl -fsS -o /dev/null -w "%{http_code}" "$API" 2>/dev/null || echo "000")
        log "重启后: HTTP $NEW_CODE"
        FAIL_COUNT=0
    fi
fi

# Check frontend
FRONT_CODE=$(curl -fsS -o /dev/null -w "%{http_code}" "$SITE" 2>/dev/null || echo "000")
if [ "$FRONT_CODE" = "200" ]; then
    log "Frontend OK (200)"
else
    log "Frontend FAIL (HTTP $FRONT_CODE)"
fi
