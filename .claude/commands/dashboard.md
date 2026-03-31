Generá un DASHBOARD VISUAL completo del estado de este proyecto.

Ejecutá estos análisis en PARALELO (usa subagents cuando sea posible):

1. Chequeá .claude/VERSION, skills, agents, commands, hooks
2. Corré python3 evaluator_v2.py . si existe
3. Contá archivos por tipo, líneas de código, tests
4. Chequeá git status, último commit, branches
5. Listá contenido de knowledge/ (patterns, failures, decisions, research)
6. Chequeá dependencias (package.json, requirements.txt, etc.)

Después mostrá el dashboard con este formato EXACTO (usá emojis):

```
═══════════════════════════════════════════════════════
  📊 DASHBOARD — [nombre del proyecto]
  📅 [fecha hoy]  |  Framework: [versión]
═══════════════════════════════════════════════════════
```

## 🏗️ ESTADO GENERAL
Tabla con: Framework version, Score (con barra visual), Stack detectado, Git status, Tests status.

## ✅ FORTALEZAS (lo que tenemos)
Tabla con cada componente: CLAUDE.md, CURRENT_TASK.md, Skills (X/9), Agents (X/6), Commands (X/8), Hooks, Knowledge, Evaluador, Tests, CI/CD.
Cada uno con ✅/⚠️/❌ y detalle.

## ❌ DEBILIDADES (lo que falta)
Tabla con: # | Qué falta | Impacto (🔴🟡🟢) | Esfuerzo (⏱️ Xmin) | Prioridad (P1/P2/P3)
Ordenado por prioridad.

## ⏱️ ESTIMACIÓN DE TIEMPO
Box visual con:
- Tiempo total para 100%
- Desglose por prioridad con barras
- Quick wins (acciones < 2 min)

## 📈 PROGRESO DE AUTO-MEJORA
Box con: iteraciones de /evolve, patterns, failures, decisions, instincts, última investigación, tendencia.

## 🗂️ MAPA DE ARCHIVOS
Tree visual del proyecto con conteo de archivos y líneas.

## 🎯 RECOMENDACIÓN
1 párrafo concreto: qué hacer AHORA para máximo impacto.

## 🚀 COMANDOS RÁPIDOS
Tabla de referencia: /init, /fw-update, /diagnose, /improve, /verify, /research, /evolve, /security, /dashboard
