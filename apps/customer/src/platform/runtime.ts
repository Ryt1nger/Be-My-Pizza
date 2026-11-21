import { Capacitor } from '@capacitor/core';
export const platform={isNative:()=>Capacitor.isNativePlatform(),kind:()=>Capacitor.getPlatform()};
