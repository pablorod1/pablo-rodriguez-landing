---
mode: agent
tools: ['changes', 'codebase', 'editFiles', 'extensions', 'fetch', 'findTestFiles', 'githubRepo', 'new', 'openSimpleBrowser', 'problems', 'runCommands', 'runNotebooks', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'usages', 'vscodeAPI', 'playwright', 'context7', 'configureNotebook', 'installNotebookPackages', 'listNotebookPackages', 'console-ninja_runtimeErrors', 'console-ninja_runtimeLogs', 'console-ninja_runtimeLogsAndErrors', 'console-ninja_runtimeLogsByLocation']
---
# Refactorización y Optimización de Componente Dynamic Island - Astro + React

## Contexto del Proyecto
- **Framework**: Astro con Bun como runtime
- **UI Library**: React (componentes .tsx)
- **Objetivo**: Optimizar rendimiento web del componente Dynamic Island
- **Requisito crítico**: Mantener 100% de funcionalidades existentes

## Tarea Principal
Refactoriza el componente Dynamic Island (.tsx) aplicando las mejores prácticas de optimización de rendimiento para React en Astro, sin perder ninguna funcionalidad actual.

## Análisis Inicial Requerido
1. Examina el archivo `package.json` para identificar dependencias disponibles
2. Analiza el componente Dynamic Island actual para entender:
   - Estados y props utilizados
   - Efectos y ciclo de vida
   - Animaciones y transiciones
   - Eventos y handlers
   - Renderizado condicional

## Optimizaciones a Implementar

### Performance React
- [ ] Implementar `React.memo()` si es apropiado
- [ ] Usar `useMemo()` y `useCallback()` para cálculos costosos y funciones
- [ ] Optimizar re-renders innecesarios
- [ ] Lazy loading de componentes pesados con `React.lazy()`
- [ ] Implementar `useTransition()` para actualizaciones no urgentes

### Optimizaciones Web Core
- [ ] Minimizar manipulaciones DOM directas
- [ ] Optimizar animaciones CSS vs JavaScript
- [ ] Implementar `will-change` CSS para animaciones
- [ ] Usar `transform` y `opacity` para animaciones performantes
- [ ] Considerar `content-visibility` para elementos fuera de viewport

### Astro-Specific Optimizations
- [ ] Verificar directivas de hidratación apropiadas (`client:*`)
- [ ] Minimizar JavaScript enviado al cliente
- [ ] Usar `client:visible` o `client:idle` si es posible
- [ ] Considerar Server-Side Rendering para partes estáticas

### Bundle Optimization
- [ ] Tree-shaking de dependencias no utilizadas
- [ ] Splitear código si el componente es grande
- [ ] Optimizar imports (usar imports específicos vs default)

## Estructura de Respuesta Esperada

```
1. ANÁLISIS INICIAL
   - Dependencias identificadas en package.json
   - Problemas de rendimiento detectados
   - Oportunidades de optimización

2. CÓDIGO REFACTORIZADO
   - Componente optimizado con comentarios explicativos
   - Cambios específicos realizados
   - Razón técnica de cada optimización

3. MEDIDAS DE RENDIMIENTO
   - Métricas esperadas de mejora
   - Puntos de monitoreo sugeridos
   - Testing recommendations

4. CONSIDERACIONES ADICIONALES
   - Posibles trade-offs
   - Compatibilidad mantenida
   - Próximos pasos de optimización
```

## Restricciones
- **NO** cambiar la API pública del componente
- **NO** remover funcionalidades existentes
- **MANTENER** compatibilidad con el stack actual
- **PRIORIZAR** optimizaciones que impacten Core Web Vitals

## Archivos a Analizar
Por favor, examina estos archivos en orden:
1. `package.json` - Para entender dependencias disponibles
2. El componente Dynamic Island actual (.tsx)
3. Archivos de estilos relacionados
4. Configuración de Astro si es relevante

## Opcional
Utilizar el MCP Server Playwright para validar el resultado final.

Procede paso a paso, explicando cada decisión de optimización y su impacto esperado en el rendimiento.