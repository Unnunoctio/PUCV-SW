# Usamos la imagen oficial de Bun
FROM oven/bun:1.1.14-slim

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y bun.lockb (si existe)
COPY package.json bun.lockb* ./

# Instalamos las dependencias
RUN bun install --frozen-lockfile --production

# Copiamos el resto del código de la aplicación
COPY . .

# Ejecutamos la aplicación
CMD ["bun", "src/index.ts"]