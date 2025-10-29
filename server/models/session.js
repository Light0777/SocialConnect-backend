// const { DataTypes } = require('sequelize'); // already have this
// const sequelize = require('../db');
// const crypto = require('crypto');

// const Session = sequelize.define('Session', {
//   token: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false
//   },
//   csrfToken: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   status: {
//     type: DataTypes.ENUM('valid', 'expired'),
//     defaultValue: 'valid'
//   },
//   expiresAt: {
//     type: DataTypes.DATE, // <- use DataTypes.DATE, not Sequelize.DATE
//     allowNull: false
//   }
// });

// // Generate token
// Session.generateToken = () => {
//   return new Promise((resolve, reject) => {
//     crypto.randomBytes(16, (err, buf) => {
//       if (err) return reject(err);
//       resolve(buf.toString('hex'));
//     });
//   });
// };

// module.exports = Session;

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const crypto = require('crypto');

const Session = sequelize.define('Session', {
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  csrfToken: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('valid', 'expired'), defaultValue: 'valid' },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  tenantId: { type: DataTypes.STRING, allowNull: false } // added
});


// generate random token
Session.generateToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) return reject(err);
      resolve(buf.toString('hex'));
    });
  });
};

module.exports = Session;
