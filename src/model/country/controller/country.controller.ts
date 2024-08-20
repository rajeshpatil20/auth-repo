import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CountryService } from '../services/country.service';
import { Country as CountryModel } from "@prisma/client";

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  @Get()
  async getAllCountry() {
    return this.countryService.getAllCountry();
  }

  @Get(":id")
  async getCountry(@Param("id") id: string) {
    return this.countryService.country({ id: id });
  }

  @Post()
  async signupCountry(
    @Body() CountryData: { CountryCode: string, CountryName: string, Active: boolean },
  ): Promise<CountryModel> {
    return this.countryService.createCountry(CountryData);
  }

  @Put(":id")
  async updateCountry(
    @Param("id") id: string,
    @Body() CountryData: { CountryCode: string, CountryName: string, Active: boolean},
  ): Promise<CountryModel> {
    return this.countryService.updateCountry({
      where: { id: id },
      data: CountryData,
    });
  }

  @Delete(":id")
  async deleteCountry(@Param("id") id: string): Promise<CountryModel> {
    return this.countryService.deleteCountry({ id: id });
  }
}