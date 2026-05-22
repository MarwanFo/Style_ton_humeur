import { Controller, Get, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('weather')
@UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('lat') lat: string, @Query('lon') lon: string) {
    if (!lat || !lon) {
      return { temp: 18, code: 3, description: 'Modéré' }; // default fallback
    }

    const weather = await this.weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lon));
    
    // Provide a default description based on WMO Weather interpretation codes
    let description = 'Ensoleillé';
    let icon = 'sun';
    
    if (weather) {
      const code = weather.code;
      if (code >= 1 && code <= 3) { description = 'Partiellement nuageux'; icon = 'cloud'; }
      if (code >= 45 && code <= 48) { description = 'Brouillard'; icon = 'cloud'; }
      if (code >= 51 && code <= 67) { description = 'Pluie'; icon = 'cloud-drizzle'; }
      if (code >= 71 && code <= 77) { description = 'Neige'; icon = 'cloud-snow'; }
      if (code >= 80 && code <= 82) { description = 'Averses'; icon = 'cloud-rain'; }
      if (code >= 95) { description = 'Orage'; icon = 'cloud-lightning'; }
      
      return {
        temp: weather.temp,
        code: weather.code,
        description,
        icon
      };
    }

    return { temp: 20, code: 0, description: 'Ensoleillé', icon: 'sun' };
  }
}
