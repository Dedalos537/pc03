"use client"; // Esto asegura que el código se ejecute solo en el cliente

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [user, setUser] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "", imagen_url: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const resUsuario = await fetch("http://localhost:4000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resUsuario.ok) {
          throw new Error('No se pudo obtener el usuario');
        }

        const usuarioData = await resUsuario.json();
        setUser(usuarioData);

        const resProductos = await fetch("http://localhost:4000/api/productos");
        if (!resProductos.ok) {
          throw new Error('No se pudieron cargar los productos');
        }
        const productosData = await resProductos.json();
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Error al cargar datos, por favor intenta de nuevo.");
      }
    };

    cargarDatos();
  }, [router]);

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const agregarProducto = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoProducto),
      });
      if (res.ok) {
        const productoCreado = await res.json();
        setProductos([...productos, productoCreado]);
        setNuevoProducto({ nombre: "", precio: "", imagen_url: "" });
        alert("Producto agregado con éxito.");
      } else {
        alert("No autorizado o error al agregar producto.");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar producto.");
    }
  };

  const handleEditar = (producto) => {
    setProductoEditar({ ...producto });  // Copiar el producto para editarlo
    setShowModal(true);
  };

  const handleEliminar = (productoId) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmar) {
      eliminarProducto(productoId);
    }
  };

  const eliminarProducto = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/productos/${productoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setProductos(productos.filter((producto) => producto.id !== productoId));
        alert("Producto eliminado con éxito.");
      } else {
        alert("Error al eliminar producto.");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto.");
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/productos/${productoEditar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productoEditar),
      });
      if (res.ok) {
        const productoActualizado = await res.json();
        setProductos(productos.map(p => p.id === productoActualizado.id ? productoActualizado : p));
        setShowModal(false);
        alert("Producto actualizado con éxito.");
      } else {
        alert("Error al actualizar producto.");
      }
    } catch (error) {
      console.error("Error al editar producto:", error);
      alert("Error al editar producto.");
    }
  };

  const handleCerrarSesion = () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmar) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container py-4">
      <div className="row">
        {/* Tarjeta con título, bienvenida y barra de búsqueda */}
        <div className={user && user.rol === "cliente" ? "col-12 mb-4" : "col-md-6 mb-4"}>
          <div className="card register-card">
            <div className="card-body">
              <h1 className="card-title text-center text-gray">Productos</h1>
              {user && user.rol === "cliente" && (
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="text-gray">Bienvenido, {user.nombre}</h3>
                  <button className="btn register-button" onClick={handleCerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              )}
              {user && user.rol === "admin" && (
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="text-center text-gray mb-4">Bienvenido, {user.nombre}</h3>
                  <button className="btn register-button" onClick={handleCerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              )}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="register-input w-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de agregar producto */}
        {user && user.rol === "admin" && (
          <div className="col-md-6 mb-4">
            <div className="card register-card">
              <div className="card-body">
                <h3 className="text-center text-gray mb-4">Agregar Producto</h3>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del producto"
                  value={nuevoProducto.nombre}
                  onChange={handleInputChange}
                  className="register-input mb-2 w-100"
                />
                <input
                  type="number"
                  name="precio"
                  placeholder="Precio"
                  value={nuevoProducto.precio}
                  onChange={handleInputChange}
                  className="register-input mb-2 w-100"
                />
                <input
                  type="text"
                  name="imagen_url"
                  placeholder="URL de la imagen"
                  value={nuevoProducto.imagen_url}
                  onChange={handleInputChange}
                  className="register-input mb-2 w-100"
                />
                <button onClick={agregarProducto} className="register-button w-100">
                  Agregar Producto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tarjetas de productos debajo de la tarjeta principal */}
      <div className="row">
        {productosFiltrados.map((producto) => (
          <div className="col-md-3 mb-4" key={producto.id}>
            <div className="card register-card">
              {producto.imagen_url && (
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title text-black">{producto.nombre}</h5>
                <p className="card-text text-black">Precio: ${producto.precio}</p>
                {user && user.rol === "admin" && (
                  <div className="d-flex justify-content-between">
                    <button
                      className="register-button"
                      onClick={() => handleEditar(producto)}
                    >
                      Editar
                    </button>
                    <button
                      className="register-button"
                      onClick={() => handleEliminar(producto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      {productoEditar && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              value={productoEditar.nombre}
              onChange={(e) =>
                setProductoEditar({ ...productoEditar, nombre: e.target.value })
              }
              className="register-input mb-2 w-100"
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={productoEditar.precio}
              onChange={(e) =>
                setProductoEditar({ ...productoEditar, precio: e.target.value })
              }
              className="register-input mb-2 w-100"
            />
            <input
              type="text"
              name="imagen_url"
              placeholder="URL de la imagen"
              value={productoEditar.imagen_url}
              onChange={(e) =>
                setProductoEditar({ ...productoEditar, imagen_url: e.target.value })
              }
              className="register-input mb-2 w-100"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleGuardarEdicion}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
