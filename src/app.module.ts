import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RepositoryModule } from './infrastructure/repositories/repository.module';
import { ServiceModule } from './application/services/service.module';
import { ControllerModule } from './presentation/controllers/controller.module';
import { SeederModule } from './infrastructure/database/seeders/seeder.module';
import { DataSeeder } from './infrastructure/database/seeders/data.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RepositoryModule,
    ServiceModule,
    ControllerModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSeeder: DataSeeder) {}

  async onModuleInit() {
    // Seed the database on application startup
    await this.dataSeeder.seed();
  }
}
