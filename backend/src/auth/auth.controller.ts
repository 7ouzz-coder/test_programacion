import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      console.log('body recibido:', body); // ver que llega
      const result = await this.authService.register(
        body.email,
        body.password,
      );
      return result;
    } catch (error) {
      console.log('error en register:', error.message);
      return { 
        error: error.message 
      };
    }
  }

  @Post('login')
  async login(@Body() body: any) {
    try{
      const result = await this.authService.login(
        body.email,
        body.password,
      );
      return result;
    }catch(error){
      console.log('error login:', error);
      return { 
        error: error.message 
      };
    }
  }

  @Get('me')
  async getProfile(@Headers('authorization') auth: string) {
    try {
      // sacar el token
      if (!auth) {
        throw new Error('No hay token');
      }

      const token = auth.replace('Bearer ', '');
      
      // verificar token
      const decoded = this.jwtService.verify(token);
      console.log('token decoded:', decoded); // debugging
      
      // traer usuario
      const user = await this.authService.getUserById(decoded.id);
      
      return user;
    } catch (error) {
      console.error('error en me:', error);
      return { 
        error: 'Token inválido o expirado' 
      };
    }
  }
}