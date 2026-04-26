# Feature Architecture

Estructura base del proyecto:

```txt
src/
  app/        # shell global, layout, providers, router plumbing
  routes/     # archivos de TanStack Router, sin logica de negocio
  features/   # modulos por dominio
  shared/     # UI reusable, hooks genericos, tipos, utilidades, infra compartida
```

Reglas de trabajo:

1. `src/routes` solo define rutas y conecta componentes de `features`.
2. `src/app` contiene layout global, sidebar, header y providers de aplicacion.
3. `src/features` agrupa la logica por dominio.
4. `src/shared` guarda piezas reutilizables que no pertenecen a una feature concreta.
5. Si un modulo solo lo usa una feature, se queda dentro de esa feature.
6. Si un modulo lo usan dos o mas features, se evalua moverlo a `shared`.

Convencion actual:

- `features/auth`: login, auth hooks y provider.
- `features/dashboard`: pantallas del dashboard.
- `features/reference-data`: hooks de catalogos como modalidades y facultades.
- `features/reports/<domain>/screens`: pantallas de reportes por area.
- `shared/ui`: componentes base reutilizables.
- `shared/lib`: firebase, seed y helpers compartidos.

Que evitar:

- meter logica de negocio en `routes`
- crear carpetas tecnicas nuevas como `pages`, `hooks` o `components` en la raiz de `src`
- compartir cosas por costumbre; primero pertenecen a una feature, luego se generalizan si hace falta
