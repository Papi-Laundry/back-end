function error(err, _, res, __) {
  switch(err.name) {
    case 'SyntaxError':
    case 'JsonWebTokenError':
    case 'InvalidToken': {
      res.status(401).json({ message: 'Invalid Token' })
    }
    case 'NotFound': {
      res.status(404).json({ message: "Not Found" })
    }
  }
}

module.exports = error