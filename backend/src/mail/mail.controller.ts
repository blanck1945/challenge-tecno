import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendEmailDto } from './email.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Role } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';

@Controller('mail')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send')
  @Roles(Role.User)
  async sendMail(
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<{ message: string }> {
    return await this.mailService.sendEmail(sendEmailDto);
  }
}
