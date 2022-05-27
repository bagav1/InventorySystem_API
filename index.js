const apiRouter = require('./app/routes/api.routes')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

require('./app/models/db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port = process.env.PORT || 3000

app.use('/api', apiRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
