import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeadDto } from './dto/create-lead-dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly LeadsRepo: Repository<Lead>,
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
  async getLeadById(id: string) {
    const lead = await this.LeadsRepo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }
}
