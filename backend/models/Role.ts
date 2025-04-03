import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';

class Role extends Model {}   

Role.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,    
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'role',
  tableName: 'role',
  timestamps: false,
  underscored: true,    
});

export default Role;