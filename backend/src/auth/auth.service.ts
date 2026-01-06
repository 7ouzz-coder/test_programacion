import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    console.log('registrando usuario:', email);
    
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });
    
    if(existingUser) {
      throw new Error('El email ya está registrado');
    }

    // hashear el password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('password hasheado');

    let user = new User();
    user.email = email;
    user.password = hashedPassword;

    const savedUser = await this.userRepository.save(user);
    console.log('usuario guardado:', savedUser.id);

    const token = this.jwtService.sign({ 
      id: savedUser.id, 
      email: savedUser.email 
    });

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
      },
      token: token,
    };
  }

  async login(email: string, password: string) {
    console.log('intentando login:', email);
    
    const usuario = await this.userRepository.findOne({ 
      where: { email } 
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(password, usuario.password);
    console.log('password correcto?', isValid);

    if(!isValid) {
      throw new Error('Contraseña incorrecta');
    }

    let token = this.jwtService.sign({ 
      id: usuario.id, 
      email: usuario.email 
    });

    return {
      user:{
        id: usuario.id,
        email: usuario.email,
      },
      token:token,
    };
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({ 
      where: { id: userId } 
    });

    if(!user){
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}