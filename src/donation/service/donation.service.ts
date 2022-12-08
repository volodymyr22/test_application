import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { CampainStatus } from 'src/types/campaign_status.enum';
import { DataSource, Repository } from 'typeorm';
import { CreateDonationDto } from '../dto/createDonation.dto';
import { DonationEntity } from '../entities/donation.entity';
import { DonationState } from '../../types/donation_state.enum';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(DonationEntity)
    private donationRepository: Repository<DonationEntity>,
    @InjectRepository(CampaignEntity)
    private campaignRepository: Repository<CampaignEntity>,
    private dataScource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async createDonation({
    amount,
    campainId,
    nickname,
    cryptoCurrency,
  }: CreateDonationDto) {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campainId },
    });
    if (!campaign) {
      throw new HttpException('wrong campaign id', HttpStatus.BAD_REQUEST);
    }
    if (!campaign.donations) {
      campaign.donations = [];
    }
    let AmountInCrypto: number;
    if (cryptoCurrency) {
      AmountInCrypto = await this.calcAmountInCrypto(cryptoCurrency, amount);
    }

    let queryRunner = this.dataScource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let donation: DonationEntity;
    try {
      donation = new DonationEntity();
      const id = randomUUID({});
      donation.id = id;
      if (AmountInCrypto) {
        donation.cryptoAmount = AmountInCrypto;
        donation.selectedCrypto = cryptoCurrency;
      }
      donation.amount = amount;

      donation.campaignId = campaign;
      donation.donatorNickname = nickname;
      if (campaign.status === CampainStatus.fraud) {
        donation.state = DonationState.invalid;
      } else {
        donation.state = DonationState.valid;
      }
      campaign.donations.push(donation);
      this.checkIfSuccessCampaign(campaign);

      await queryRunner.manager.getRepository(CampaignEntity).save(campaign);
      await queryRunner.manager.getRepository(DonationEntity).save(donation);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'could not save donation in db',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { ...donation, campaignId: campaign.id };
  }

  async checkIfSuccessCampaign(campaign: CampaignEntity) {
    let donationsSum = 0;
    campaign.donations.forEach((donation) => {
      donationsSum += donation.amount;
    });
    if (donationsSum >= campaign.goal)
      campaign.status = CampainStatus.successful;
  }

  async calcAmountInCrypto(cryptoCurrency: string, amount: number) {
    const exchangeValues = await firstValueFrom(
      this.httpService.get(
        `https://api.coinbase.com/v2/exchange-rates?currency=${cryptoCurrency}`,
      ),
    );

    return amount / exchangeValues.data.data.rates.USDT;
  }
}
