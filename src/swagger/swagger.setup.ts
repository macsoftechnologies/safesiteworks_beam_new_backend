import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Call this in main.ts after creating the app:
 *
 *   setupSwagger(app);
 *   await app.listen(3000);
 *
 * Then open: http://localhost:3000/api
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Employee Management API')
    .setDescription(
      'REST API for managing employees, departments, sub-contractors, and activity logs.',
    )
    .setVersion('1.0')
    // Uncomment if you add JWT auth later:
    // .addBearerAuth()
    .addTag('Employees', 'CRUD operations for all employee types')
    .addTag('Health', 'Service health check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,   // keeps the auth token between page refreshes
      tagsSorter: 'alpha',          // alphabetical tag order in UI
      operationsSorter: 'method',   // GET → POST → PUT → DELETE order per tag
    },
    customSiteTitle: 'Employee API Docs',
  });
}