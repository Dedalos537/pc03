"use client"; // Esto asegura que el código se ejecute solo en el cliente

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [productosEliminados, setProductosEliminados] = useState([]);
  const [user, setUser ] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "", imagen_url: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalSesion, setShowModalSesion] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false); // Modal para confirmar eliminación
  const [productoAEliminar, setProductoAEliminar] = useState(null); // Producto a eliminar
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
        setUser (usuarioData);

        const resProductos = await fetch("http://localhost:4000/api/productos");
        if (!resProductos.ok) {
          throw new Error('No se pudieron cargar los productos');
        }
        const productosData = await resProductos.json();
        setProductos(productosData);

        // Cargar productos eliminados si es un administrador
        if (usuarioData.rol === "admin") {
          const resProductosEliminados = await fetch("http://localhost:4000/api/productos/eliminados", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (resProductosEliminados.ok) {
            const productosEliminadosData = await resProductosEliminados.json();
            setProductosEliminados(productosEliminadosData);
          }
        }
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

  const agregarProducto = async (e) => {
    e.preventDefault(); // Esto previene la recarga de la página al enviar el formulario
  
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
    setProductoAEliminar(productoId); // Guardar el ID del producto a eliminar
    setShowModalEliminar(true); // Mostrar el modal de confirmación
  };

  const confirmarEliminarProducto = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:4000/api/productos/${productoAEliminar}`; // Asegúrate de que no haya espacios
      console.log(url); // Para depuración
  
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        setProductos(productos.filter((producto) => producto.id !== productoAEliminar));
        setShowModalEliminar(false);
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
        setProductos((prevProductos) =>
          prevProductos.map((p) =>
            p.id === productoActualizado.id ? productoActualizado : p
          )
        );
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
    setShowModalSesion(true); // Muestra un modal personalizado para confirmar el cierre de sesión
  };

  const handleConfirmarCerrarSesion = () => {
    localStorage.removeItem("token");
    setUser (null);
    router.push("/login");
  };

  const handleCancelarCerrarSesion = () => {
    setShowModalSesion(false);
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre && producto.nombre.toLowerCase().includes(searchQuery) // Comprobamos que 'nombre' exista antes de hacer .toLowerCase()
  );

const restaurarProducto = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const url = `http://localhost:4000/api/productos/restaurar/${id}`; // Asegúrate de que el ID esté correctamente formateado
    console.log(url); // Para depuración

    const res = await fetch(url, {
      method: "PUT", // Coincide con el método definido en tu backend
      headers: {
        Authorization: `Bearer ${token}`, // Token para autenticación
        "Content-Type": "application/json", // Asegúrate de enviar JSON
      },
      // No necesitas un body si el backend no lo requiere
    });

    if (res.ok) {
      alert("Producto restaurado con éxito.");
    } else {
      const errorData = await res.json(); // Capturar detalles del error
      alert(`Error al restaurar producto: ${errorData.error || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error("Error al restaurar producto:", error);
    alert("Error al restaurar producto.");
  }
};


  return (
    <div className="container py-4">
      <div className="row">
        <div className={user && user.rol === "cliente" ? "col-12 mb-4" : "col-md-6 mb-4"}>
          <div className="card register-card">
            <div className="card-body">
              <h1 className="card-title text-center text-gray">Productos</h1>
              {user && user.rol === "cliente" && (
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="text-gray">Bienvenido, {user.nombre}</h3>
                  <button className="btn register-button text-white" onClick={handleCerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              )}
              {user && user.rol === "admin" && (
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="text-center text-gray mb-4">Bienvenido, {user.nombre}</h3>
                  <button className="btn register-button text-white" onClick={handleCerrarSesion}>
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

        {user && user.rol === "admin" && (
          <div className="col-md-6 mb-4">
            <div className="card register-card">
              <div className="card-body">
                <h5 className="card-title text-center text-gray">Agregar nuevo producto</h5>
                <form className="d-flex flex-column" onSubmit={agregarProducto}>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoProducto.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="register-input mb-3"
                    required
                  />
                  <input
                    type="number"
                    name="precio"
                    value={nuevoProducto.precio}
                    onChange={handleInputChange}
                    placeholder="Precio"
                    className="register-input mb-3"
                    required
                  />
                  <input
                    type="text"
                    name="imagen_url"
                    value={nuevoProducto.imagen_url}
                    onChange={handleInputChange}
                    placeholder="Imagen URL"
                    className="register-input mb-3"
                  />
                  <button type="submit" className="btn register-button text-white">Agregar Producto</button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-12">
          <div className="card register-card">
            <div className="card-body">
              <h2 className="card-title text-center text-gray">Productos</h2>
              <div className="row">
                {productosFiltrados.map((producto) => (
                  <div key={producto.id} className="col-md-4 mb-4">
                    <div className="product-card">
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="card-img-top"
                      />
                      <div className="product-info">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <p className="card-text">${producto.precio}</p>
                        {user && user.rol === "admin" && (
                          <>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleEditar(producto)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-danger ml-2"
                              onClick={() => handleEliminar(producto.id)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {productosEliminados.length > 0 && user && user.rol === "admin" && (
          <div className="col-12 mt-4">
            <div className="card register-card">
              <div className="card-body">
                <h3 className="text-center text-gray">Productos Eliminados</h3>
                <div className="row">
                  {productosEliminados.map((producto) => (
                    <div key={producto.id} className="col-md-4 mb-4">
                      <div className="product-card">
                        <img
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          className="card-img-top"
                        />
                        <div className="product-info">
                          <h5 className="card-title">{producto.nombre}</h5>
                          <p className="card-text">${producto.precio}</p>
                          <button
                            className="btn btn-success"
                            onClick={() => restaurarProducto(producto.id)}
                          >
                            Restaurar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      

      {/* Modal para editar producto */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <input
              type="text"
              value={productoEditar?.nombre || ""}
              onChange={(e) => setProductoEditar({ ...productoEditar, nombre: e.target.value })}
              placeholder="Nombre"
              className="mb-3"
            />
            <input
              type="number"
              value={productoEditar?.precio || ""}
              onChange={(e) => setProductoEditar({ ...productoEditar, precio: e.target.value })}
              placeholder="Precio"
              className="mb-3"/>
            <input
              type="text"
              value={productoEditar?.imagen_url || ""}
              onChange={(e) => setProductoEditar({ ...productoEditar, imagen_url: e.target.value })}
              placeholder="Imagen URL"
              className="mb-3"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleGuardarEdicion}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={showModalEliminar} onHide={() => setShowModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este producto?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminarProducto}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar cierre de sesión */}
      <Modal show={showModalSesion} onHide={handleCancelarCerrarSesion}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cierre de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelarCerrarSesion}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmarCerrarSesion}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};