# ----------------------
# 1. Build stage
# ----------------------
FROM node:20-alpine AS build
WORKDIR /app

# Csomagfájlokat másoljuk először (cache miatt)
COPY package*.json ./

# Production buildhez inkább clean install
RUN npm ci

# Másoljuk a teljes forrást és buildeljük
COPY . .
RUN npm run build

# ----------------------
# 2. Run stage
# ----------------------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Alapértelmezett statikus fájlokat töröljük
RUN rm -rf ./*

# Buildelt fájlok bemásolása
COPY --from=build /app/build .

# Port 80-on szolgáljuk ki
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
