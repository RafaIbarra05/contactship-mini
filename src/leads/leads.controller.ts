import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead-dto';
import { LeadsService } from './leads.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('create-lead')
  createLeads(@Body() dto: CreateLeadDto) {
    return this.leadsService.createLead(dto);
  }

  @Get('leads')
  getLeads() {
    return this.leadsService.getLeads();
  }

  @Get('lead/:id')
  getLeadById(@Param('id') id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Post('leads/:id/summarize')
  summarizeLead(@Param('id') id: string) {
    return this.leadsService.enqueueSumarizeLead(id);
  }
}
