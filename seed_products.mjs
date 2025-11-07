// seed_products.mjs
// Script para poblar la base de datos con categorías y productos de ejemplo
//
// Para ejecutar:
//    npm run seed
// O directamente:
//    node seed_products.mjs
//
// IMPORTANTE: Antes de ejecutar, configura tus credenciales de admin:
//    - ADMIN_EMAIL: Tu email de usuario admin
//    - ADMIN_PASSWORD: Tu contraseña de admin
//
// Este script:
// 1. Hace login para obtener token JWT
// 2. Elimina productos y categorías existentes (opcional)
// 3. Crea 6 categorías
// 4. Crea 18 productos (3 por categoría)

import fetch from 'node-fetch';

const API = 'http://localhost:3000/api';

// Configuración - Ajusta estos valores según tus necesidades
const ADMIN_EMAIL = 'admin@example.com'; // Cambia por tu email de admin
const ADMIN_PASSWORD = 'admin123'; // Cambia por tu password de admin

const categoriesData = [
  {
    name: 'Lámparas de Sal',
    categoryImage: 'https://picsum.photos/seed/Lamparas/400/300',
  },
  { name: 'Velas', categoryImage: 'https://picsum.photos/seed/Velas/400/300' },
  {
    name: 'Inciensos',
    categoryImage: 'https://picsum.photos/seed/Inciensos/400/300',
  },
  {
    name: 'Difusores',
    categoryImage: 'https://picsum.photos/seed/Difusores/400/300',
  },
  {
    name: 'Cristales',
    categoryImage: 'https://picsum.photos/seed/Cristales/400/300',
  },
  {
    name: 'Sahumerios',
    categoryImage: 'https://picsum.photos/seed/Sahumerios/400/300',
  },
];

const productsPerCategory = [
  [
    {
      name: 'CLASSWING',
      description: 'Lámpara CLASSWING',
      color: 'Blanco',
      price: 20,
      stock: 100,
      imgs: ['https://picsum.photos/200/200?random=1'],
      onSale: false,
      available: true,
      size: 'Chica',
    },
    {
      name: 'MOONLIGHT',
      description: 'Lámpara MOONLIGHT',
      color: 'Rosado',
      price: 25,
      stock: 80,
      imgs: ['https://picsum.photos/200/200?random=2'],
      onSale: true,
      priceOnSale: 20,
      available: true,
      size: 'Mediana',
    },
    {
      name: 'ZENLIGHT',
      description: 'Lámpara ZENLIGHT',
      color: 'Naranja',
      price: 30,
      stock: 60,
      imgs: ['https://picsum.photos/200/200?random=3'],
      onSale: false,
      available: true,
      size: 'Grande',
    },
  ],
  [
    {
      name: 'VELA AROMA',
      description: 'Vela aromática',
      color: 'Blanco',
      price: 10,
      stock: 100,
      imgs: ['https://picsum.photos/200/200?random=4'],
      onSale: false,
      available: true,
      size: 'Chica',
    },
    {
      name: 'VELA RELAX',
      description: 'Vela relajante',
      color: 'Morado',
      price: 12,
      stock: 80,
      imgs: ['https://picsum.photos/200/200?random=5'],
      onSale: true,
      priceOnSale: 8,
      available: true,
      size: 'Mediana',
    },
    {
      name: 'VELA SPA',
      description: 'Vela tipo SPA',
      color: 'Verde',
      price: 15,
      stock: 60,
      imgs: ['https://picsum.photos/200/200?random=6'],
      onSale: false,
      available: true,
      size: 'Grande',
    },
  ],
  [
    {
      name: 'Incienso Sándalo',
      description: 'Varilla con aroma a sándalo',
      color: 'Marrón',
      price: 5,
      stock: 100,
      imgs: ['https://picsum.photos/200/200?random=7'],
      onSale: false,
      available: true,
      size: 'Chica',
    },
    {
      name: 'Incienso Lavanda',
      description: 'Varilla con aroma a lavanda',
      color: 'Morado',
      price: 6,
      stock: 80,
      imgs: ['https://picsum.photos/200/200?random=8'],
      onSale: true,
      priceOnSale: 4,
      available: true,
      size: 'Mediana',
    },
    {
      name: 'Incienso Rosa',
      description: 'Varilla con aroma a rosas',
      color: 'Rosa',
      price: 7,
      stock: 70,
      imgs: ['https://picsum.photos/200/200?random=9'],
      onSale: false,
      available: true,
      size: 'Grande',
    },
  ],
  [
    {
      name: 'Difusor Agua',
      description: 'Difusor tipo agua',
      color: 'Blanco',
      price: 18,
      stock: 100,
      imgs: ['https://picsum.photos/200/200?random=10'],
      onSale: false,
      available: true,
      size: 'Chica',
    },
    {
      name: 'Difusor Zen',
      description: 'Difusor Zen',
      color: 'Madera',
      price: 22,
      stock: 80,
      imgs: ['https://picsum.photos/200/200?random=11'],
      onSale: true,
      priceOnSale: 18,
      available: true,
      size: 'Mediana',
    },
    {
      name: 'Difusor Spa',
      description: 'Difusor SPA',
      color: 'Negro',
      price: 25,
      stock: 60,
      imgs: ['https://picsum.photos/200/200?random=12'],
      onSale: false,
      available: true,
      size: 'Grande',
    },
  ],
  [
    {
      name: 'Cristal Cuarzo',
      description: 'Cristal de cuarzo',
      color: 'Transparente',
      price: 12,
      stock: 100,
      imgs: ['https://picsum.photos/200/200?random=13'],
      onSale: false,
      available: true,
      size: 'Chica',
    },
    {
      name: 'Cristal Amatista',
      description: 'Cristal de amatista',
      color: 'Morado',
      price: 14,
      stock: 80,
      imgs: ['https://picsum.photos/200/200?random=14'],
      onSale: true,
      priceOnSale: 10,
      available: true,
      size: 'Mediana',
    },
    {
      name: 'Cristal Citrino',
      description: 'Cristal de citrino',
      color: 'Amarillo',
      price: 16,
      stock: 60,
      imgs: ['https://picsum.photos/200/200?random=15'],
      onSale: false,
      available: true,
      size: 'Grande',
    },
  ],
  [
    {
      name: 'Sahumerio Palo Santo',
      description: 'Palo Santo',
      color: 'Marrón',
      price: 8,
      stock: 100,
      imgs: ['https://picsum.photos/200/200?random=16'],
      onSale: false,
      available: true,
      size: 'Chica',
    },
    {
      name: 'Sahumerio Lavanda',
      description: 'Lavanda',
      color: 'Morado',
      price: 9,
      stock: 80,
      imgs: ['https://picsum.photos/200/200?random=17'],
      onSale: true,
      priceOnSale: 6,
      available: true,
      size: 'Mediana',
    },
    {
      name: 'Sahumerio Rosa',
      description: 'Rosa',
      color: 'Rosa',
      price: 10,
      stock: 60,
      imgs: ['https://picsum.photos/200/200?random=18'],
      onSale: false,
      available: true,
      size: 'Grande',
    },
  ],
];

// Función para hacer login y obtener token
async function login() {
  try {
    console.log('🔐 Iniciando sesión...');
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error en login: ${response.status} - ${error}`);
    }

    const data = await response.json();
    if (!data.accessToken) {
      throw new Error('No se recibió token de acceso');
    }

    console.log('✅ Login exitoso');
    return data.accessToken;
  } catch (err) {
    console.error('❌ Error al hacer login:', err.message);
    throw err;
  }
}

// Función para obtener todos los productos y eliminarlos
async function deleteAllProducts(token) {
  try {
    console.log('📦 Obteniendo productos existentes...');
    const response = await fetch(`${API}/products`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.log('⚠️  No se pudieron obtener productos (puede estar vacío)');
      return;
    }

    const products = await response.json();
    console.log(`🗑️  Eliminando ${products.length} productos...`);

    for (const product of products) {
      const deleteResponse = await fetch(`${API}/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!deleteResponse.ok) {
        console.warn(`⚠️  No se pudo eliminar producto ${product.id}`);
      }
    }

    console.log('✅ Productos eliminados');
  } catch (err) {
    console.error('❌ Error al eliminar productos:', err.message);
  }
}

// Función para obtener todas las categorías y eliminarlas
async function deleteAllCategories(token) {
  try {
    console.log('📁 Obteniendo categorías existentes...');
    const response = await fetch(`${API}/categories`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.log('⚠️  No se pudieron obtener categorías (puede estar vacío)');
      return;
    }

    const categories = await response.json();
    console.log(`🗑️  Eliminando ${categories.length} categorías...`);

    // Eliminar en orden inverso para evitar conflictos con productos
    for (let i = categories.length - 1; i >= 0; i--) {
      const category = categories[i];
      const deleteResponse = await fetch(`${API}/categories/${category.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.warn(`⚠️  No se pudo eliminar categoría ${category.id}: ${errorText}`);
      }
    }

    console.log('✅ Categorías eliminadas');
  } catch (err) {
    console.error('❌ Error al eliminar categorías:', err.message);
  }
}

async function seed() {
  try {
    console.log('🌱 Iniciando seed de productos...\n');

    // 1. LOGIN
    const token = await login();
    if (!token) {
      throw new Error('No se obtuvo token de autenticación');
    }

    // 2. BORRAR TODO (opcional - comenta estas líneas si no quieres borrar)
    console.log('\n🗑️  Limpiando datos existentes...');
    await deleteAllProducts(token);
    await deleteAllCategories(token);

    // 3. CREAR CATEGORÍAS
    console.log('\n📁 Creando categorías...');
    const categoryIds = [];
    for (let cat of categoriesData) {
      const res = await fetch(`${API}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cat),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al crear categoría ${cat.name}: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      categoryIds.push(data.id);
      console.log(`  ✅ Categoría creada: ${cat.name} (${data.id})`);
    }
    console.log(`\n✅ ${categoryIds.length} categorías creadas`);

    // 4. CREAR PRODUCTOS
    console.log('\n📦 Creando productos...');
    let productCount = 0;
    for (let i = 0; i < categoryIds.length; i++) {
      const catId = categoryIds[i];
      const productsForCat = productsPerCategory[i];

      for (let p of productsForCat) {
        const res = await fetch(`${API}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...p, categoryId: catId }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.warn(`  ⚠️  Error al crear producto ${p.name}: ${errorText}`);
          continue;
        }

        const data = await res.json();
        productCount++;
        console.log(`  ✅ Producto creado: ${p.name} (${data.id})`);
      }
    }
    console.log(`\n✅ ${productCount} productos creados`);

    console.log('\n🎉 Seed completado exitosamente!');
  } catch (err) {
    console.error('\n❌ Error en seed:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

seed();
