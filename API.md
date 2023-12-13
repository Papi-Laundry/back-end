## JOIN : ZAKI

### POST /login
Body
> - usernameOrEmail
> - password

### POST /register
Body
> - username
> - email
> - password

### POST /laundries/:laundryId/products
Auth
> - authorization
> - authLaundry

Body
> - name (string)
> - price (number)
> - description (string)
> - categoryId (number)
> - image (string)

Response (200)
> - id
> - name (string, required)
> - price (number, required)
> - description (string, required)
> - category (string, required)
> - image (string, required)
> - createdAt (date)

### PUT /laundries/:laundryId/products
Auth
> - authorization
> - authLaundry

Body
> - name (string)
> - price (number)
> - description (string)
> - categoryId (number)
> - image (String)

Response (200)
> - id
> - name (string)
> - price (number)
> - description (string)
> - category (string)
> - image (string)
> - updatedAt (date)