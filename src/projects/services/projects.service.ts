import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { HttpCustomService } from 'src/providers/http/http.service';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { UsersService } from 'src/users/services/users.service';
import { ErrorManager } from 'src/utils/error.manager';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/projects.dto';
import { ProjectsEntity } from '../entities/projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectRepository: Repository<ProjectsEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectRepository: Repository<UsersProjectsEntity>,
    private readonly usersService: UsersService,
    private readonly httpService: HttpCustomService
  ) {}

  public async createProject(body: ProjectDTO, userId: string): Promise<any> {
    try {
      const user = await this.usersService.findUserById(userId)
      const project = await this.projectRepository.save(body);
      return await this.userProjectRepository.save({
        accessLevel: ACCESS_LEVEL.OWNER,
        user: user,
        project
      })
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async listApi(){
    return this.httpService.apiFindAll()
  }

  public async findProjects(): Promise<ProjectsEntity[]> {
    try {
      const projects: ProjectsEntity[] = await this.projectRepository.find();
      if (projects.length === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro resultado',
        });
      }
      return projects;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findProjectById(id: string): Promise<ProjectsEntity> {
    try {
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .where({ id })
        .leftJoinAndSelect('project.usersIncludes','usersIncludes')
        .leftJoinAndSelect('usersIncludes.user','user')
        .getOne();
      if (!project) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No existe proyecto con el id ' + id,
        });
      }
      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateProject(
    body: ProjectUpdateDTO,
    id: string,
  ): Promise<UpdateResult | undefined> {
    try {
      const project: UpdateResult = await this.projectRepository.update(
        id,
        body,
      );
      if (project.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo actualizar proyecto',
        });
      }
      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteProject(id: string): Promise<DeleteResult | undefined> {
    try {
      const project: DeleteResult = await this.projectRepository.delete(id);
      if (project.affected === 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo borrar proyecto',
        });
      }
      return project;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
