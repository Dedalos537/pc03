import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/productos')
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al obtener productos', err));
  }, []);

  return (
    <div className="container">
      <div className="row">
        {productos.map((producto) => (
          <div key={producto.id} className="col-md-4">
            <div className="card">
              <img src={producto.imagen_url} className="card-img-top" alt={producto.nombre} />
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">Precio: ${producto.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
