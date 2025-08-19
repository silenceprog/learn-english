import { AccessTokenPayload } from "./AccessTokenPayload";

export interface JwtPayloadWithRt extends AccessTokenPayload {
  refreshToken: string;
}