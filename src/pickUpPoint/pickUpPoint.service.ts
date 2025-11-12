import { orm } from "../shared/dataBase/orm.js";
import { validateId } from "../shared/utils/validationId.js";
import { PickUpPoint } from "./pickUpPoint.entity.js";
import { Localty } from "../localty/localty.entity.js";
import { Order } from "../order/order.entity.js";
import fs from "fs";
import path from "path";

const entityManager = orm.em;

interface PickUpPointCreateData {
  storeName?: string;
  address: string;
  adressDescription?: string;
  phoneNumber?: string;
  horary?: string;
  image?: string;
  localty: number; // CAMBIAR: de localtyId a localty
}

interface PickUpPointUpdateData extends Partial<PickUpPointCreateData> {}

export async function getAllPickUpPoints() {
  return await entityManager.find(
    PickUpPoint,
    {},
    { populate: ["localty", "localty.province"] }
  );
}

export async function getPickUpPointById(id: number) {
  validateId(id, "punto de retiro");
  const pickUpPoint = await entityManager.findOne(
    PickUpPoint,
    { id },
    { populate: ["localty", "localty.province"] }
  );
  if (!pickUpPoint) {
    throw new Error(`El punto de retiro con el ID ${id} no fue encontrado`);
  }
  return pickUpPoint;
}

export async function getPickUpPointsByLocalty(localtyId: number) {
  validateId(localtyId, "localidad");
  return await entityManager.find(
    PickUpPoint,
    { localty: localtyId },
    { populate: ["localty"] }
  );
}

export async function createPickUpPoint(
  pickUpPointData: PickUpPointCreateData
) {
  console.log("🔍 DEBUG - Service createPickUpPoint recibió:", {
    ...pickUpPointData,
    imageLength: pickUpPointData.image ? pickUpPointData.image.length : 0,
  });

  // Obtener localidad
  const localty = await entityManager.findOne(Localty, {
    id: pickUpPointData.localty,
  });
  if (!localty) {
    throw new Error(`La localidad con ID ${pickUpPointData.localty} no existe`);
  }

  console.log("🔄 Creando entidad PickUpPoint...");

  try {
    // Si la imagen viene como dataURL, guardarla en disco y reemplazar el campo
    let imageValue = pickUpPointData.image;
    if (typeof imageValue === "string" && imageValue.startsWith("data:")) {
      try {
        const matches = imageValue.match(
          /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/
        );
        if (matches) {
          const ext = matches[2] === "jpeg" ? "jpg" : matches[2];
          const base64 = matches[3];
          const uploadDir = path.join(process.cwd(), "uploads", "forum");
          if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
          const filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
          // Guardar ruta root-relative para que el frontend la normalice
          imageValue = `/uploads/forum/${filename}`;
          console.log("✅ Imagen guardada en createPickUpPoint:", imageValue);
        } else {
          console.warn(
            "⚠️ createPickUpPoint: imagen no está en formato data:image/*;base64"
          );
        }
      } catch (err) {
        console.error("❌ Error guardando imagen en createPickUpPoint:", err);
        // No bloquear la creación por fallo en guardado de imagen, solo loguear
      }
    }

    const pickUpPoint = entityManager.create(PickUpPoint, {
      storeName: pickUpPointData.storeName,
      address: pickUpPointData.address,
      adressDescription: pickUpPointData.adressDescription,
      phoneNumber: pickUpPointData.phoneNumber,
      horary: pickUpPointData.horary,
      image: imageValue,
      localty,
    });

    console.log("✅ Entidad creada, haciendo flush...");

    await entityManager.flush();

    console.log(
      "✅ Flush completado, retornando pickUpPoint con ID:",
      pickUpPoint.id
    );

    return pickUpPoint;
  } catch (error) {
    console.error("❌ ERROR en createPickUpPoint:", error);
    throw error;
  }
}
export async function updatePickUpPoint(
  id: number,
  pickUpPointData: PickUpPointUpdateData
) {
  const pickUpPoint = await getPickUpPointById(id);

  // Si se actualiza la localidad - usar pickUpPointData.localty en lugar de pickUpPointData.localtyId
  if (pickUpPointData.localty) {
    const localty = await entityManager.findOne(Localty, {
      id: pickUpPointData.localty,
    });
    if (!localty) {
      throw new Error(
        `La localidad con ID ${pickUpPointData.localty} no existe`
      );
    }
    pickUpPoint.localty = localty;
  }

  // Si la imagen viene como dataURL en la actualización, guardarla en disco
  if (
    pickUpPointData.image &&
    typeof pickUpPointData.image === "string" &&
    pickUpPointData.image.startsWith("data:")
  ) {
    try {
      const matches = pickUpPointData.image.match(
        /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/
      );
      if (matches) {
        const ext = matches[2] === "jpeg" ? "jpg" : matches[2];
        const base64 = matches[3];
        const uploadDir = path.join(process.cwd(), "uploads", "forum");
        if (!fs.existsSync(uploadDir))
          fs.mkdirSync(uploadDir, { recursive: true });
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
        pickUpPointData.image = `/uploads/forum/${filename}`;
        console.log(
          "✅ Imagen guardada en updatePickUpPoint:",
          pickUpPointData.image
        );
      } else {
        console.warn(
          "⚠️ updatePickUpPoint: imagen no está en formato data:image/*;base64"
        );
      }
    } catch (err) {
      console.error("❌ Error guardando imagen en updatePickUpPoint:", err);
      // Dejar que la validación/guardado continúe; si falla, flush lanzará y el controlador devolverá 500
    }
  }

  entityManager.assign(pickUpPoint, pickUpPointData);
  await entityManager.flush();
  return pickUpPoint;
}

export async function deletePickUpPoint(id: number) {
  const pickUpPoint = await getPickUpPointById(id);

  // Verificar si hay órdenes asociadas a este punto de retiro
  const orderCount = await entityManager.count(Order, {
    pickUpPoint: pickUpPoint.id,
  });
  if (orderCount > 0) {
    throw new Error(
      `No se puede eliminar el punto de retiro porque tiene ${orderCount} orden${orderCount > 1 ? "es" : ""} asociada${orderCount > 1 ? "s" : ""}`
    );
  }

  await entityManager.removeAndFlush(pickUpPoint);
  return true;
}
