import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // 전체 유저 반환
  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  // 특정 유저 반환 (user_id)
  findOneByUserId(user_id: string): Promise<User | null> {
    return this.userModel.findOne({where : {user_id}});
  }

  // 유저 추가
  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData);
  }

  // 유저 삭제
  async remove(user_id: string): Promise<void> {
    const user = await this.findOneByUserId(user_id);
    await user.destroy();
  }

  // 유저 닉네임 수정
  async update(user_id: string, new_nickname: string): Promise<string> {
    await this.userModel.update({ nickname: new_nickname }, { where: { user_id } });
    return "success";
  }

  // 강제 알림 설정
  async setForce(user_id: string,): Promise<any> {
    const user = await this.findOneByUserId(user_id);
    await this.userModel.update({ force : !user.force }, { where : { userId : user.id } })
    return !user.force;
  }

  // 디바이스 토큰 저장
  async setDeviceToken(user_id: string, token: string): Promise<any> {
    await this.userModel.update({ device_token : token }, { where : { user_id } });
    return "success";
  }
}