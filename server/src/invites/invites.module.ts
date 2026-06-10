import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

@Module({
  imports: [AuthModule, ProjectsModule],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
