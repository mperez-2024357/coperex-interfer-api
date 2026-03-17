'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbConnection } from './db.js';
import { dbConnectionMongo } from './db-mongo.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/server-genericError-handler.js';
import { seedAdminUser } from '../data/seeder.js';

import authRoutes from '../src/auth/auth.routes.js';
import companiesRoutes from '../src/companies/company.routes.js';
import reportsRoutes from '../src/reports/report.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let swaggerDocument = {};
try {
    const swaggerFilePath = path.join(__dirname, '../swagger.yml');
    console.log('Loading swagger from:', swaggerFilePath);
    const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
    swaggerDocument = YAML.load(swaggerFile);
    console.log('✅ Swagger documentation loaded successfully');
} catch (error) {
    console.error('⚠️ Error loading swagger.yml:', error.message);
}

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(requestLimit);
    app.use(morgan('dev'));
    app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            url: '/swagger.json'
        },
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'COPEREX Interfer API - Documentación'
    }));

    app.use(`${BASE_PATH}/auth`, authRoutes);
    app.use(`${BASE_PATH}/companies`, companiesRoutes);
    app.use(`${BASE_PATH}/reports`, reportsRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'COPEREX Interfer API'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    });
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;

    app.set('trust proxy', 1);

    try {
        await dbConnection();
        await dbConnectionMongo();
        
        // Seed admin user and role automatically
        await seedAdminUser();
        
        middlewares(app);
        routes(app);

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`COPEREX Interfer API server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};
