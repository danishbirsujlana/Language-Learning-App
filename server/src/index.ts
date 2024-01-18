import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import CONFIG from "./config";
import AuthRoutes from "./routes/authRoutes";

const app = express();
app.use(cors());
app.use(express.json());
const port = CONFIG.PORT;

const connectDB = async () => {
    try {
        await mongoose.connect(CONFIG.DB_URL)
        console.log("DB sucess");
    } catch (err) {
        console.log(err, "Mongo Connect Error");
    }
};

connectDB();

app.use('/api/auth', AuthRoutes);
app.get('/api', (req: Request, res: Response) => {
    res.send("Welcome");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});