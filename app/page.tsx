"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from 'next/link';
import Image from 'next/image';


export default function Index() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-4">
        <div className="container">
          {/* Logo - Centrando y aumentando el tamaño */}
          <Link href="/" className="navbar-brand mx-auto">
          < Image
              src="https://images.vexels.com/media/users/3/200098/isolated/lists/7ad7c76da9a0cd7d2b01b64b2590617b-icono-de-carrito-de-compras-icono-de-carrito-de-compras.png" // Asegúrate de tener tu imagen de logo en la carpeta 'public'
              alt="ProductosOnline"
              style={{ width: '50', height: '30' }} // Aumenta el ancho aquí
              className="d-block mx-auto"
          />
      </Link>
p
          {/* Botón de login */}
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-light ms-3"
              onClick={() => router.push('/login')}
            >
              Ingrese aquí
            </button>
          </div>
        </div>
      </nav>

      {/* Carrusel */}
      <div className="carousel-container">
        <Carousel className="mt-4">
          <Carousel.Item>
            <Image
              className="d-block w-100"
              src="https://th.bing.com/th/id/OIG4.r1IKq.qnXVbwjAgcQdMT?w=1024&h=1024&rs=1&pid=ImageDetMain"
              alt="Comida 1"
            />
          </Carousel.Item>
          <Carousel.Item>
            <Image
              className="d-block w-100"
              src="https://th.bing.com/th/id/OIG4.XAhDGU58e_ygduQpDnsN?pid=ImageGn"
              alt="Comida 2"
            />
          </Carousel.Item>
          <Carousel.Item>
            <Image
              className="d-block w-100"
              src="https://th.bing.com/th/id/OIG4.925rkf2lqRtO57.XNTe3?pid=ImageGn"
              alt="Comida 3"
            />
          </Carousel.Item>
          <Carousel.Item>
            <Image
              className="d-block w-100"
              src="https://th.bing.com/th/id/OIG4.tHfddJ4sK7HZnZRrKIAM?pid=ImageGn"
              alt="Comida 4"
            />
          </Carousel.Item>
        </Carousel>

        {/* Texto de Bienvenida - Siempre en el centro */}
        <div className="carousel-caption-container">
          <div className="carousel-caption-content">
            <h1>El catálogo más completo de productos</h1>
            <p>¡Diversas comidas y mucho más!</p>
          </div>
        </div>
      </div>

      {/* Descripción del trabajo */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-6">
            <h2 className="text-center">Bienvenido a ProductosOnline</h2>
            <p className="lead">
              Somos la tienda online con el catálogo más completo de productos de alimentos, bebidas y mucho más. Ofrecemos una experiencia de compra única, con productos de calidad, atención al cliente excepcional y un proceso de compra rápido y seguro. ¡Explora nuestro catálogo y encuentra todo lo que necesitas!
            </p>
          </div>
          <div className="col-lg-6">
            <Image
              src="https://th.bing.com/th/id/OIG1.VTcfpw9mnwaQl6_WoVcj?w=1024&h=1024&rs=1&pid=ImageDetMain"
              alt="Productos"
              className="Image-fluid rounded"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p>© 2024 ProductosOnline. Todos los derechos reservados.</p>
          <button
            className="btn btn-light rounded-circle"
            onClick={scrollToTop}
            style={{ position: 'fixed', bottom: '20px', right: '20px', fontSize: '24px' }}
          >
            <i className="fas fa-arrow-circle-up"></i>
          </button>
        </div>
      </footer>
    </div>
  );
}
