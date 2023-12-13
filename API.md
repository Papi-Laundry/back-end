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
> - authOwner
> - authLaundry

Body
> - name (string)
> - price (number)
> - description (string)
> - categoryId (number)
> - image (string)

Response (200)
> - id
> - name (string)
> - price (number)
> - description (string)
> - category (string)
> - image (String)