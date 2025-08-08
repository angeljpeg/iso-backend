import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  RequestResetPasswordDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ErrorManager } from '../../utils/error-manager';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
    createdBy: Usuario,
  ): Promise<Usuario> {
    try {
      // Solo el coordinador puede crear usuarios
      if (createdBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede registrar nuevos usuarios',
        });
      }

      // Verificar que no exista un usuario con el mismo email
      const existingUser = await this.usuarioRepository.findOne({
        where: { email: createUsuarioDto.email },
      });

      if (existingUser) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Ya existe un usuario con este email',
        });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 12);

      const usuario = this.usuarioRepository.create({
        ...createUsuarioDto,
        password: hashedPassword,
      });

      const savedUser = await this.usuarioRepository.save(usuario);

      // TODO: Enviar email con credenciales
      // await this.emailService.sendCredentials(savedUser.email, createUsuarioDto.password);

      return savedUser;
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al crear usuario',
      });
    }
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { email: loginUsuarioDto.email },
      });

      if (!usuario) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Credenciales inválidas',
        });
      }

      if (!usuario.activo) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Usuario inactivo',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        loginUsuarioDto.password,
        usuario.password,
      );

      if (!isPasswordValid) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Credenciales inválidas',
        });
      }

      const payload = {
        sub: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
        },
      };
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error en el login',
      });
    }
  }

  async findAll(
    search?: string,
    rol?: RolUsuario,
    activo?: boolean,
    page?: number,
    limit?: number,
  ): Promise<{
    data: Usuario[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const currentPage = page || 1;
      const currentLimit = limit || 10;
      const offset = (currentPage - 1) * currentLimit;

      const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario');

      // Por defecto solo traer usuarios activos si no se especifica
      if (activo !== undefined) {
        queryBuilder.where('usuario.activo = :activo', { activo });
      }

      if (search) {
        queryBuilder.andWhere(
          '(usuario.nombre ILIKE :search OR usuario.apellido ILIKE :search OR usuario.email ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (rol) {
        queryBuilder.andWhere('usuario.rol = :rol', { rol });
      }

      queryBuilder
        .orderBy('usuario.nombre', 'ASC')
        .addOrderBy('usuario.apellido', 'ASC');

      // Obtener el total de registros sin paginación
      const total = await queryBuilder.getCount();

      // Aplicar paginación solo si se especifican los parámetros
      if (page && limit) {
        queryBuilder.skip(offset).take(currentLimit);
      }

      const data = await queryBuilder.getMany();
      const totalPages = Math.ceil(total / currentLimit);

      return {
        data,
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
      };
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener usuarios',
      });
    }
  }

  async findOne(id: string): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository.findOne({ where: { id } });
      if (!usuario) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }
      return usuario;
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener usuario',
      });
    }
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
    updatedBy: Usuario,
  ): Promise<Usuario> {
    try {
      const usuario = await this.findOne(id);

      // Solo el coordinador puede modificar otros usuarios
      if (updatedBy.rol !== RolUsuario.COORDINADOR && updatedBy.id !== id) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'No tienes permisos para modificar este usuario',
        });
      }

      // Un coordinador no puede cambiar su propio rol
      if (
        updatedBy.id === id &&
        updateUsuarioDto.rol &&
        updatedBy.rol === RolUsuario.COORDINADOR
      ) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'No puedes cambiar tu propio rol',
        });
      }

      Object.assign(usuario, updateUsuarioDto);
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al actualizar usuario',
      });
    }
  }

  async deactivate(id: string, deactivatedBy: Usuario): Promise<void> {
    try {
      const usuario = await this.findOne(id);

      // Solo el coordinador puede desactivar usuarios
      if (deactivatedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede desactivar usuarios',
        });
      }

      // Un coordinador no puede desactivar su propia cuenta
      if (deactivatedBy.id === id) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'No puedes desactivar tu propia cuenta',
        });
      }

      usuario.activo = false;
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al desactivar usuario',
      });
    }
  }

  async reactivate(id: string, reactivatedBy: Usuario): Promise<void> {
    try {
      const usuario = await this.findOne(id);

      // Solo el coordinador puede reactivar usuarios
      if (reactivatedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede reactivar usuarios',
        });
      }

      // Verificar que el usuario esté desactivado
      if (usuario.activo) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El usuario ya está activo',
        });
      }

      usuario.activo = true;
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al reactivar usuario',
      });
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    try {
      const usuario = await this.findOne(userId);

      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        usuario.password,
      );

      if (!isCurrentPasswordValid) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Contraseña actual incorrecta',
        });
      }

      const hashedNewPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        12,
      );
      usuario.password = hashedNewPassword;
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al cambiar contraseña',
      });
    }
  }

  async requestPasswordReset(
    requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { email: requestResetPasswordDto.email },
      });

      if (!usuario) {
        // Por seguridad, no revelamos si el email existe o no
        return;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hora

      usuario.resetPasswordToken = resetToken;
      usuario.resetPasswordExpires = resetExpires;
      await this.usuarioRepository.save(usuario);

      // TODO: Enviar email con token de reset
      // await this.emailService.sendPasswordReset(usuario.email, resetToken);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al solicitar reset de contraseña',
      });
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: {
          resetPasswordToken: resetPasswordDto.token,
        },
      });

      if (
        !usuario ||
        !usuario.resetPasswordExpires ||
        usuario.resetPasswordExpires < new Date()
      ) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Token de reset inválido o expirado',
        });
      }

      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        12,
      );
      usuario.password = hashedPassword;
      usuario.resetPasswordToken = null;
      usuario.resetPasswordExpires = null;
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al resetear contraseña',
      });
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Verificar y decodificar el refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);

      // Buscar el usuario en la base de datos
      const usuario = await this.usuarioRepository.findOne({
        where: { id: payload.sub },
      });

      if (!usuario) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Usuario no encontrado',
        });
      }

      if (!usuario.activo) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Usuario inactivo',
        });
      }

      // Generar nuevos tokens
      const newPayload = {
        sub: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
        },
      };
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }

      // Si el error es de JWT (token inválido o expirado)
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        const error = new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Refresh token inválido o expirado',
        });
        ErrorManager.createSignatureError(error.message);
      }

      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al renovar token',
      });
    }
  }
}
