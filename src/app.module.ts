import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './model/users/users.module';
import { CountryModule } from './model/country/country.module';

@Module({
  imports: [UsersModule, CountryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
