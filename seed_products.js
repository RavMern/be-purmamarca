// seed_products.js
import fetch from 'node-fetch';

const API = 'http://localhost:3000/api';

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

async function seed() {
  try {
    // BORRAR TODO
    console.log('Borrando productos y categorías existentes...');
    await fetch(`${API}/products`, { method: 'DELETE' });
    await fetch(`${API}/categories`, { method: 'DELETE' });

    // CREAR CATEGORÍAS
    console.log('Creando categorías...');
    const categoryIds = [];
    for (let cat of categoriesData) {
      const res = await fetch(`${API}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(cat),
      });
      const data = await res.json();
      categoryIds.push(data.id);
    }
    console.log('Categorías creadas:', categoryIds);

    // CREAR PRODUCTOS
    console.log('Creando productos...');
    for (let i = 0; i < categoryIds.length; i++) {
      const catId = categoryIds[i];
      const productsForCat = productsPerCategory[i];
      for (let p of productsForCat) {
        await fetch(`${API}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          body: JSON.stringify({ ...p, categoryId: catId }),
        });
      }
    }
    console.log('Seed completado!');
  } catch (err) {
    console.error('Error en seed:', err);
  }
}

seed();
