import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from '../jwt-auth.guard';
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService,JwtAuthGuard]
  
})
export class UsersModule {}
