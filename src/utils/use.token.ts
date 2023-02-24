import { AuthTokenResult, IUseToken } from 'src/auth/interfaces/auth.interface';
import * as jwt from 'jsonwebtoken';

export const useToken = (token: string): IUseToken | string => {
  try {
    const decode = jwt.decode(token) as AuthTokenResult;

    const currentDate = new Date();
    const expiresDate = new Date(decode.exp);

    return {
      sub: decode.sub,
      role: decode.role,
      isExpired: +expiresDate <= +currentDate / 1000,
    };
  } catch (error) {
    return 'Token is invalid';
  }
};
