# SCBL Meliora

---
# Convención de Commits

## Categorías de cambios generales
- **feat**: Nueva funcionalidad en el cliente
- **fix**: Corrección de errores en la UI o lógica del front-end
- **refactor**: Reestructuración de código sin cambios funcionales
- **perf**: Mejoras de rendimiento en el cliente (optimizaciones de carga, renderizado, etc.)
- **style**: Cambios visuales o formateo de código sin afectar la funcionalidad
- **docs**: Cambios en la documentación del front-end
- **chore**: Tareas administrativas o de configuración (actualización de paquetes, configuración de herramientas, etc.)
- **revert**: Revertir un commit anterior
- **merge**: Fusiones de ramas o resolución de conflictos
- **other**: Cualquier otro cambio que no encaje en las categorías anteriores
- 
## Categorías de cambios específicos
- **ui**: Cambios en la interfaz de usuario (HTML/CSS/JSX)
- **ux**: Mejoras en la experiencia de usuario
- **state**: Cambios en la gestión del estado global o local (Redux, Context API, Zustand, etc.)
- **api**: Cambios en las llamadas a la API y su integración en el cliente
- **assets**: Modificaciones en imágenes, íconos, fuentes u otros recursos
- **routing**: Cambios en la navegación o en las rutas del sistema
- **deps**: Cambios en dependencias del front-end (instalación, eliminación o actualización de librerías)
- **security**: Mejoras en seguridad (protección contra XSS, CSRF, etc.)
### Referencia a tareas
Para hacer referencia a una tarea o incidencia, usa el siguiente formato:
```scss
[Ref: IDTarea]
```

## Ejemplos
- **feat:** Implementación de sidebar de navegación [Ref: NAV_SIDEBAR]
- **fix:** Corrección de bug en la carga de imágenes [Ref: IMG_LOAD]
- **ui:** Mejora en el diseño del modal de login [Ref: LOGIN_MODAL]
- **api:** Actualización de endpoints para usuarios [Ref: API_USERS]
- **routing:** Corrección en la navegación entre páginas [Ref: ROUTE_FIX]
