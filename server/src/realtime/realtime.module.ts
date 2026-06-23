import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProjectGateway } from './project.gateway';

@Module({
  imports: [AuthModule],
  providers: [ProjectGateway],
  exports: [ProjectGateway],
})
export class RealtimeModule {}
