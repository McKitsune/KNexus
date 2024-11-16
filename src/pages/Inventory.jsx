import React, { useState, useEffect } from 'react';
import api, { fetchProductos } from '../services/api'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Inventory.css';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ id: '', name: '', description: '', price: '', stock: '', imageUrls: [] });
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [imageFiles, setImageFiles] = useState([]); // Estado para múltiples imágenes

    const fetchProducts = async () => {
        try {
            const data = await fetchProductos(); // Llama a fetchProductos desde api.js
            setProducts(data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
        setNewProduct({ id: '', name: '', description: '', price: '', stock: '', imageUrls: [] });
        setImageFiles([]); // Limpiar los archivos de imagen
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewProduct({ id: '', name: '', description: '', price: '', stock: '', imageUrls: [] });
        setImageFiles([]); // Limpiar los archivos de imagen
    };

    const openEditModal = (product) => {
        setNewProduct(product); // Cargar datos del producto seleccionado para editar
        setIsEditModalOpen(true);
        setImageFiles([]); // Limpiar los archivos de imagen
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setNewProduct({ id: '', name: '', description: '', price: '', stock: '', imageUrls: [] });
        setImageFiles([]); // Limpiar los archivos de imagen
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 4); // Limitar a 4 archivos
        setImageFiles(files);
    };

    const uploadImagesToS3 = async () => {
        const imageUrls = [];
        for (let file of imageFiles) {
            try {
                const uploadURLResponse = await api.get(`/s3/upload-url?fileName=${file.name}`);
                const uploadURL = uploadURLResponse.data.url;
    
                await fetch(uploadURL, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });
    
                imageUrls.push(uploadURL.split('?')[0]);
            } catch (error) {
                console.error('Error al subir imagen a S3:', error);
            }
        }
        return imageUrls;
    };

    const createProduct = async () => {
        try {
            const imageUrls = await uploadImagesToS3();

            const productData = {
                ...newProduct,
                imageUrls, // Asignar las URLs de las imágenes al producto
            };
            await api.post('/product', productData);
            closeCreateModal();
            fetchProducts();
        } catch (error) {
            console.error('Error al crear producto:', error);
        }
    };

    const updateProduct = async () => {
        try {
            const imageUrls = await uploadImagesToS3();
            const updatedProductData = {
                ...newProduct,
                imageUrls: [...newProduct.imageUrls, ...imageUrls].slice(0, 4), // Limitar a 4 URLs de imágenes
            };
            await api.post(`/product`, updatedProductData); // Usa POST para actualizar
            closeEditModal();
            fetchProducts();
        } catch (error) {
            console.error('Error al actualizar producto:', error);
        }
    };

    const deleteProduct = async () => {
        if (selectedProductId === null) return;
        try {
            await api.delete(`/product/${selectedProductId}`);
            fetchProducts();
            setSelectedProductId(null);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(price);
    };

    return (
        <div>
            <div>
                <h1>Inventario de Productos</h1>
                <button className='createproduct' onClick={openCreateModal}>Crear Producto</button>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Seleccionar</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Imágenes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name="selectedProduct"
                                            checked={selectedProductId === product.id}
                                            onChange={() => setSelectedProductId(product.id)}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        {product.imageUrls && product.imageUrls.map((url, index) => (
                                            <img key={index} src={url} alt={product.name} width="50" height="50" />
                                        ))}
                                    </td>
                                    <td>
                                        <FontAwesomeIcon icon={faEdit} onClick={() => openEditModal(product)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                        <FontAwesomeIcon icon={faTrash} onClick={deleteProduct} style={{ cursor: 'pointer' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Crear Producto */}
            {isCreateModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Crear Producto</h2>
                        <input
                            type="text"
                            name="id"
                            placeholder="ID"
                            value={newProduct.id}
                            onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Descripción"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Precio"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Math.max(0, parseFloat(e.target.value)) })}
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: Math.max(0, parseInt(e.target.value, 10)) })}
                        />
                        <input type="file" onChange={handleImageChange} multiple />
                        <button onClick={createProduct}>Guardar Producto</button>
                        <button onClick={closeCreateModal}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* Modal para Editar Producto */}
            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar Producto</h2>
                        <input
                            type="text"
                            name="id"
                            placeholder="ID"
                            value={newProduct.id}
                            disabled
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Descripción"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Precio"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Math.max(0, parseFloat(e.target.value)) })}
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: Math.max(0, parseInt(e.target.value, 10)) })}
                        />
                        <input type="file" onChange={handleImageChange} multiple />
                        <button onClick={updateProduct}>Actualizar Producto</button>
                        <button onClick={closeEditModal}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
