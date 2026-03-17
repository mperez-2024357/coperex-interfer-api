import bcrypt from 'bcrypt';


export const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Nivel de seguridad estándar
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Error al hashear la contraseña: ' + error.message);
  }
};


export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error al comparar contraseña: ' + error.message);
  }
};
