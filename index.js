import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import {connectDB}  from "./Config/db.js";
import authRoutes from "./Routes/auth.js";
import clientRoutes from "./Routes/client.js";
import generalRoutes from "./Routes/general.js";
import managementRoutes from "./Routes/management.js";


/* Configuration */

const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

/* Database connection & Server */
const PORT = process.env.PORT || 9000;

connectDB().then(() => 
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    })
).catch((error) => {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1);
});


/* Routes */

app.use("/api/v1/auth",authRoutes );
app.use("/api/v1/client",clientRoutes );
app.use("/api/v1/general",generalRoutes );
app.use("/api/v1/mangement",managementRoutes );



// Error handling middleware

app.use((req, res, next) => {
    res.status(404).send('Not Found');
    next();
  });
  
// Global error handler
// This middleware will catch any errors that occur in the application

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});


