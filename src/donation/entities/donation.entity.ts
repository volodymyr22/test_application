import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { DonationState } from '../../types/donation_state.enum';
import { SupportedCryptoEnum } from '../../types/supported_crypto.enum';

@Entity({ name: 'donations' })
export class DonationEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  amount: number;

  @Column()
  donatorNickname: string;

  @Column({ type: 'enum', enum: DonationState })
  state: string;

  @Column({ nullable: true, enum: SupportedCryptoEnum, type: 'enum' })
  selectedCrypto: string;

  @Column({ nullable: true })
  cryptoAmount: number;

  @ManyToOne(() => CampaignEntity, (campaign) => campaign.donations)
  @JoinColumn({ name: 'campaignId' })
  campaignId: CampaignEntity;
}
