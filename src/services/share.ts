// helper para compartir texto desde la app (RN Share API)
// expo-sharing es para archivos; para texto plano se usa el modulo Share de RN

import { Share } from 'react-native';

interface ShareTextOptions {
  title: string;
  message: string;
}

export async function shareText({
  title,
  message,
}: ShareTextOptions): Promise<boolean> {
  try {
    const result = await Share.share(
      {
        title,
        message,
      },
      {
        dialogTitle: title,
      },
    );
    return result.action === Share.sharedAction;
  } catch {
    return false;
  }
}
