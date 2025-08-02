# Performance Testing Guide

## Testing the Optimized MetallicImage Component

### 1. Core Web Vitals Testing
```javascript
// Add to your page for monitoring
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('Performance metric:', entry.name, entry.value);
  });
});
observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
```

### 2. Component Loading Performance
```javascript
// Monitor component load time
const startTime = performance.now();
// When MetallicImage loads
const loadTime = performance.now() - startTime;
console.log('MetallicImage load time:', loadTime, 'ms');
```

### 3. Memory Usage Monitoring
```javascript
// Check memory usage after component mount
if (performance.memory) {
  console.log('Memory usage:', {
    used: performance.memory.usedJSHeapSize,
    total: performance.memory.totalJSHeapSize,
    limit: performance.memory.jsHeapSizeLimit
  });
}
```

### 4. WebGL Performance
```javascript
// Monitor render frame rate
let lastTime = 0;
let frameCount = 0;

function measureFPS(currentTime) {
  frameCount++;
  if (currentTime - lastTime >= 1000) {
    console.log('FPS:', frameCount);
    frameCount = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}
requestAnimationFrame(measureFPS);
```

### Expected Performance Improvements:
- **Load Time**: 40-60% reduction due to lazy loading and code splitting
- **Memory Usage**: 30-50% reduction due to optimized caching
- **FPS Stability**: Consistent 60fps due to throttled render loop
- **Bundle Size**: Component split into smaller chunks for better caching
