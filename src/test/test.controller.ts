import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  set(@Body() createTestDto: CreateTestDto) {
    return this.testService.set(createTestDto);
  }

  @Get()
  findAll(@Body() createTestDto: CreateTestDto) {
    return this.testService.get(createTestDto);
  }
}
