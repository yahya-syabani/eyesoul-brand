const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportDatabaseToJSON() {
  try {
    console.log('🔄 Exporting database to JSON...\n');

    const data = {
      exportDate: new Date().toISOString(),
      statistics: {},
      users: [],
      products: [],
      variations: [],
      attributes: [],
      sizes: [],
      orders: [],
      orderItems: []
    };

    // Get all users
    const users = await prisma.user.findMany({
      include: {
        _count: { select: { orders: true } }
      }
    });
    data.users = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      ordersCount: user._count.orders,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }));

    // Get all products with relations
    const products = await prisma.product.findMany({
      include: {
        variations: true,
        attributes: true,
        sizes: true,
        _count: { select: { orderItems: true } }
      }
    });
    data.products = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      type: product.type,
      brand: product.brand,
      description: product.description,
      price: Number(product.price),
      originPrice: Number(product.originPrice),
      discount: ((Number(product.originPrice) - Number(product.price)) / Number(product.originPrice) * 100).toFixed(1) + '%',
      rate: product.rate,
      sold: product.sold,
      quantity: product.quantity,
      isNew: product.isNew,
      isSale: product.isSale,
      images: product.images,
      thumbImages: product.thumbImages,
      timesOrdered: product._count.orderItems,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      variations: product.variations.map(v => ({
        id: v.id,
        color: v.color,
        colorCode: v.colorCode,
        colorImage: v.colorImage,
        image: v.image
      })),
      attributes: product.attributes ? {
        id: product.attributes.id,
        lensType: product.attributes.lensType,
        frameMaterial: product.attributes.frameMaterial,
        frameSize: product.attributes.frameSize,
        lensCoating: product.attributes.lensCoating
      } : null,
      sizes: product.sizes.map(s => ({
        id: s.id,
        size: s.size
      }))
    }));

    // Get all variations
    const variations = await prisma.productVariation.findMany({
      include: {
        product: {
          select: { id: true, name: true, category: true }
        }
      }
    });
    data.variations = variations.map(v => ({
      id: v.id,
      productId: v.productId,
      productName: v.product.name,
      productCategory: v.product.category,
      color: v.color,
      colorCode: v.colorCode,
      colorImage: v.colorImage,
      image: v.image
    }));

    // Get all attributes
    const attributes = await prisma.productAttribute.findMany({
      include: {
        product: {
          select: { id: true, name: true, category: true }
        }
      }
    });
    data.attributes = attributes.map(a => ({
      id: a.id,
      productId: a.productId,
      productName: a.product.name,
      productCategory: a.product.category,
      lensType: a.lensType,
      frameMaterial: a.frameMaterial,
      frameSize: a.frameSize,
      lensCoating: a.lensCoating
    }));

    // Get all sizes
    const sizes = await prisma.productSize.findMany({
      include: {
        product: {
          select: { id: true, name: true, category: true }
        }
      }
    });
    data.sizes = sizes.map(s => ({
      id: s.id,
      productId: s.productId,
      productName: s.product.name,
      productCategory: s.product.category,
      size: s.size
    }));

    // Get all orders
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
      }
    });
    data.orders = orders.map(order => ({
      id: order.id,
      userId: order.userId,
      user: order.user ? {
        email: order.user.email,
        role: order.user.role
      } : null,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productCategory: item.product.category,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }))
    }));

    // Get all order items
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: {
          select: { id: true, status: true, totalAmount: true, createdAt: true }
        },
        product: {
          select: { name: true, category: true }
        }
      }
    });
    data.orderItems = orderItems.map(item => ({
      id: item.id,
      orderId: item.orderId,
      orderStatus: item.order.status,
      orderTotal: Number(item.order.totalAmount),
      orderDate: item.order.createdAt.toISOString(),
      productId: item.productId,
      productName: item.product.name,
      productCategory: item.product.category,
      quantity: item.quantity,
      price: Number(item.price),
      subtotal: Number(item.price) * item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    }));

    // Calculate statistics
    data.statistics = {
      totalUsers: await prisma.user.count(),
      totalProducts: await prisma.product.count(),
      totalOrders: await prisma.order.count(),
      totalOrderItems: await prisma.orderItem.count(),
      totalVariations: await prisma.productVariation.count(),
      totalAttributes: await prisma.productAttribute.count(),
      totalSizes: await prisma.productSize.count(),
      usersByRole: {
        admin: await prisma.user.count({ where: { role: 'ADMIN' } }),
        customer: await prisma.user.count({ where: { role: 'CUSTOMER' } })
      },
      productsByCategory: await prisma.product.groupBy({
        by: ['category'],
        _count: { id: true }
      }).then(result => 
        result.reduce((acc, item) => {
          acc[item.category] = item._count.id;
          return acc;
        }, {})
      ),
      ordersByStatus: await prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { totalAmount: true }
      }).then(result =>
        result.reduce((acc, item) => {
          acc[item.status] = {
            count: item._count.id,
            totalAmount: Number(item._sum.totalAmount || 0)
          };
          return acc;
        }, {})
      ),
      productStats: await prisma.product.aggregate({
        _avg: { price: true, originPrice: true },
        _min: { price: true, originPrice: true },
        _max: { price: true, originPrice: true },
        _sum: { quantity: true, sold: true }
      }).then(stats => ({
        averagePrice: Number(stats._avg.price || 0),
        averageOriginPrice: Number(stats._avg.originPrice || 0),
        minPrice: Number(stats._min.price || 0),
        maxPrice: Number(stats._max.price || 0),
        totalStock: stats._sum.quantity || 0,
        totalSold: stats._sum.sold || 0
      })),
      revenue: await prisma.order.aggregate({
        _sum: { totalAmount: true }
      }).then(result => ({
        total: Number(result._sum.totalAmount || 0)
      }))
    };

    // Save to file
    const jsonPath = path.join(__dirname, '..', 'database-export.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log('✅ Database exported successfully!');
    console.log(`📄 File saved to: ${jsonPath}\n`);
    console.log('📊 Export Summary:');
    console.log(`   - Users: ${data.statistics.totalUsers}`);
    console.log(`   - Products: ${data.statistics.totalProducts}`);
    console.log(`   - Orders: ${data.statistics.totalOrders}`);
    console.log(`   - Variations: ${data.statistics.totalVariations}`);
    console.log(`   - Attributes: ${data.statistics.totalAttributes}`);
    console.log(`   - Sizes: ${data.statistics.totalSizes}\n`);

  } catch (error) {
    console.error('❌ Error exporting database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabaseToJSON()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

