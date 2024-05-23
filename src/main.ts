import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'app.module';
import { existsSync } from 'fs-extra';
import { join } from 'path';
import { sessionConfig } from 'app/config/session.config';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {

    // Check if .env file exists
    if (!existsSync('.env')) {
        const error = 'The .env file is missing. Please make sure it exists.';
        Logger.error(error, "MainApplication");
        throw new Error(error);
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const SERVER_ADDRESS = process.env.SERVER_ADDRESS || "127.0.0.1";
    const SERVER_PORT = process.env.SERVER_PORT || 3000;

    /**
     * Static view
     */
    app.useStaticAssets(join(__dirname, '..', 'src', 'assets'));
    app.setBaseViewsDir(join(__dirname, '..', 'src', 'app', 'views'));
    app.setViewEngine('hbs');

    /**
     * Set Global Prefix
     */
    if (process.env.SERVER_CONTEXT) {
        app.setGlobalPrefix(process.env.SERVER_CONTEXT);
    }

    /**
     * Set Session
     */
    if (process.env.ENABLE_SESSION === "true") {
        app.use(session(sessionConfig()));
        app.use(passport.initialize());
        app.use(passport.session());
    }

    /**
     * Enable CORS
     */
    app.enableCors();

    /**
     * Disable Debugging
     */
    if (process.env.ENABLE_DEBUGGING !== "true") {
        app.useLogger(false); 
    }

    /**
     * Swagger
     */
    if (process.env.SWAGGER_ENABLED === "true") {
        const config = new DocumentBuilder()
            .setTitle(process.env.SWAGGER_TITLE)
            .setDescription(process.env.SWAGGER_DESCRIPTION)
            .setVersion(process.env.SWAGGER_VERSION)
            .addSecurity('oauth2', { type: 'http', scheme: 'bearer'})
            .build();

        const document = SwaggerModule.createDocument(app, config);
        const context = process.env.SERVER_CONTEXT ? (process.env.SERVER_CONTEXT + '/swagger') : 'swagger';
        SwaggerModule.setup(context, app, document);
        Logger.log(`Swagger configured on http://localhost:3000/${context}`, "MainApplication");
    }
    
    await app.listen(SERVER_PORT, SERVER_ADDRESS, () => {
        Logger.log(`NestJS app is running on http://${SERVER_ADDRESS}:${SERVER_PORT}`, "MainApplication");
    });
}

bootstrap().catch(() => {
    process.exit(1);
});