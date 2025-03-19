import { forwardRef, Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  imports: [forwardRef(() => FavoritesModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
