import bcrypt from 'bcrypt';
import { Role } from '../modules/roles/entities/role.entity.js';
import { UserRoles } from '../modules/roles/enums/index.js';
import { User } from '../modules/users/entities/user.entity.js';
import { ResourceCategory } from '../modules/resource-categories/entities/resource-category.entity.js';
import { Resource } from '../modules/resources/entities/resource.entity.js';
import { seedDataSource } from './seed-data-source.js';

const rolesSeed = Object.values(UserRoles);

const usersSeed = [
  {
    name: 'Administrador de prueba',
    email: 'admin.seed@example.com',
    roleName: UserRoles.ADMIN,
  },
  {
    name: 'Empleado de prueba',
    email: 'staff.seed@example.com',
    roleName: UserRoles.STAFF,
  },
  {
    name: 'Cliente de prueba',
    email: 'client.seed@example.com',
    roleName: UserRoles.CLIENT,
  },
];

const resourceCategoriesSeed = [
  { name: 'COMPUTADORAS', description: 'Computadoras y equipo' },
  { name: 'SALAS DE REUNIONES', description: 'Salas para reuniones' },
];

const resourcesSeed = [
  {
    name: 'Laptop de prueba',
    code: 'LAPTOP-01',
    description: 'Computadora portátil para trabajo y actividades de oficina',
    categoryName: 'COMPUTADORAS',
  },
  {
    name: 'Sala norte',
    code: 'ROOM-01',
    description: 'Sala equipada para reuniones de trabajo y colaboración',
    categoryName: 'SALAS DE REUNIONES',
  },
];

const seed = async () => {
  const password = process.env.SEED_PASSWORD;

  if (!password) {
    throw new Error('Define SEED_PASSWORD in your file .env');
  }

  await seedDataSource.initialize();

  try {
    const rolesRepo = seedDataSource.getRepository(Role);
    const usersRepo = seedDataSource.getRepository(User);
    const resourceCategoriesRepo =
      seedDataSource.getRepository(ResourceCategory);
    const resourcesRepo = seedDataSource.getRepository(Resource);

    // Roles
    const rolesMap = new Map<UserRoles, Role>();
    for (const name of rolesSeed) {
      let role = await rolesRepo.findOneBy({ name });

      if (!role) {
        role = await rolesRepo.save(rolesRepo.create({ name }));
      }

      rolesMap.set(name, role);
    }

    // Users
    for (const data of usersSeed) {
      const existingUser = await usersRepo.findOneBy({ email: data.email });

      if (!existingUser) {
        const role = rolesMap.get(data.roleName);

        if (!role) {
          throw new Error(`Role not found: ${data.roleName}`);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await usersRepo.save(
          usersRepo.create({
            name: data.name,
            email: data.email,
            passwordHash,
            role,
          }),
        );
      }
    }

    // Resource Categories
    const resourceCategoriesMap = new Map<string, ResourceCategory>();
    for (const data of resourceCategoriesSeed) {
      let resourceCategory = await resourceCategoriesRepo.findOneBy({
        name: data.name,
      });

      if (!resourceCategory) {
        resourceCategory = await resourceCategoriesRepo.save(
          resourceCategoriesRepo.create(data),
        );
      }

      resourceCategoriesMap.set(data.name, resourceCategory);
    }

    // Resources
    for (const data of resourcesSeed) {
      const existingResource = await resourcesRepo.findOneBy({
        code: data.code,
      });

      if (!existingResource) {
        const resourceCategory = resourceCategoriesMap.get(data.categoryName);

        if (!resourceCategory) {
          throw new Error(`Resource category not found: ${data.categoryName}`);
        }

        await resourcesRepo.save(
          resourcesRepo.create({
            name: data.name,
            code: data.code,
            description: data.description,
            resourceCategory,
          }),
        );
      }
    }

    console.log('Seed completed');
  } finally {
    await seedDataSource.destroy();
  }
};

seed().catch((error: unknown) => {
  console.error('Error running seed:', error);
  process.exitCode = 1;
});
