const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function generateDetailedReport() {
  const report = [];
  
  const addSection = (title) => {
    report.push('\n' + '='.repeat(100));
    report.push(title);
    report.push('='.repeat(100) + '\n');
  };

  const addSubsection = (title) => {
    report.push('\n' + '-'.repeat(100));
    report.push(title);
    report.push('-'.repeat(100) + '\n');
  };

  try {
    addSection('📊 COMPREHENSIVE DATABASE REPORT');
    report.push(`Generated: ${new Date().toLocaleString()}\n`);

    // USERS DETAILED DATA
    addSection('👥 USERS - DETAILED DATA');
    const users = await prisma.user.findMany({
      include: {
        _count: { select: { orders: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (users.length === 0) {
      report.push('No users found in database.\n');
    } else {
      users.forEach((user, idx) => {
        report.push(`\nUser #${idx + 1}:`);
        report.push(`  ID: ${user.id}`);
        report.push(`  Email: ${user.email}`);
        report.push(`  Role: ${user.role}`);
        report.push(`  Orders Count: ${user._count.orders}`);
        report.push(`  Created: ${user.createdAt.toLocaleString()}`);
        report.push(`  Updated: ${user.updatedAt.toLocaleString()}`);
      });
    }

    // PRODUCTS DETAILED DATA
    addSection('📦 PRODUCTS - DETAILED DATA');
    const products = await prisma.product.findMany({
      include: {
        variations: true,
        attributes: true,
        sizes: true,
        _count: { select: { orderItems: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (products.length === 0) {
      report.push('No products found in database.\n');
    } else {
      products.forEach((product, idx) => {
        report.push(`\nProduct #${idx + 1}:`);
        report.push(`  ID: ${product.id}`);
        report.push(`  Name: ${product.name}`);
        report.push(`  Slug: ${product.slug}`);
        report.push(`  Category: ${product.category}`);
        report.push(`  Type: ${product.type || 'N/A'}`);
        report.push(`  Brand: ${product.brand || 'N/A'}`);
        report.push(`  Description: ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}`);
        report.push(`  Price: $${Number(product.price).toFixed(2)}`);
        report.push(`  Original Price: $${Number(product.originPrice).toFixed(2)}`);
        report.push(`  Discount: ${((Number(product.originPrice) - Number(product.price)) / Number(product.originPrice) * 100).toFixed(1)}%`);
        report.push(`  Rating: ${product.rate}/5`);
        report.push(`  Sold: ${product.sold}`);
        report.push(`  Stock Quantity: ${product.quantity}`);
        report.push(`  Is New: ${product.isNew}`);
        report.push(`  Is On Sale: ${product.isSale}`);
        report.push(`  Images: ${product.images.length} image(s)`);
        report.push(`  Thumb Images: ${product.thumbImages.length} image(s)`);
        report.push(`  Times Ordered: ${product._count.orderItems}`);
        report.push(`  Created: ${product.createdAt.toLocaleString()}`);
        report.push(`  Updated: ${product.updatedAt.toLocaleString()}`);

        if (product.variations.length > 0) {
          report.push(`  Variations (${product.variations.length}):`);
          product.variations.forEach((variation, vIdx) => {
            report.push(`    ${vIdx + 1}. Color: ${variation.color}${variation.colorCode ? ` (${variation.colorCode})` : ''}${variation.colorImage ? ' [has color image]' : ''}`);
          });
        }

        if (product.attributes) {
          report.push(`  Attributes:`);
          report.push(`    Lens Type: ${product.attributes.lensType || 'N/A'}`);
          report.push(`    Frame Material: ${product.attributes.frameMaterial || 'N/A'}`);
          report.push(`    Frame Size: ${product.attributes.frameSize ? JSON.stringify(product.attributes.frameSize) : 'N/A'}`);
          report.push(`    Lens Coating: ${product.attributes.lensCoating.length > 0 ? product.attributes.lensCoating.join(', ') : 'N/A'}`);
        }

        if (product.sizes.length > 0) {
          report.push(`  Sizes (${product.sizes.length}): ${product.sizes.map(s => s.size).join(', ')}`);
        }
      });
    }

    // PRODUCT VARIATIONS DETAILED DATA
    addSection('🎨 PRODUCT VARIATIONS - DETAILED DATA');
    const variations = await prisma.productVariation.findMany({
      include: {
        product: {
          select: { name: true, category: true }
        }
      },
      orderBy: { productId: 'asc' }
    });

    if (variations.length === 0) {
      report.push('No variations found in database.\n');
    } else {
      variations.forEach((variation, idx) => {
        report.push(`\nVariation #${idx + 1}:`);
        report.push(`  ID: ${variation.id}`);
        report.push(`  Product: ${variation.product.name} (${variation.product.category})`);
        report.push(`  Color: ${variation.color}`);
        report.push(`  Color Code: ${variation.colorCode || 'N/A'}`);
        report.push(`  Color Image: ${variation.colorImage || 'N/A'}`);
        report.push(`  Image: ${variation.image}`);
      });
    }

    // PRODUCT ATTRIBUTES DETAILED DATA
    addSection('🔧 PRODUCT ATTRIBUTES - DETAILED DATA');
    const attributes = await prisma.productAttribute.findMany({
      include: {
        product: {
          select: { name: true, category: true }
        }
      }
    });

    if (attributes.length === 0) {
      report.push('No attributes found in database.\n');
    } else {
      attributes.forEach((attr, idx) => {
        report.push(`\nAttribute #${idx + 1}:`);
        report.push(`  ID: ${attr.id}`);
        report.push(`  Product: ${attr.product.name} (${attr.product.category})`);
        report.push(`  Lens Type: ${attr.lensType || 'N/A'}`);
        report.push(`  Frame Material: ${attr.frameMaterial || 'N/A'}`);
        report.push(`  Frame Size: ${attr.frameSize ? JSON.stringify(attr.frameSize, null, 2) : 'N/A'}`);
        report.push(`  Lens Coating: ${attr.lensCoating.length > 0 ? attr.lensCoating.join(', ') : 'N/A'}`);
      });
    }

    // PRODUCT SIZES DETAILED DATA
    addSection('📏 PRODUCT SIZES - DETAILED DATA');
    const sizes = await prisma.productSize.findMany({
      include: {
        product: {
          select: { name: true, category: true }
        }
      },
      orderBy: { productId: 'asc' }
    });

    if (sizes.length === 0) {
      report.push('No sizes found in database.\n');
    } else {
      sizes.forEach((size, idx) => {
        report.push(`\nSize Entry #${idx + 1}:`);
        report.push(`  ID: ${size.id}`);
        report.push(`  Product: ${size.product.name} (${size.product.category})`);
        report.push(`  Size: ${size.size}`);
      });
    }

    // ORDERS DETAILED DATA
    addSection('🛒 ORDERS - DETAILED DATA');
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { email: true, role: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, category: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (orders.length === 0) {
      report.push('No orders found in database.\n');
    } else {
      orders.forEach((order, idx) => {
        report.push(`\nOrder #${idx + 1}:`);
        report.push(`  ID: ${order.id}`);
        report.push(`  User: ${order.user ? `${order.user.email} (${order.user.role})` : 'Guest'}`);
        report.push(`  Status: ${order.status}`);
        report.push(`  Total Amount: $${Number(order.totalAmount).toFixed(2)}`);
        report.push(`  Shipping Address: ${JSON.stringify(order.shippingAddress, null, 2)}`);
        report.push(`  Created: ${order.createdAt.toLocaleString()}`);
        report.push(`  Updated: ${order.updatedAt.toLocaleString()}`);
        
        if (order.items.length > 0) {
          report.push(`  Items (${order.items.length}):`);
          order.items.forEach((item, iIdx) => {
            report.push(`    ${iIdx + 1}. ${item.product.name} (${item.product.category})`);
            report.push(`       Quantity: ${item.quantity}`);
            report.push(`       Price: $${Number(item.price).toFixed(2)}`);
            report.push(`       Subtotal: $${(Number(item.price) * item.quantity).toFixed(2)}`);
            report.push(`       Size: ${item.selectedSize || 'N/A'}`);
            report.push(`       Color: ${item.selectedColor || 'N/A'}`);
          });
        }
      });
    }

    // ORDER ITEMS DETAILED DATA
    addSection('🛍️ ORDER ITEMS - DETAILED DATA');
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: {
          select: { id: true, status: true, totalAmount: true, createdAt: true }
        },
        product: {
          select: { name: true, category: true }
        }
      },
      orderBy: { orderId: 'asc' }
    });

    if (orderItems.length === 0) {
      report.push('No order items found in database.\n');
    } else {
      orderItems.forEach((item, idx) => {
        report.push(`\nOrder Item #${idx + 1}:`);
        report.push(`  ID: ${item.id}`);
        report.push(`  Order ID: ${item.orderId}`);
        report.push(`  Order Status: ${item.order.status}`);
        report.push(`  Product: ${item.product.name} (${item.product.category})`);
        report.push(`  Quantity: ${item.quantity}`);
        report.push(`  Price: $${Number(item.price).toFixed(2)}`);
        report.push(`  Subtotal: $${(Number(item.price) * item.quantity).toFixed(2)}`);
        report.push(`  Selected Size: ${item.selectedSize || 'N/A'}`);
        report.push(`  Selected Color: ${item.selectedColor || 'N/A'}`);
      });
    }

    // STATISTICS SUMMARY
    addSection('📈 STATISTICS SUMMARY');
    
    const stats = {
      users: await prisma.user.count(),
      products: await prisma.product.count(),
      orders: await prisma.order.count(),
      orderItems: await prisma.orderItem.count(),
      variations: await prisma.productVariation.count(),
      attributes: await prisma.productAttribute.count(),
      sizes: await prisma.productSize.count(),
    };

    report.push(`Total Users: ${stats.users}`);
    report.push(`Total Products: ${stats.products}`);
    report.push(`Total Orders: ${stats.orders}`);
    report.push(`Total Order Items: ${stats.orderItems}`);
    report.push(`Total Variations: ${stats.variations}`);
    report.push(`Total Attributes: ${stats.attributes}`);
    report.push(`Total Sizes: ${stats.sizes}`);

    if (stats.orders > 0) {
      const revenue = await prisma.order.aggregate({
        _sum: { totalAmount: true }
      });
      report.push(`Total Revenue: $${Number(revenue._sum.totalAmount || 0).toFixed(2)}`);
    }

    if (stats.products > 0) {
      const productStats = await prisma.product.aggregate({
        _sum: { sold: true, quantity: true },
        _avg: { price: true }
      });
      report.push(`Total Products Sold: ${productStats._sum.sold || 0}`);
      report.push(`Total Stock Available: ${productStats._sum.quantity || 0}`);
      report.push(`Average Product Price: $${Number(productStats._avg.price || 0).toFixed(2)}`);
    }

    // Save report to file
    const reportContent = report.join('\n');
    const reportPath = path.join(__dirname, '..', 'DATABASE_REPORT.txt');
    fs.writeFileSync(reportPath, reportContent, 'utf-8');
    
    console.log(reportContent);
    console.log(`\n\n✅ Detailed report saved to: ${reportPath}\n`);

  } catch (error) {
    console.error('❌ Error generating detailed report:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateDetailedReport()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

