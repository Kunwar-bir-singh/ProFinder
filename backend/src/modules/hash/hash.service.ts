import bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HashService {
    private readonly saltRounds: number;

    constructor(private configService: ConfigService) {
        this.saltRounds = parseInt(this.configService.get('SALT_ROUNDS', '12'));
    }

    async hashToken(): Promise<string> {
        return bcrypt.hash(Date.now().toString(), this.saltRounds);
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}