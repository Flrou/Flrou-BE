import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserService } from "./user.service";
import { UserController } from "./user.con";
import { User } from "./user.entity";
import { UserRepository } from "./user.repo";

@Module({
    imports : [SequelizeModule.forFeature([User])],
    providers : [UserRepository, UserService],
    controllers : [UserController],
    exports : [SequelizeModule]
})

export class UserModule {}