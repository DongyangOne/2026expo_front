import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { QrLoginSseResponse } from '@/types';

interface QrLoginState {
  loginResponse: QrLoginSseResponse | null;
  setLoginResponse: (loginResponse: QrLoginSseResponse) => void;
  clearLoginResponse: () => void;
}

export const useQrLoginStore = create<QrLoginState>()(
  immer((set) => ({
    loginResponse: null,

    setLoginResponse: (loginResponse) => set({ loginResponse }),
    clearLoginResponse: () => set({ loginResponse: null }),
  })),
);
