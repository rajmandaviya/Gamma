import pool from '../db';

export default defineEventHandler(async (_) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM public."nc_pka4__Produse" WHERE "Pret_Standard" > "Pret_Redus"`
        );
        return { success: true, products: rows };
    } catch (error) {
        console.error('Error fetching products', error.message);
        console.error('Full error details:', error.stack);
        return {
            success: false,
            error: error.message || 'Failed to fetch products',
        };
    }
});
