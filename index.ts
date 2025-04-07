import "express-async-errors";
import express , { Express} from "express"
import connectDB from "./connectDB/connect"
import adminRouter from "./routers/admin";
import { errorHandler } from "./middleware/handleError";
import { notFound } from "./middleware/notFound";
import authRouter from "./routers/auth";
import clientRouter from "./routers/client";
import { checkAuth } from "./middleware/authentication";
import checkAdmin from "./middleware/adminCheck";
import userRouter from "./routers/user";
import newsRouter from "./routers/news";
import tagRouter from "./routers/tag";
import categoryRouter from "./routers/category";
import documentsRouter from "./routers/documents";
import invoiceDocumentsRouter from "./routers/invoiceDocuments";

require("dotenv").config();

const port = 5000;

const app : Express = express()
app.use(express.json())

app.use('/api/v1', authRouter)
app.use('/api/v1', checkAuth, userRouter)
app.use('/api/v1', checkAuth, checkAdmin , tagRouter)
app.use('/api/v1', checkAuth, checkAdmin , documentsRouter)
app.use('/api/v1', checkAuth, checkAdmin , tagRouter)
app.use('/api/v1', checkAuth, checkAdmin ,adminRouter)
app.use('/api/v1', checkAuth, checkAdmin ,clientRouter)
app.use('/api/v1', checkAuth, checkAdmin , categoryRouter)
app.use('/api/v1', checkAuth, checkAdmin ,newsRouter)
app.use('/api/v1', checkAuth, checkAdmin ,invoiceDocumentsRouter)


app.use(notFound)
app.use(errorHandler)


const connect = async () => {
    try {
      await connectDB(process.env.MONGO_URI!);
      app.listen(port, () => {
        console.log("listening on port 5000");
      });
    } catch (error) {
      console.log(error);
    }
  };
  
connect();