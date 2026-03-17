import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';
import { generateUserId } from '../../helpers/uuid-generator.js';

export const User = sequelize.define(
  'User',
  {
    Id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      field: 'id',
      defaultValue: () => generateUserId(),
    },
    Username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'username',
      validate: {
        notEmpty: { msg: 'El nombre de usuario es obligatorio.' },
        len: {
          args: [3, 50],
          msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres.',
        },
      },
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'email',
      validate: {
        isEmail: { msg: 'Debe ser un correo válido.' },
      },
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password',
      validate: {
        notEmpty: { msg: 'La contraseña es obligatoria.' },
      },
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'name',
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio.' },
      },
    },
    Surname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'surname',
    },
    Status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'status',
    },
    LastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login',
    },
    CreatedAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);
