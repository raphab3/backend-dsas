import env from '@config/env';
import axios from 'axios';

export class TelegramBotService {
  async sendMessage(message: string, chat_id: string): Promise<void> {
    try {
      await axios.post(
        `https://api.telegram.org/bot${env.API_TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id,
          text: message,
          parse_mode: 'Markdown',
        },
        {
          timeout: 5000,
        },
      );
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  }
}
