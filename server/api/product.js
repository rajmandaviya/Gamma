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

    const productQuery = `
      SELECT 
        p."id", p."Nume_Produs_RO", p."Nume_Produs_RU", p."Descriere_Produs_RO", 
        p."Descriere_Produs_RU", p."Pret_Standard", p."Pret_Redus", 
        p."Imagine_Principala", p."imagini_Secundare", p."Stock",
        b."id" AS "brand_id", b."Denumire_Brand"
      FROM public."nc_pka4__Produse" p
      LEFT JOIN public."nc_pka4___Branduri" b ON p."nc_pka4___Branduri_id" = b."id"
      WHERE p."id" = $1;
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
      SELECT 
        v."id", v."Varianta", v."Pret_Standard", v."Pret_Redus", 
        v."Valoare_Atribute_1", v."Imagini", v."Stock", v."Valoare_Atribute_2",
        a1."Atribut_RO_" AS "Atribut_1_RO", a1."Atribut_RU_" AS "Atribut_1_RU",
        a2."Atribut_RO_" AS "Atribut_2_RO", a2."Atribut_RU_" AS "Atribut_2_RU",
        c."Culoare_RO_", c."Culoare_RU_", c."Cod_Culoare"
      FROM public."nc_pka4___Variante" v
      LEFT JOIN public."nc_pka4__Atribute" a1 ON v."nc_pka4__Atribute_id" = a1."id"
      LEFT JOIN public."nc_pka4__Atribute" a2 ON v."nc_pka4__Atribute_id1" = a2."id"
      LEFT JOIN public."nc_pka4___Culori" c ON v."nc_pka4___Culori_id" = c."id"
      WHERE v."nc_pka4__Produse_id" = $1;
    `;
    const variantResult = await pool.query(variantQuery, [id]);
    let variants = variantResult.rows;

    variants = variants.map((variant) => {
      if (variant.Imagini) {
        variant.Imagini = JSON.parse(variant.Imagini).map(
          (image) => `${baseUrl}/${image.path}`
        );
      }
      return variant;
    });

    console.log(`Product and variants for ID ${id} fetched successfully`);

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
