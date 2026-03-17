import { validationResult } from 'express-validator';
import { Company } from './company.model.js';

export const registerCompany = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array(),
      });
    }

    const {
      name,
      impactLevel,
      yearsOfExperience,
      businessCategory,
      description,
      contactPerson,
      email,
      phone,
      website,
    } = req.body;

    const existingCompany = await Company.findOne({ name: name.trim() });
    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una empresa registrada con ese nombre',
      });
    }

    const company = new Company({
      name,
      impactLevel,
      yearsOfExperience,
      businessCategory,
      description,
      contactPerson,
      email,
      phone,
      website,
      status: 'Activo',
      modifiedBy: req.user?.userId || 'system',
    });

    await company.save();

    return res.status(201).json({
      success: true,
      message: 'Empresa registrada exitosamente',
      data: company,
    });
  } catch (error) {
    console.error('Error registrando empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar la empresa',
      error: error.message,
    });
  }
};


export const getCompanies = async (req, res) => {
  try {
    const { businessCategory, yearsOfExperience, sort } = req.query;

    const filter = { status: 'Activo' };

    if (businessCategory) {
      filter.businessCategory = { $regex: businessCategory, $options: 'i' };
    }

    if (yearsOfExperience) {
      filter.yearsOfExperience = Number(yearsOfExperience);
    }

    let sortOption = { name: 1 };
    if (sort === 'az') {
      sortOption = { name: 1 };
    } else if (sort === 'za') {
      sortOption = { name: -1 };
    } else if (sort === 'years_asc') {
      sortOption = { yearsOfExperience: 1 };
    } else if (sort === 'years_desc') {
      sortOption = { yearsOfExperience: -1 };
    }

    const companies = await Company.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      message: 'Empresas obtenidas exitosamente',
      total: companies.length,
      data: companies,
    });
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las empresas',
      error: error.message,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Empresa obtenida exitosamente',
      data: company,
    });
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la empresa',
      error: error.message,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const {
      name,
      impactLevel,
      yearsOfExperience,
      businessCategory,
      description,
      contactPerson,
      email,
      phone,
      website,
      status,
    } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
      });
    }

    if (name && name !== company.name) {
      const duplicate = await Company.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otra empresa con ese nombre',
        });
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      {
        name,
        impactLevel,
        yearsOfExperience,
        businessCategory,
        description,
        contactPerson,
        email,
        phone,
        website,
        status,
        modifiedBy: req.user?.userId || 'system',
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Empresa actualizada exitosamente',
      data: updatedCompany,
    });
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la empresa',
      error: error.message,
    });
  }
};

