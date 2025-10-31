const User = require('./models/user');
const Tenant = require('./models/tenant');

// Define relationships
User.belongsTo(Tenant, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
Tenant.hasMany(User, { foreignKey: 'tenantId' });

module.exports = { User, Tenant };
