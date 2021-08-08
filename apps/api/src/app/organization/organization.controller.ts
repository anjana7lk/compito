import { OrganizationRequest, RequestParamsDto } from '@compito/api-interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PERMISSIONS } from 'apps/api/src/app/core/config/permissions.config';
import { Permissions } from 'apps/api/src/app/core/decorators/permissions.decorator';
import { PermissionsGuard } from 'apps/api/src/app/core/guards/permissions.guard';
import { OrganizationService } from './organization.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.create)
  @Post()
  create(@Body() organization: OrganizationRequest) {
    return this.organizationService.create(organization);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.read)
  @Get()
  findAll(@Query() query: RequestParamsDto) {
    return this.organizationService.findAll(query);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.read)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() organization: OrganizationRequest) {
    return this.organizationService.update(id, organization);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.org.delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}