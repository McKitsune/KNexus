export const processPurchase = (req, res) => {
    const userId = req.user.id;  // Asumiendo que req.user se establece en un middleware de autenticación

    // Lógica para procesar la compra
    res.json({ message: 'Compra procesada exitosamente', userId });
};