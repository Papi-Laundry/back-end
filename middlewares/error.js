function error(err, req, res, next) {
  switch(err.name) {
    case 'InvalidToken' : {
      res.status(401).json({ message: 'Invalid Token' })
    }
  }
}

module.exports = error