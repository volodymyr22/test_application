import { SupportedCryptoEnum } from '../../types/supported_crypto.enum';

export class CreateDonationDto {
  amount: number;
  nickname: string;
  campainId: string;
  cryptoCurrency?: SupportedCryptoEnum;
}
