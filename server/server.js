const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const PORT = process.env.PORT || 3000

dotenv.config()
const app = express()

// logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// auth and api routes
app.use('/api', require('./api'))

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
