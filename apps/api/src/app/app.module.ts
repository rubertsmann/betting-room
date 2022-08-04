import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { PromptManagerService } from './prompt-manager/prompt-manager.service';
import { UsermanagerService } from './usermanager/usermanager.service';

@Module({
  imports: [EventsModule],
  controllers: [AppController],
  providers: [AppService, UsermanagerService, PromptManagerService],
})
export class AppModule { }
