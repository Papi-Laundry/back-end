function error(err, _, res, __) {
  switch (err.name) {
    case "SequelizeValidationError" :
    case "SequelizeUniqueConstraintError": {
      res.status(400).json({ message: err.errors[0].message })
      break
    }
    case "InvalidLogin": {
      res.status(400).json({ message: "Invalid Login" })
      break
    }
    case "SyntaxError":
    case "JsonWebTokenError":
    case "InvalidToken": {
      res.status(401).json({ message: "Invalid Token" })
      break
    }
    case "Forbidden": {
      res.status(403).json({ message: "Forbidden" })
      break;
    }
    case "InvalidParams":
    case "NotFound": {
      res.status(404).json({ message: "Not Found" })
      break
    }
  }
}

module.exports = error;
