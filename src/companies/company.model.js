import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la empresa es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [150, 'El nombre no puede exceder 150 caracteres'],
    },
    businessCategory: {
      type: String,
      required: [true, 'La categoría empresarial es obligatoria'],
      enum: {
        values: ['Tecnología', 'Manufactura', 'Servicios', 'Comercio', 'Otro'],
        message: 'Categoría no válida. Debe ser: Tecnología, Manufactura, Servicios, Comercio u Otro',
      },
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Los años de trayectoria son obligatorios'],
      min: [0, 'Los años no pueden ser negativos'],
      max: [200, 'Los años no pueden exceder 200'],
    },
    impactLevel: {
      type: String,
      required: [true, 'El nivel de impacto es obligatorio'],
      enum: {
        values: ['Bajo', 'Medio', 'Alto', 'Muy Alto'],
        message: 'Nivel de impacto no válido. Debe ser: Bajo, Medio, Alto o Muy Alto',
      },
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [100, 'El nombre del contacto no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Correo electrónico no válido'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'El teléfono no puede exceder 20 caracteres'],
    },
    website: {
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'URL no válida'],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    modifiedBy: {
      type: String,
      maxlength: [16, 'ID de usuario no válido'],
    },
    status: {
      type: String,
      default: 'Activo',
      enum: {
        values: ['Activo', 'Inactivo', 'Suspendido'],
        message: 'Estado no válido. Debe ser: Activo, Inactivo o Suspendido',
      },
    },
  },
  {
    timestamps: {
      createdAt: 'registrationDate',
      updatedAt: 'lastModified',
    },
    collection: 'companies',
  }
);

companySchema.index({ name: 1 });
companySchema.index({ businessCategory: 1 });
companySchema.index({ yearsOfExperience: 1 });
companySchema.index({ impactLevel: 1 });
companySchema.index({ status: 1 });

export const Company = mongoose.model('Company', companySchema);
