import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import Redis from 'ioredis';
import { AiService } from 'src/ai/ai.service';
import { LeadsService } from 'src/leads/leads.service';

type SummarizedLeadJob = {
  leadId: string;
};
@Processor('leads')
export class SummarizeLeadProcessor extends WorkerHost {
  private readonly logger = new Logger(SummarizeLeadProcessor.name);
  constructor(
    private readonly leadsService: LeadsService,
    private readonly iaService: AiService,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {
    super();
  }

  async process(job: Job<SummarizedLeadJob>): Promise<void> {
    if (job.name !== 'summarize-lead') return;

    const { leadId } = job.data;
    this.logger.log(`Processing summarize-lead for leadId=${leadId}`);

    const lead = await this.leadsService.getLeadByIdNoCache(leadId);

    const result = await this.iaService.summarizeLead({
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
    });
    await this.leadsService.saveLeadSummary(leadId, result);

    await this.redis.del(`lead:${lead.id}`);

    this.logger.log(`Summarized completed for leadId:${leadId}`);
  }
}
