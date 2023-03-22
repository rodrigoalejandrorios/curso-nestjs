import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpCustomService } from './http/http.service';

@Global()
@Module({
  imports:[HttpModule],
  providers: [HttpCustomService],
  exports: [HttpModule, HttpCustomService]
})
export class ProvidersModule {}
