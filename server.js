require('dotenv').config();
require('express-async-errors');

// Security Packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connectDB');

// Middlewares
const authenticateUser = require('./middlewares/authentication');

// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

app.use(express.json());

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100 // 100 requests per IP per windowMs allowed
}));
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send(`
    <h1>Jobs API</h1>
    <a href='/api-docs'>See Documentation</a>
  `);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// app.use('/api/v1/', mainRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URI);
    app.listen(port, console.log(`Server is running on port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

startServer();