import got, { CancelableRequest } from 'got';

interface IUsernameHistoryMoment {
  username: string;
  changed_at: string;
}

interface ISkin {
  url: string;
  data: string;
}

interface IRaw {
  value: string;
  signtaure: string;
}

interface IUserTextures {
  custom: boolean;
  slim: boolean;
  skin: ISkin;
  raw: IRaw;
}

interface IMinecraftUser {
  uuid: string;
  username: string;
  username_history: IUsernameHistoryMoment[];
  textures: IUserTextures;
}

export default function getMinecraftUser(
  identifier: string,
): CancelableRequest<IMinecraftUser> {
  return got(`https://api.ashcon.app/mojang/v2/user/${identifier}`).json();
}
