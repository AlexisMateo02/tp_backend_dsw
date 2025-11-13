import { orm } from "../shared/dataBase/orm.js";
import { validateId } from "../shared/utils/validationId.js";
import { Order, OrderStatus } from "./order.entity.js";
import { OrderItem } from "../orderItem/orderItem.entity.js";
import { User } from "../user/user.entity.js";
import { Product } from "../product/product.entity.js";
import { PickUpPoint } from "../pickUpPoint/pickUpPoint.entity.js";

const entityManager = orm.em;

interface OrderCreateData {
  totalAmount: number;
  buyerContact: string;
  notes?: string;
  shippingAddress?: string; // 🆕 NUEVO CAMPO
  userId?: number;
  pickUpPointId?: number;
  items: Array<{
    productId: number;
    quantity: number;
    priceAtPurchase: string;
  }>;
}

interface OrderUpdateData {
  status?: OrderStatus;
  notes?: string;
}

export async function getAllOrders() {
  return await entityManager.find(
    Order,
    {},
    {
      populate: [
        "user",
        "items",
        "items.product",
        "pickUpPoint",
        "pickUpPoint.localty",
      ],
    }
  );
}

export async function getOrderById(id: number) {
  validateId(id, "orden");
  const order = await entityManager.findOne(
    Order,
    { id },
    {
      populate: [
        "user",
        "items",
        "items.product",
        "pickUpPoint",
        "pickUpPoint.localty",
      ],
    }
  );
  if (!order) {
    throw new Error(`La orden con el ID ${id} no fue encontrada`);
  }
  return order;
}

export async function getOrdersByUser(userId: number) {
  validateId(userId, "usuario");
  return await entityManager.find(
    Order,
    { user: userId },
    {
      populate: [
        "items",
        "items.product",
        "pickUpPoint",
        "pickUpPoint.localty",
      ],
    }
  );
}

export async function getOrdersByPickUpPoint(pickUpPointId: number) {
  validateId(pickUpPointId, "punto de retiro");
  return await entityManager.find(
    Order,
    { pickUpPoint: pickUpPointId },
    {
      populate: ["user", "items", "items.product"],
    }
  );
}
export async function createOrder(orderData: OrderCreateData) {
  // Generar número de orden único
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Obtener usuario si se especifica
  let user: User | undefined = undefined;
  if (orderData.userId) {
    const userFound = await entityManager.findOne(User, {
      id: orderData.userId,
    });
    if (!userFound) {
      throw new Error("Usuario no encontrado");
    }
    user = userFound;
  }

  // Obtener punto de retiro si se especifica
  let pickUpPoint: PickUpPoint | undefined = undefined;
  if (orderData.pickUpPointId) {
    const pickUpPointFound = await entityManager.findOne(PickUpPoint, {
      id: orderData.pickUpPointId,
    });
    if (!pickUpPointFound) {
      throw new Error("Punto de retiro no encontrado");
    }
    pickUpPoint = pickUpPointFound;
  }

  // 🆕 VALIDACIÓN: No puede tener ambos shippingAddress Y pickUpPoint
  if (orderData.shippingAddress && orderData.pickUpPointId) {
    throw new Error(
      "La orden no puede tener both dirección de envío y punto de retiro"
    );
  }

  // 🆕 VALIDACIÓN: Debe tener uno u otro
  if (!orderData.shippingAddress && !orderData.pickUpPointId) {
    throw new Error(
      "La orden debe tener either dirección de envío o punto de retiro"
    );
  }

  // Crear la orden
  const order = entityManager.create(Order, {
    orderNumber,
    totalAmount: orderData.totalAmount,
    buyerContact: orderData.buyerContact,
    notes: orderData.notes,
    shippingAddress: orderData.shippingAddress, // 🆕 NUEVO CAMPO
    user,
    pickUpPoint,
    status: OrderStatus.PENDING,
    orderDate: new Date(),
  });

  await entityManager.persist(order);

  // Crear items de la orden
  for (const itemData of orderData.items) {
    const product = await entityManager.findOne(Product, {
      id: itemData.productId,
    });
    if (!product) {
      throw new Error(`Producto con ID ${itemData.productId} no encontrado`);
    }

    // Verificar stock
    if (product.stock < itemData.quantity) {
      throw new Error(
        `Stock insuficiente para el producto '${product.Productname}'`
      );
    }

    // Calcular subtotal
    const priceValue = parseFloat(
      itemData.priceAtPurchase.replace(/[^\d.]/g, "")
    );
    const subtotal = priceValue * itemData.quantity;

    // Crear item con todos los campos requeridos
    const orderItem = entityManager.create(OrderItem, {
      order,
      product,
      quantity: itemData.quantity,
      priceAtPurchase: itemData.priceAtPurchase,
      subtotal,
      productName: product.Productname,
      productImage: product.image, // Usar la imagen principal del producto
    });

    // Actualizar solo el stock del producto (soldCount fue eliminado)
    product.stock -= itemData.quantity;

    await entityManager.persist(orderItem);
  }

  await entityManager.flush();
  return order;
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const order = await getOrderById(id);
  const previousStatus = order.status;
  // Si se está cancelando la orden (y antes no estaba cancelada), restaurar stock
  if (
    status === OrderStatus.CANCELLED &&
    previousStatus !== OrderStatus.CANCELLED
  ) {
    // Asegurarnos de tener los items y sus productos cargados
    await order.items.loadItems();
    for (const item of order.items) {
      if (item.product) {
        await entityManager.populate(item, ["product"]);
        // Restaurar stock sumando la cantidad cancelada
        const prod = item.product;
        prod.stock = (Number(prod.stock) || 0) + (Number(item.quantity) || 0);
      }
    }
  }

  order.status = status;
  await entityManager.flush();
  return order;
}

export async function updateOrder(id: number, orderData: OrderUpdateData) {
  const order = await getOrderById(id);

  if (orderData.status !== undefined) {
    order.status = orderData.status;
  }

  if (orderData.notes !== undefined) {
    order.notes = orderData.notes;
  }

  await entityManager.flush();
  return order;
}

export async function deleteOrder(id: number) {
  const order = await getOrderById(id);

  // Cargar items para poder acceder a ellos
  await order.items.loadItems();

  // Restaurar stock de productos (solo stock, soldCount fue eliminado)
  for (const item of order.items) {
    if (item.product) {
      // Asegurarse de que el producto esté cargado
      await entityManager.populate(item, ["product"]);
      item.product.stock += item.quantity;
    }
  }

  await entityManager.removeAndFlush(order);
  return true;
}
