import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UiState {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>()(
  immer((set) => ({
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
  })),
);
