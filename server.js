require("dotenv").config();
var express = require("express");
var app = express();
var mongoose = require("mongoose");
const morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const compression = require("compression");
var HashMap = require("hashmap");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const shouldCompress = (req, res) => {
  if (req.headers["x-no-compression"]) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};
app.use(
  compression({
    // filter: Decide if the answer should be compressed or not,
    // depending on the 'shouldCompress' function above
    filter: shouldCompress,
    // threshold: It is the byte threshold for the response
    // body size before considering compression, the default is 1 kB
    threshold: 0,
  })
);

// app.use(compression());
app.use(cors({ credentials: true, origin: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  helmet({
    xssFilter: true,
    contentSecurityPolicy: false,
    referrerPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(helmet.frameguard({ action: "deny" })); // Sets X-Frame-Options header to DENY
app.use(helmet.noSniff()); // Sets X-Content-Type-Options header to nosniff
app.use(helmet.hsts({ maxAge: 60000, includeSubDomains: true })); // Sets Strict-Transport-Security header
// app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: [] } }));

app.use(function (err, req, res, next) {
  console.log("err.message APP Middleware", err.message);
  return res.status(500).json({
    success: false,
    data: null,
    message: err.message,
  });
});

app.use(bodyParser.json({ limit: "50mb", extended: true }));
//invalid JSON error handling
app.use(function (err, req, res, next) {
  console.log("err", err.message, "body" in err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(403).send({
      success: false,
      data: null,
      message: "Invalid Body.",
    });
  } else {
    next();
  }
});
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

if (process.env.NODE_ENV === "production") {
  mongoose.connect(
    process.env.DBURL,
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
      // sslCert: `${__dirname}/mongoCACert.pem`,
      // sslKey: `${__dirname}/mongoCACert.pem`
    },
    function (err) {
      if (err) {
        console.log("err--------------------------", err);
      } else {
        console.log("Prod DB Connected.");
      }
    }
  );
} else {
  try {
    const connect = async () => {
      const connect = await mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      if (connect) {
        console.log("Dev DB Connected.");
      } else {
        console.info("DB Not Connected");
      }
    };
    connect();
  } catch (error) {
    console.error("err in db connection--------------------------", error);
  }
}
app.use(morgan("combined"));

const swaggerOptions = swaggerJSDoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Node Assignment",
      version: "1.0.0",
      description: "Project-management application",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "development server",
      },
    ],
  },
  apis: ["./app/routes/*.js", "./app/userApp/*/*.js"],
});
app.use("/swagger/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

require("./app/routes")(app);
module.exports = app;

var server = app.listen(process.env.PORT, () => {
  console.log(`server listening on ${process.env.PORT}`);
});
