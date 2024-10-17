import pool from "~/server/db";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id) {
    console.error("Product ID is missing");
    throw createError({
      statusCode: 400,
      message: "Product ID is required",
    });
  }

  const config = useRuntimeConfig();
  const baseUrl = config.public.baseURL;

  try {
    console.log(`Fetching product with ID: ${id}`);

    const removeUnwantedFields = (obj) => {
      const fieldsToRemove = [
        "created_at",
        "created_by",
        "updated_at",
        "updated_by",
        "nc_pka4__Atribute_id",
        "nc_pka4__Atribute_id1",
        "nc_pka4___Culori_id",
        "nc_pka4___Branduri_id",
        "nc_pka4__Produse_id",
      ];

      if (Array.isArray(obj)) {
        return obj.map((item) => removeUnwantedFields(item));
      } else if (typeof obj === "object" && obj !== null) {
        const cleanedObj = { ...obj };
        fieldsToRemove.forEach((field) => delete cleanedObj[field]);

        Object.keys(cleanedObj).forEach((key) => {
          if (typeof cleanedObj[key] === "object" && cleanedObj[key] !== null) {
            cleanedObj[key] = removeUnwantedFields(cleanedObj[key]);
          }
        });

        return cleanedObj;
      }
      return obj;
    };

    const productQuery = `
      SELECT p.*, b.*
      FROM public."nc_pka4__Produse" p
      LEFT JOIN public."nc_pka4___Branduri" b ON p."nc_pka4___Branduri_id" = b.id
      WHERE p.id = $1;
    `;
    const productResult = await pool.query(productQuery, [id]);

    if (productResult.rows.length === 0) {
      console.error(`Product with ID ${id} not found`);
      throw createError({
        statusCode: 404,
        message: "Product not found",
      });
    }

    let product = productResult.rows[0];

    product = removeUnwantedFields(product);

    if (product.Imagine_Principala) {
      product.Imagine_Principala = JSON.parse(product.Imagine_Principala).map(
        (image) => `${baseUrl}/${image.path}`
      );
    }

    if (product.imagini_Secundare) {
      product.imagini_Secundare = JSON.parse(product.imagini_Secundare).map(
        (image) => `${baseUrl}/${image.path}`
      );
    }

    const variantQuery = `
      SELECT v.*, 
             row_to_json(a1) AS "Attribute_1", 
             row_to_json(a2) AS "Attribute_2", 
             row_to_json(c) AS "Culoare"
      FROM public."nc_pka4___Variante" v
      LEFT JOIN public."nc_pka4__Atribute" a1 ON v."nc_pka4__Atribute_id" = a1.id
      LEFT JOIN public."nc_pka4__Atribute" a2 ON v."nc_pka4__Atribute_id1" = a2.id
      LEFT JOIN public."nc_pka4___Culori" c ON v."nc_pka4___Culori_id" = c.id
      WHERE v."nc_pka4__Produse_id" = $1;
    `;
    const variantResult = await pool.query(variantQuery, [id]);
    let variants = variantResult.rows;

    variants = removeUnwantedFields(variants).map((variant) => {
      if (variant.Imagini) {
        variant.Imagini = JSON.parse(variant.Imagini).map(
          (image) => `${baseUrl}/${image.path}`
        );
      }
      return variant;
    });

    console.log(
      `Variants with attributes and colors for product ID ${id} fetched successfully`
    );

    return {
      success: true,
      product,
      variants,
    };
  } catch (error) {
    console.error("Error fetching product or variants:", error.message);
    console.error("Full error details:", error.stack);

    return {
      success: false,
      error: error.message || "Failed to fetch product and variants",
    };
  }
});
