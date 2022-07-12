import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { BlogController } from './blog/blog.controller';
import { UsermanagerService } from './usermanager/usermanager.service';
import { PromptManagerService } from './prompt-manager/prompt-manager.service';

@Module({
  imports: [EventsModule],
  controllers: [BlogController],
  providers: [UsermanagerService, PromptManagerService],
})
export class AppModule { }
