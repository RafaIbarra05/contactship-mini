import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeadDto } from './dto/create-lead-dto';
import Redis from 'ioredis';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly LeadsRepo: Repository<Lead>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    @InjectQueue('leads')
    private readonly leadsQueue: Queue,
  ) {}

  async createLead(dto: CreateLeadDto) {
    const exists = await this.LeadsRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Lead already exist');

    const lead = this.LeadsRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      source: 'manual',
    });
    return this.LeadsRepo.save(lead);
  }
  getLeads() {
    return this.LeadsRepo.find({ order: { createdAt: 'DESC' } });
  }
  async getLeadById(id: string): Promise<Lead> {
    const cacheKey = `lead:${id}`;

    const cachedLead = await this.redis.get(cacheKey);
    if (cachedLead) {
      console.log('[CACHE] Lead returned from Redis');
      return JSON.parse(cachedLead) as Lead;
    }

    const lead = await this.LeadsRepo.findOne({ where: { id } });
    console.log('[DB] Lead returned from database');
    if (!lead) throw new NotFoundException('Lead not found');

    await this.redis.set(cacheKey, JSON.stringify(lead), 'EX', 60);
    return lead;
  }

  async createdExternalId(data: {
    externalId: string;
    fullname: string;
    email: string;
    phone?: string;
  }) {
    const exists = await this.LeadsRepo.findOne({
      where: { externalId: data.externalId },
    });
    if (exists) return;

    const lead = this.LeadsRepo.create({
      ...data,
      source: 'external',
    });
    await this.LeadsRepo.save(lead);
  }

  async getLeadByIdNoCache(id: string) {
    const lead = await this.LeadsRepo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async saveLeadSummary(
    id: string,
    data: { summary: string; next_action: string },
  ) {
    const lead = await this.getLeadByIdNoCache(id);

    lead.summary = data.summary;
    lead.nextAction = data.next_action;

    await this.LeadsRepo.save(lead);
  }

  async enqueueSumarizeLead(leadId: string) {
    await this.getLeadByIdNoCache(leadId);
    const job = await this.leadsQueue.add(
      'summarize-lead',
      { leadId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
        jobId: `summarize:${leadId}`,
      },
    );

    return { jobId: job.id };
  }
}
