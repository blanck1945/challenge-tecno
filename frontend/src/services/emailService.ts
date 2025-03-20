import apiService from './ApiService';

class EmailService {
  async sendEmail(email: string, name: string, message: string): Promise<void> {
    await apiService.post('/api/mail/send', { email, name, message });
  }
}

export default new EmailService();
