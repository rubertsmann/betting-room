import { Module } from '@nestjs/common';
import { PromptManagerService } from '../prompt-manager/prompt-manager.service';
import { UsermanagerService } from '../usermanager/usermanager.service';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway, UsermanagerService, PromptManagerService],
})
export class EventsModule { }
