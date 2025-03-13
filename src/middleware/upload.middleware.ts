import multer from 'multer';
import fs from 'fs';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const ensureUploadsDirExists = () => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (error) {
            console.error(`Error creating directory ${dir}:`, error);
            throw new Error(`Error creating directory ${dir}: ${error}`);
        }
    }
};

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow Excel files only
    if (file.mimetype === 'application/vnd.ms-excel' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    } else {
        cb(null, false); // reject file
        cb(new Error('Only .xls and .xlsx files are allowed!'));
    }
};

const storage = multer.diskStorage({
    destination: 'uploads/', // Ensure this directory exists or is created dynamically
    filename: (_req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ storage, fileFilter }).single('file');

const uploadMiddleware = (): RequestHandler => {
    ensureUploadsDirExists(); // Ensure directory exists before the middleware is used
    return (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // Handle Multer-specific errors here
                return res.status(400).json({ message: `Multer error: ${err.message}` });
            } else if (err) {
                // Handle file type errors here
                return res.status(400).json({ message: err.message });
            }
            // If no error, proceed to the next middleware
            next();
        });
    };
};

export default uploadMiddleware;
