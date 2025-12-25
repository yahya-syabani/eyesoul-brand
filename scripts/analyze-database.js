const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeDatabase() {
  console.log('🔍 Analyzing Database...\n');
  console.log('='.repeat(80));

  try {
    // Users Analysis
    console.log('\n📊 USERS ANALYSIS');
    console.log('-'.repeat(80));
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } });
    const customerUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    
    console.log(`Total Users: ${totalUsers}`);
    console.log(`  - Admins: ${adminUsers}`);
    console.log(`  - Customers: ${customerUsers}`);
    
    if (totalUsers > 0) {
      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { orders: true } }
        }
      });
      console.log('\nRecent Users (last 5):');
      recentUsers.forEach((user, idx) => {
        console.log(`  ${idx + 1}. ${user.email} (${user.role}) - ${user._count.orders} orders - Created: ${user.createdAt.toLocaleDateString()}`);
      });
    }

    // Products Analysis
    console.log('\n📦 PRODUCTS ANALYSIS');
    console.log('-'.repeat(80));
    const totalProducts = await prisma.product.count();
    console.log(`Total Products: ${totalProducts}`);
    
    if (totalProducts > 0) {
      // Products by category
      const productsByCategory = await prisma.product.groupBy({
        by: ['category'],
        _count: { id: true }
      });
      console.log('\nProducts by Category:');
      productsByCategory.forEach(cat => {
        console.log(`  - ${cat.category}: ${cat._count.id}`);
      });

      // Products by flags
      const newProducts = await prisma.product.count({ where: { isNew: true } });
      const saleProducts = await prisma.product.count({ where: { isSale: true } });
      console.log(`\nProduct Flags:`);
      console.log(`  - New Products: ${newProducts}`);
      console.log(`  - On Sale: ${saleProducts}`);

      // Price statistics
      const priceStats = await prisma.product.aggregate({
        _avg: { price: true, originPrice: true },
        _min: { price: true, originPrice: true },
        _max: { price: true, originPrice: true },
        _sum: { quantity: true, sold: true }
      });
      console.log(`\nPrice Statistics:`);
      console.log(`  - Average Price: $${Number(priceStats._avg.price || 0).toFixed(2)}`);
      console.log(`  - Average Original Price: $${Number(priceStats._avg.originPrice || 0).toFixed(2)}`);
      console.log(`  - Min Price: $${Number(priceStats._min.price || 0).toFixed(2)}`);
      console.log(`  - Max Price: $${Number(priceStats._max.price || 0).toFixed(2)}`);
      console.log(`  - Total Stock Quantity: ${priceStats._sum.quantity || 0}`);
      console.log(`  - Total Sold: ${priceStats._sum.sold || 0}`);

      // Top products by sales
      const topProducts = await prisma.product.findMany({
        take: 10,
        orderBy: { sold: 'desc' },
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
          sold: true,
          quantity: true,
          rate: true
        }
      });
      console.log('\nTop 10 Products by Sales:');
      topProducts.forEach((product, idx) => {
        console.log(`  ${idx + 1}. ${product.name} (${product.category}) - Sold: ${product.sold}, Stock: ${product.quantity}, Price: $${Number(product.price).toFixed(2)}, Rating: ${product.rate}`);
      });

      // Products with variations
      const productsWithVariations = await prisma.product.findMany({
        where: {
          variations: { some: {} }
        },
        include: {
          _count: { select: { variations: true } }
        }
      });
      console.log(`\nProducts with Variations: ${productsWithVariations.length}`);
      if (productsWithVariations.length > 0) {
        const totalVariations = await prisma.productVariation.count();
        console.log(`Total Variations: ${totalVariations}`);
      }

      // Products with attributes
      const productsWithAttributes = await prisma.product.count({
        where: {
          attributes: { isNot: null }
        }
      });
      console.log(`Products with Attributes: ${productsWithAttributes}`);

      // Products with sizes
      const productsWithSizes = await prisma.product.findMany({
        where: {
          sizes: { some: {} }
        },
        include: {
          _count: { select: { sizes: true } }
        }
      });
      console.log(`Products with Sizes: ${productsWithSizes.length}`);
      if (productsWithSizes.length > 0) {
        const totalSizes = await prisma.productSize.count();
        console.log(`Total Size Entries: ${totalSizes}`);
      }
    }

    // Orders Analysis
    console.log('\n🛒 ORDERS ANALYSIS');
    console.log('-'.repeat(80));
    const totalOrders = await prisma.order.count();
    console.log(`Total Orders: ${totalOrders}`);
    
    if (totalOrders > 0) {
      // Orders by status
      const ordersByStatus = await prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { totalAmount: true }
      });
      console.log('\nOrders by Status:');
      ordersByStatus.forEach(status => {
        console.log(`  - ${status.status}: ${status._count.id} orders (Total: $${Number(status._sum.totalAmount || 0).toFixed(2)})`);
      });

      // Order statistics
      const orderStats = await prisma.order.aggregate({
        _avg: { totalAmount: true },
        _min: { totalAmount: true },
        _max: { totalAmount: true },
        _sum: { totalAmount: true }
      });
      console.log(`\nOrder Statistics:`);
      console.log(`  - Average Order Value: $${Number(orderStats._avg.totalAmount || 0).toFixed(2)}`);
      console.log(`  - Min Order Value: $${Number(orderStats._min.totalAmount || 0).toFixed(2)}`);
      console.log(`  - Max Order Value: $${Number(orderStats._max.totalAmount || 0).toFixed(2)}`);
      console.log(`  - Total Revenue: $${Number(orderStats._sum.totalAmount || 0).toFixed(2)}`);

      // Recent orders
      const recentOrders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true }
          },
          _count: { select: { items: true } }
        }
      });
      console.log('\nRecent Orders (last 10):');
      recentOrders.forEach((order, idx) => {
        const userEmail = order.user?.email || 'Guest';
        console.log(`  ${idx + 1}. Order #${order.id.slice(0, 8)}... - ${order.status} - $${Number(order.totalAmount).toFixed(2)} - ${order._count.items} items - User: ${userEmail} - ${order.createdAt.toLocaleDateString()}`);
      });

      // Order items analysis
      const totalOrderItems = await prisma.orderItem.count();
      const orderItemStats = await prisma.orderItem.aggregate({
        _sum: { quantity: true, price: true }
      });
      console.log(`\nOrder Items:`);
      console.log(`  - Total Items Ordered: ${totalOrderItems}`);
      console.log(`  - Total Quantity: ${orderItemStats._sum.quantity || 0}`);
      console.log(`  - Total Value: $${Number(orderItemStats._sum.price || 0).toFixed(2)}`);

      // Most ordered products
      const mostOrderedProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { id: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
      });
      
      if (mostOrderedProducts.length > 0) {
        console.log('\nMost Ordered Products:');
        for (const item of mostOrderedProducts) {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { name: true, category: true }
          });
          if (product) {
            console.log(`  - ${product.name} (${product.category}): ${item._sum.quantity} units in ${item._count.id} orders`);
          }
        }
      }
    }

    // Variations Analysis
    console.log('\n🎨 PRODUCT VARIATIONS ANALYSIS');
    console.log('-'.repeat(80));
    const totalVariations = await prisma.productVariation.count();
    console.log(`Total Variations: ${totalVariations}`);
    
    if (totalVariations > 0) {
      const colors = await prisma.productVariation.groupBy({
        by: ['color'],
        _count: { id: true }
      });
      console.log('\nColors Distribution:');
      colors.forEach(color => {
        console.log(`  - ${color.color}: ${color._count.id} variations`);
      });
    }

    // Attributes Analysis
    console.log('\n🔧 PRODUCT ATTRIBUTES ANALYSIS');
    console.log('-'.repeat(80));
    const totalAttributes = await prisma.productAttribute.count();
    console.log(`Total Attributes: ${totalAttributes}`);
    
    if (totalAttributes > 0) {
      const lensTypes = await prisma.productAttribute.groupBy({
        by: ['lensType'],
        _count: { id: true }
      });
      console.log('\nLens Types:');
      lensTypes.forEach(lens => {
        console.log(`  - ${lens.lensType || 'N/A'}: ${lens._count.id} products`);
      });

      const frameMaterials = await prisma.productAttribute.groupBy({
        by: ['frameMaterial'],
        _count: { id: true }
      });
      console.log('\nFrame Materials:');
      frameMaterials.forEach(material => {
        console.log(`  - ${material.frameMaterial || 'N/A'}: ${material._count.id} products`);
      });
    }

    // Sizes Analysis
    console.log('\n📏 PRODUCT SIZES ANALYSIS');
    console.log('-'.repeat(80));
    const totalSizes = await prisma.productSize.count();
    console.log(`Total Size Entries: ${totalSizes}`);
    
    if (totalSizes > 0) {
      const sizes = await prisma.productSize.groupBy({
        by: ['size'],
        _count: { id: true }
      });
      console.log('\nSizes Distribution:');
      sizes.forEach(size => {
        console.log(`  - ${size.size}: ${size._count.id} products`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📈 DATABASE SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Total Orders: ${totalOrders}`);
    console.log(`Total Variations: ${totalVariations}`);
    console.log(`Total Attributes: ${totalAttributes}`);
    console.log(`Total Sizes: ${totalSizes}`);
    
    if (totalOrders > 0) {
      const orderStats = await prisma.order.aggregate({
        _sum: { totalAmount: true }
      });
      console.log(`Total Revenue: $${Number(orderStats._sum.totalAmount || 0).toFixed(2)}`);
    }

    console.log('\n✅ Analysis Complete!\n');

  } catch (error) {
    console.error('❌ Error analyzing database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

analyzeDatabase()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

