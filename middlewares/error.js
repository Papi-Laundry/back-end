function error(err, _, res, __) {
  switch (err.name) {
    case "SequelizeValidationError" :
    case "SequelizeUniqueConstraintError": {
      res.status(400).json({ message: err.errors[0].message })
      break
    }
    case "SequelizeLocation" : {
      res.status(400).json({ message: "Map is invalid" })
      break
    }
    case "SequelizeDatabaseError" : {
      res.status(400).json({ message: "Invalid Data Type" })
      break
    }
    case "SequelizeForeignKeyConstraintError" : {
      const field = err.index.split('_')
      res.status(404).json({ message: `${field[1]} Not Found`})
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
    case "InvalidCoord": {
      res.status(400).json({ message: "Input Latitude&Longitude" })
      break
    }
    case "InvalidTransaction": {
      res.status(400).json({ message: "Input is required" })
      break
    }
  }
}

module.exports = error;
