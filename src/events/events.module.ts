import { Module } from '@nestjs/common';
import { PromptManagerService as PromptManagerService } from 'src/prompt-manager/prompt-manager.service';
import { UsermanagerService } from 'src/usermanager/usermanager.service';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway, UsermanagerService, PromptManagerService],
})
export class EventsModule { }
