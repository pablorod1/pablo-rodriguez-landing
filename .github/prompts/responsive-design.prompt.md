---
mode: agent
tools: ['changes', 'codebase', 'editFiles', 'extensions', 'fetch', 'findTestFiles', 'githubRepo', 'new', 'openSimpleBrowser', 'problems', 'runCommands', 'runNotebooks', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure', 'usages', 'vscodeAPI', 'context7', 'playwright', 'configureNotebook', 'installNotebookPackages', 'listNotebookPackages', 'console-ninja_runtimeErrors', 'console-ninja_runtimeLogs', 'console-ninja_runtimeLogsAndErrors', 'console-ninja_runtimeLogsByLocation']
---
# Optimización Responsive Completa - Sección y Componentes Anidados

## Contexto del Proyecto
- **Framework**: Astro con Bun
- **UI Library**: React (.tsx components)
- **Objetivo**: Hacer completamente responsive una sección específica
- **Alcance**: Sección principal + todos los componentes anidados

## Componente a Analizar
[CONTEXTO: El usuario proporcionará el componente de la sección a optimizar]

## Tarea Principal
Transforma la sección proporcionada y todos sus componentes internos en un diseño completamente responsive que funcione perfectamente en todos los dispositivos y tamaños de pantalla.

## Análisis Inicial Requerido

### 1. Auditoría de Responsive Actual
- [ ] Identificar breakpoints actuales y faltantes
- [ ] Detectar elementos que no escalan correctamente
- [ ] Encontrar problemas de overflow horizontal
- [ ] Analizar espaciado inconsistente entre dispositivos
- [ ] Revisar tipografía y legibilidad en móviles

### 2. Inventario de Componentes
- [ ] Mapear todos los componentes anidados en la sección
- [ ] Identificar patrones de layout utilizados
- [ ] Detectar componentes que necesitan variantes móviles
- [ ] Analizar interacciones touch vs desktop

## Estrategia de Responsive Design

### Breakpoints Estándar a Implementar
```css
/* Mobile First Approach */
sm: 640px   /* Teléfonos grandes */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Pantallas grandes */
```

### Técnicas de Optimización

#### Layout Responsive
- [ ] **CSS Grid**: Para layouts complejos de 2D
- [ ] **Flexbox**: Para alineación y distribución 1D
- [ ] **Container Queries**: Para componentes adaptativos
- [ ] **Aspect Ratio**: Para mantener proporciones
- [ ] **Clamp()**: Para valores fluidos (font-size, spacing, width)

#### Componentes Adaptativos
- [ ] **Navegación**: Hamburger menu en móvil, horizontal en desktop
- [ ] **Cards/Grids**: Stack en móvil, grid en desktop
- [ ] **Imágenes**: Responsive images con srcset
- [ ] **Formularios**: Stack labels en móvil, inline en desktop
- [ ] **Tablas**: Scroll horizontal o stack en móvil

#### Espaciado y Tipografía
- [ ] **Fluid Typography**: clamp() para tamaños de fuente
- [ ] **Espaciado Consistente**: Sistema de spacing responsivo
- [ ] **Line Height**: Ajustar según tamaño de pantalla
- [ ] **Touch Targets**: Mínimo 44px en móvil

## Estructura de Implementación

### 1. Análisis y Planificación
```
ANÁLISIS INICIAL:
- Problemas responsive identificados
- Componentes que requieren atención
- Breakpoints necesarios
- Estrategia de mobile-first vs desktop-first

PLAN DE ACCIÓN:
- Orden de optimización de componentes
- Técnicas CSS a implementar
- Posibles refactorizaciones de estructura
```

### 2. Código Optimizado
```
SECCIÓN PRINCIPAL:
- Layout responsive principal
- Container queries si aplicables
- Grid/Flexbox optimizado

COMPONENTES ANIDADOS:
- Cada componente con su optimización
- Props responsivos si son necesarios
- Variantes móvil/desktop

ESTILOS CSS:
- Mobile-first media queries
- Fluid values con clamp()
- Touch-friendly interactions
```

### 3. Testing y Validación
```
PUNTOS DE PRUEBA:
- Todos los breakpoints definidos
- Orientación portrait/landscape 
- Interacciones touch vs mouse
- Performance en dispositivos móviles
- Accesibilidad responsive
```

## Mejores Prácticas a Implementar

### CSS Moderno
- [ ] Usar `dvh/dvw` para viewport dinámico
- [ ] Implementar `container-type: inline-size`
- [ ] Utilizar `aspect-ratio` para proporciones
- [ ] Aplicar `scrollbar-gutter: stable`

### Performance Responsive
- [ ] Lazy loading para imágenes
- [ ] Optimizar Critical CSS para móvil
- [ ] Minimizar layout shifts
- [ ] Usar `content-visibility` para off-screen content

### Accesibilidad
- [ ] Tamaños mínimos de touch targets (44px)
- [ ] Contraste adecuado en todos los tamaños
- [ ] Navegación por teclado en todos los dispositivos
- [ ] Screen reader friendly en móvil

## Consideraciones Específicas

### Astro + React
- [ ] Hidratación responsive (`client:media`)
- [ ] SSR considerations para diferentes viewports
- [ ] Componente islands optimizados por dispositivo

### Interacciones
- [ ] Hover states solo en dispositivos con hover
- [ ] Touch gestures en móvil
- [ ] Keyboard navigation mejorada
- [ ] Focus management responsive

## Entregables Esperados

### 1. Componente Principal Optimizado
- Sección completamente responsive
- Layout adaptativo con CSS moderno
- Breakpoints bien definidos

### 2. Componentes Anidados Actualizados
- Cada componente hijo optimizado individualmente
- Consistencia visual entre breakpoints
- Props responsive si son necesarios

### 3. Documentación de Cambios
- Lista de modificaciones realizadas
- Breakpoints implementados
- Patrones responsive utilizados
- Consideraciones de performance

### 4. Testing Checklist
- Dispositivos/resoluciones probadas
- Orientaciones validadas
- Interacciones verificadas
- Utiliza el MCP Server Playwright para pruebas de responsividad

## Restricciones
- **MANTENER** toda la funcionalidad existente
- **NO** cambiar la API de componentes externos
- **PRIORIZAR** mobile-first approach
- **OPTIMIZAR** para Core Web Vitals
- **ASEGURAR** accesibilidad en todos los tamaños

## Formato de Respuesta
Por favor, estructura tu respuesta así:

1. **ANÁLISIS RESPONSIVE ACTUAL**
2. **ESTRATEGIA DE OPTIMIZACIÓN**  
3. **CÓDIGO REFACTORIZADO** (sección + componentes)
4. **MEJORAS IMPLEMENTADAS**
5. **TESTING RECOMMENDATIONS**
6. **NEXT STEPS**


---
**Importante**: Analiza primero el componente proporcionado, identifica todos los elementos anidados, y luego procede con la optimización sistemática de cada parte.