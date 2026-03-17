import { User } from './user.model.js';
import { Role, UserRole } from './role.model.js';
import { hashPassword, comparePassword } from '../../utils/password-utils.js';
import { generateToken } from '../../helpers/generate-jwt.js';
import { ADMIN_ROLE } from '../../helpers/role-constants.js';
import { Op } from 'sequelize';

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ Email: emailOrUsername }, { Username: emailOrUsername }],
      },
      include: {
        model: UserRole,
        as: 'UserRoles',
        include: {
          model: Role,
          as: 'Role',
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos',
      });
    }

    const isPasswordValid = await comparePassword(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos',
      });
    }

    const isAdmin = user.UserRoles?.some((ur) => ur.Role?.Name === ADMIN_ROLE);

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden acceder a este sistema',
      });
    }

    if (!user.Status) {
      return res.status(403).json({
        success: false,
        message: 'El usuario ha sido desactivado',
      });
    }

    await user.update({ LastLogin: new Date() });

    const token = await generateToken({
      userId: user.Id,
      email: user.Email,
      username: user.Username,
      role: ADMIN_ROLE,
    });

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user.Id,
          name: user.Name,
          surname: user.Surname,
          email: user.Email,
          username: user.Username,
        },
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
    });
  }
};


export const register = async (req, res) => {
  try {
    const { name, surname, username, email, password } = req.body;
    const currentUserId = req.user?.userId; // Obtenido del middleware JWT

    const currentUser = await User.findByPk(currentUserId, {
      include: {
        model: UserRole,
        as: 'UserRoles',
        include: {
          model: Role,
          as: 'Role',
        },
      },
    });

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: usuario no encontrado',
      });
    }

    const isAdmin = currentUser.UserRoles?.some(
      (ur) => ur.Role?.Name === ADMIN_ROLE
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden crear nuevos administradores',
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ Username: username }, { Email: email }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario o correo ya está registrado',
      });
    }

    const adminRole = await Role.findOne({ where: { Name: ADMIN_ROLE } });

    if (!adminRole) {
      return res.status(500).json({
        success: false,
        message: 'Rol de administrador no configurado',
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      Name: name,
      Surname: surname,
      Username: username,
      Email: email,
      Password: hashedPassword,
      Status: true,
    });

    await UserRole.create({
      UserId: newUser.Id,
      RoleId: adminRole.Id,
    });

    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      data: {
        id: newUser.Id,
        name: newUser.Name,
        surname: newUser.Surname,
        email: newUser.Email,
        username: newUser.Username,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear administrador',
    });
  }
};
