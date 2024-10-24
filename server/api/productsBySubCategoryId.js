import pool from '../db';

export default defineEventHandler(async (_) => {
    const { id } = getQuery(_);

    try {
        // Step 1: Get SubSubCategorii ids based on SubCategorii id
        const subSubCategoriesResult = await pool.query(
            `SELECT id FROM public."nc_pka4___SubSubCategorii" WHERE "nc_pka4___SubCategorii_id" = $1`,
            [id]
        );
        const subSubCategoryIds = subSubCategoriesResult.rows.map(row => row.id);

        if (subSubCategoryIds.length === 0) {
            return { success: false, error: 'No SubSubCategorii found for the given SubCategorii id' };
        }

        // Step 2: Get products based on SubSubCategorii ids
        const productsResult = await pool.query(
            `SELECT * FROM public."nc_pka4__Produse" WHERE "nc_pka4___SubSubCategorii_id" = ANY($1::int[])`,
            [subSubCategoryIds]
        );
        const products = productsResult.rows;

        if (products.length === 0) {
            return { success: false, error: 'No products found for the given SubSubCategorii ids' };
        }

        return { success: true, products };
    } catch (error) {
        console.error('Error fetching products', error.message);
        console.error('Full error details:', error.stack);
        return {
            success: false,
            error: error.message || 'Failed to fetch products',
        };
    }
});
