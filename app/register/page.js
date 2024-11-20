"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", { nombre: name, email, password });
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: name, email, password }),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      if (res.ok) {
        alert("Registro exitoso");
        router.push("/login");
      } else {
        alert(data.message || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="container-fluid h-screen d-flex justify-content-center align-items-center register-background">
      <div className="register-card p-5 rounded shadow-lg">
        <h2 className="text-center text-light mb-4">Registrarse</h2>
        <form onSubmit={handleRegister} className="w-100">
          <div className="form-group mb-4">
            <label htmlFor="name" className="text-light">Nombre</label>
            <input
              type="text"
              id="name"
              className="form-control register-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="email" className="text-light">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-control register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="text-light">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-lg btn-primary w-100 register-button">
            Registrarse
          </button>
          <p className="text-center text-light mt-4">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-decoration-none text-primary">
              Inicia sesión aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
