// Libraries
let express = require('express')
let router = express.Router()
let knex = require('knex')({client: 'pg', connection: process.env.DATABASE_URL})
let bodyParser = require('body-parser')
let cors = require('cors')
let multer = require('multer')

// Configuration constants
const PORT = 3000

// Create web server
let app = express()

// Add public static file support
app.use(express.static('public'))

// Parse application/json form post bodies
app.use(bodyParser.json())

// Parse older form bodies, and uploads
app.use(bodyParser.urlencoded({ extended: true }))

// Enable CORS for cross-domain ajax requests
app.use(cors())

// Handle file uploads
const STORAGE = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'public/uploads/') },
  filename: (req, file, cb) => { cb(null, file.originalname) }
})
let uploads = multer({ storage: STORAGE })

// Setup routes
let routesApiV1 = require('./routes-api-v1').setup(router, uploads, knex)
app.use('/api/v1', routesApiV1)

// Start the web server, listen for incoming web requests
app.listen(PORT, () => {
  console.log('Web server running at http://localhost:' + PORT)
})