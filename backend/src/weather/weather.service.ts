import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private readonly httpService: HttpService) {}

  async getCurrentWeather(latitude: number, longitude: number): Promise<{ temp: number; code: number } | null> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;
      
      if (data && data.current_weather) {
        return {
          temp: data.current_weather.temperature,
          code: data.current_weather.weathercode,
        };
      }
      return null;
    } catch (error) {
      this.logger.error('Erreur lors de la récupération de la météo', error);
      return null; // Résilience: on retourne null sans planter
    }
  }
}
