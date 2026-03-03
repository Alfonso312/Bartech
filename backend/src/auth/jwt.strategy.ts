import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'TU_SECRETO_JWT', // debe coincidir con tu AuthModule
        });
    }

    async validate(payload: any) {
        // payload contiene lo que pusiste en login (username, sub, role)
        return { userId: payload.sub, username: payload.username, role: payload.role };
    }
}