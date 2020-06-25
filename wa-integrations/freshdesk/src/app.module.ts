import { Module } from '@nestjs/common';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [WebhooksModule],
})
export class AppModule {}
