# Configuración de .env para Supabase

## Opción 1: Conexión Directa (Funciona inmediatamente)

```env
# Línea 7-8: DB_URL con conexión directa
DB_URL=postgresql://postgres:TU_PASSWORD@db.qsflnydidxofxtfscioc.supabase.co:5432/postgres

# Línea 13-14: Activar conexión directa
SUPABASE_USE_DIRECT=true
```

## Opción 2: Pooler (Requiere URL correcta del Dashboard)

```env
# Línea 7-8: DB_URL con conexión directa (se usa para extraer proyecto ref)
DB_URL=postgresql://postgres:TU_PASSWORD@db.qsflnydidxofxtfscioc.supabase.co:5432/postgres

# Línea 13-14: URL del pooler desde Supabase Dashboard
# ⚠️ IMPORTANTE: Reemplaza "us-east-1" con TU región real del Dashboard
SUPABASE_POOLER_URL=aws-0-us-east-1.pooler.supabase.com:6543
```

## Opción 3: DB_URL con Pooler (Todo en uno)

```env
# Línea 7-8: DB_URL con connection string completa del pooler desde Dashboard
DB_URL=postgresql://postgres.qsflnydidxofxtfscioc:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# NO necesitas SUPABASE_POOLER_URL ni SUPABASE_USE_DIRECT
```

## ❌ Error común

Si ves `aws-0-REGION.pooler.supabase.com`, significa que dejaste "REGION" como texto literal.
Debes reemplazarlo con tu región real, por ejemplo:
- `aws-0-us-east-1`
- `aws-0-us-east-2`
- `aws-0-us-west-1`
- `aws-0-eu-west-1`
- etc.

## 🔍 Cómo encontrar tu región

1. Ve a Supabase Dashboard
2. Settings → Database → Connection Pooling
3. Selecciona "Session pooler"
4. Copia la connection string completa
5. El hostname tendrá tu región, ejemplo: `aws-0-us-east-1.pooler.supabase.com`
