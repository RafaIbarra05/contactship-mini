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

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly LeadsRepo: Repository<Lead>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
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
      try {
        return JSON.parse(cachedLead) as Lead;
      } catch {
        await this.LeadsRepo.delete(cacheKey);
      }
    }

    const lead = await this.LeadsRepo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');

    await this.redis.set(cacheKey, JSON.stringify(lead), 'EX', 60);
    return lead;
  }
}
