"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Inicio de sesión exitoso");
        router.push("/productos");
      } else {
        alert(data.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  const handleGoHome = () => {
    router.push("/"); // Redirige al inicio
  };

  return (
    <div className="container-fluid h-screen flex justify-center items-center login-background relative">
      {/* Botón "Ir al Inicio" en la parte superior izquierda */}
      <button
        onClick={handleGoHome}
        className="absolute top-4 left-4 px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500"
      >
        Ir al Inicio
      </button>

      {/* Tarjeta de login */}
      <div className="login-card p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-light mb-6 text-3xl font-semibold">Iniciar Sesión</h2>
        
        {/* Formulario de login */}
        <form onSubmit={handleLogin} className="w-full">
          <div className="form-group mb-6">
            <label htmlFor="email" className="text-light text-lg">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-control login-input w-full p-3 text-lg rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-6">
            <label htmlFor="password" className="text-light text-lg">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control login-input w-full p-3 text-lg rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* Botón de iniciar sesión */}
          <button
            type="submit"
            className="btn login-button w-full py-2 px-4 text-xl text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-md transition-all"
          >
            Iniciar Sesión
          </button>

          {/* Enlace de registro */}
          <p className="text-center text-light mt-4 text-lg">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-decoration-none text-blue-400 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
