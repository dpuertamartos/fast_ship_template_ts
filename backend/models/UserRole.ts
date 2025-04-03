import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';

class UserRole extends Model {}

UserRole.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
    roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'role',
            key: 'id',
        }
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
    }   
}, {
    sequelize,
    modelName: 'user_role',
    tableName: 'user_role',
    timestamps: false,
    underscored: true,
});

export default UserRole;