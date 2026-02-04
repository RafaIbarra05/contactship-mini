import { Injectable, Logger } from '@nestjs/common';
import { LeadsService } from 'src/leads/leads.service';
type RandomUserApiResponse = {
  results: Array<{
    login: { uuid: string };
    name: { first: string; last: string };
    email: string;
    phone: string;
  }>;
};

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(private readonly leadsService: LeadsService) {}

  async syncExternalLeads(): Promise<void> {
    this.logger.log('Starting external leads sync');
    try {
      const response = await fetch('https://randomuser.me/api/?results=10');

      if (!response.ok) {
        this.logger.error('Failed to fetch external leads');
        return;
      }
      const data = (await response.json()) as RandomUserApiResponse;

      for (const user of data.results) {
        await this.leadsService.createdExternalId({
          externalId: user.login.uuid,
          fullname: `${user.name.first} ${user.name.last}`,
          email: user.email,
          phone: user.phone,
        });
      }
      this.logger.log(
        `External leads sync finished (${data.results.length} processed)`,
      );
    } catch (error) {
      this.logger.error(
        'Unexpected error during external leads sync',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
