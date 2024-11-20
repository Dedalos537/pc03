const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');
const sequelize = require('./db');
const path = require('path');

const app = express();
const PORT = 4000;

const JWT_SECRET = 'clave_secreta';

// Middleware de Autenticación y Autorización
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener token del encabezado

  if (!token) {
    return res.status(401).json({ error: 'No autorizado, token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = decoded; // Guardamos los datos del usuario decodificados
    next();
  });
};

const verificarRolAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
  }
  next();
};

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Configuración de Content-Security-Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' http://localhost:4000; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Servir favicon.ico desde la carpeta `public`
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor corriendo en http://localhost:4000');
});

// Ruta para obtener los datos del usuario autenticado
app.get('/api/user', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id); // Obtener el usuario usando el id decodificado del token
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario); // Devuelve los datos del usuario
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Sincronizar la base de datos y crear usuario administrador
app.listen(PORT, async () => {
  await sequelize.sync({ alter: true }); // Sincroniza la base de datos

  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  // Crear usuario administrador si no existe
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  const adminExists = await Usuario.findOne({ where: { email: adminEmail } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await Usuario.create({
      nombre: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      rol: 'admin',
    });
    console.log('Usuario administrador creado con éxito.');
  } else {
    console.log('Usuario administrador ya existe.');
  }
});

// Rutas para productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Solo admin puede agregar productos
app.post('/api/productos', verificarToken, verificarRolAdmin, async (req, res) => {
  const { nombre, precio, imagen_url } = req.body;
  try {
    const nuevoProducto = await Producto.create({ nombre, precio, imagen_url });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Eliminar un producto solo para admin
app.delete('/api/productos/:id', verificarToken, verificarRolAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await producto.destroy();
    res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Rutas para autenticación
app.post('/api/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log("Datos recibidos:", { nombre, email, password });

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password encriptado:", hashedPassword);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
    });
    console.log("Usuario creado:", nuevoUsuario);

    res.status(201).json({ message: 'Usuario registrado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});
