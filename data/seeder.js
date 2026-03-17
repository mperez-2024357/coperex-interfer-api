import { User } from '../src/auth/user.model.js';
import { Role, UserRole } from '../src/auth/role.model.js';
import { hashPassword } from '../utils/password-utils.js';
import { ADMIN_ROLE } from '../helpers/role-constants.js';


export const seedAdminUser = async () => {
  try {
    let adminRole = await Role.findOne({
      where: { Name: ADMIN_ROLE },
    });

    if (!adminRole) {
      adminRole = await Role.create({
        Name: ADMIN_ROLE,
      });
      console.log('✓ Rol ADMIN_ROLE creado correctamente');
    } else {
      console.log('Rol ADMIN_ROLE ya existe');
    }

    const adminExists = await User.findOne({
      where: { Username: 'admin' },
    });

    if (adminExists) {
      console.log(' Usuario admin ya existe');
      return;
    }

    const hashedPassword = await hashPassword('Admin@Interfer123');

    const adminUser = await User.create({
      Username: 'admin',
      Email: 'admin@coperex-interfer.com',
      Password: hashedPassword,
      Name: 'Administrador',
      Surname: 'Interfer',
      Status: true,
    });

    await UserRole.create({
      UserId: adminUser.Id,
      RoleId: adminRole.Id,
    });

  } catch (error) {
    console.error('Error durante el seed del usuario admin:', error.message);
  }
};
