# ─── Stage 1: Servir archivos estáticos ─────────────────────────────────────
# Los archivos ya fueron compilados en el runner de GitHub Actions
FROM nginx:1.25-alpine

COPY out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
