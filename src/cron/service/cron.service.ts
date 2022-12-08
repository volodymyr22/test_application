import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { CampainStatus } from 'src/types/campaign_status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(CampaignEntity)
    private campaignService: Repository<CampaignEntity>,
  ) {}

  @Cron('*/10 * * * * *', { name: 'checkExpiresStatuses' })
  async checkExpiresStatuses() {
    const campaigns = await this.campaignService.find();
    const mappedCampaigns = campaigns.map((campaign) => {
      if (new Date(campaign.expires_at).getTime() < new Date().getTime()) {
        campaign.status = CampainStatus.expired;
      }
      return campaign;
    });
    await this.campaignService.save(mappedCampaigns);
  }
}
