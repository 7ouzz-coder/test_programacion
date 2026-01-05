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

  // Registrar usuario
  async register(email: string, password: string) {
    console.log('registrando usuario:', email); // debugging
    
    // verificar si existe
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });
    
    if(existingUser) {
      throw new Error('El email ya está registrado');
    }

    // hashear password - uso 10 rounds porque lo vi en un tutorial
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('password encriptado'); 

    // crear usuario
    let user = new User();
    user.email = email;
    user.password = hashedPassword;

    // guardar
    const savedUser = await this.userRepository.save(user);
    console.log('usuario guardado:', savedUser.id);

    // generar token
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

  // Login de usuario
  async login(email: string, password: string) {
    console.log('intentando login:', email);
    
    // buscar usuario en la bd
    const usuario = await this.userRepository.findOne({ 
      where: { email } 
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // comparar ci
    const isValid = await bcrypt.compare(password, usuario.password);
    console.log('password correcto?', isValid);

    if(!isValid) {
      throw new Error('Contraseña incorrecta');
    }

    // crear token
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

  // obtener info del usuario
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