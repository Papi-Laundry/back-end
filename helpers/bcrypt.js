const bcrypt = require('bcryptjs')

function hashPassword(passwordInput) {
  return bcrypt.hashSync(passwordInput)
}

function comparePassword(passwordInput, passwordDatabase) {
  return bcrypt.compareSync(passwordInput, passwordDatabase)
}

module.exports = {
  hashPassword,
  comparePassword
}