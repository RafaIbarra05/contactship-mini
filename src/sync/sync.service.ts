import { Injectable, Logger } from '@nestjs/common';
import { LeadsService } from 'src/leads/leads.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(private readonly leadsService: LeadsService) {}
}
