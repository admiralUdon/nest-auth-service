import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Role, User, UserRole } from '@prisma/client';
import { PrismaService } from 'app/core/providers/prisma/prisma.service';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);

    /**
     * Constructor
     */
    constructor(
        private readonly prismaService: PrismaService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User & { roles: (UserRole & { role: Role })[] } | null> {
        return this.prismaService.user.findUnique({
            where: userWhereUniqueInput,
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
    }

    async users(params: {
        roleId?: string;
        skip: number;
        take: number;
        search: string;
        sortBy: keyof Prisma.UserOrderByWithRelationInput;
        orderBy: "asc" | "desc";
    }): Promise<{ users: User[]; totalCount: number; }> {

        const { roleId, skip, take, search, sortBy, orderBy } = params;
        const where: Prisma.UserWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (roleId) {
            where.roles = {
                some: { id: roleId }
            };
        }

        const orderByWithRelation: Prisma.UserOrderByWithRelationInput = {
            [sortBy]: orderBy,
        };

        const [users, totalCount] = await Promise.all([
            this.prismaService.user.findMany({
                skip,
                take,
                where,
                orderBy: orderByWithRelation,
            }),
            this.prismaService.user.count({ where })
        ]);

        return { users, totalCount };
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prismaService.user.create({
            data,
        });
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        return this.prismaService.user.update({
            data,
            where,
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prismaService.user.delete({
            where,
        });
    }

    async roles(roleWhereInput: Prisma.RoleWhereInput): Promise<Role[] | null> {
        const roles = await this.prismaService.role.findMany({
            where: roleWhereInput,
        });
        this.logger.debug(roles);
        return roles.length ? roles : null;
    }

    async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
        return this.prismaService.role.create({
            data,
        });
    }

    async updateRole(params: {
        where: Prisma.RoleWhereUniqueInput;
        data: Prisma.RoleUpdateInput;
    }): Promise<Role> {
        const { where, data } = params;
        return this.prismaService.role.update({
            data,
            where,
        });
    }

    async deleteRole(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
        return this.prismaService.role.delete({
            where,
        });
    }

    async checkUserRole(username: string, roleTag: string): Promise<boolean> {
        const userWithRoles = await this.prismaService.user.findUnique({
            where: { username },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        return userWithRoles?.roles.some(userRole => userRole.role.tag === roleTag) ?? false;
    }

    async getUserWithRoles(userId: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where: { id: userId },
            include: { roles: true },
        });
    }

    async addRoleToUser(userId: string, roleId: string): Promise<User> {
        return this.prismaService.user.update({
            where: { id: userId },
            data: {
                roles: {
                    connect: { id: roleId },
                },
            },
        });
    }

    async removeRoleFromUser(userId: string, roleId: string): Promise<User> {
        return this.prismaService.user.update({
            where: { id: userId },
            data: {
                roles: {
                    disconnect: { id: roleId },
                },
            },
        });
    }
}