import User from './User';
import Role from './Role';
import UserRole from './UserRole';


//User <-> Role many-to-many through UserRole
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', otherKey: 'role_id' });

//Role <-> User many-to-many through UserRole
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', otherKey: 'user_id' });

//User <-> UserRole one-to-many
User.hasMany(UserRole, { foreignKey: 'user_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });

//Role <-> UserRole one-to-many
Role.hasMany(UserRole, { foreignKey: 'role_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });


export {
  User,
  Role,
  UserRole,
};