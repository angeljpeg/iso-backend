import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  RequestResetPasswordDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RolUsuario } from './entities/usuario.entity';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar tokens de acceso' })
  @ApiResponse({ status: 200, description: 'Tokens renovados exitosamente' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.usuariosService.refreshToken(refreshTokenDto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Registrar nuevo usuario (solo coordinador)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.usuariosService.create(createUsuarioDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener todos los usuarios (solo coordinador)' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre, apellido o email',
  })
  @ApiQuery({
    name: 'rol',
    required: false,
    enum: RolUsuario,
    description: 'Filtrar por rol',
  })
  @ApiQuery({
    name: 'activo',
    required: false,
    type: Boolean,
    description:
      'Filtrar por estado activo/inactivo. Por defecto solo trae activos.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (opcional)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página (opcional, por defecto 10)',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll(
    @Query('search') search?: string,
    @Query('rol') rol?: RolUsuario,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Convertir string a boolean y number
    const activoBoolean = activo !== undefined ? activo === 'true' : undefined;
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.usuariosService.findAll(
      search,
      rol,
      activoBoolean,
      pageNumber,
      limitNumber,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  getProfile(@Request() req: AuthenticatedRequest) {
    return this.usuariosService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener usuario por ID (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Actualizar perfil propio' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(req.user.id, updateUsuarioDto, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Actualizar usuario (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto, req.user);
  }

  @Delete(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Desactivar usuario (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado' })
  deactivate(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.usuariosService.deactivate(id, req.user);
  }

  @Patch(':id/reactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Reactivar usuario desactivado (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Usuario reactivado exitosamente' })
  @ApiResponse({ status: 400, description: 'El usuario ya está activo' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  reactivate(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.usuariosService.reactivate(id, req.user);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Cambiar contraseña propia' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
  changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usuariosService.changePassword(req.user.id, changePasswordDto);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Solicitar reset de contraseña' })
  @ApiResponse({ status: 200, description: 'Email de reset enviado' })
  requestPasswordReset(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ) {
    return this.usuariosService.requestPasswordReset(requestResetPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Resetear contraseña con token' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña reseteada exitosamente',
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usuariosService.resetPassword(resetPasswordDto);
  }
}
