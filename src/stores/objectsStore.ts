import { makeAutoObservable } from 'mobx';
import type { ITrackedObject, IObjectUpdate } from '@/types/trackable';
import { OBJECT_CONFIG } from '@/config/constants';

export class ObjectsStore {
  objects = new Map<string, ITrackedObject>();
  isLoading = true;
  private staleCheckTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
      makeAutoObservable(this);
  }

  addOrUpdate(update: IObjectUpdate) {
      const now = Date.now();

      const obj: ITrackedObject = {
          ...update,
          lastSeen: now,
          status: 'active',
      };

      this.objects.set(update.id, obj);
  }

  markAsLoaded() {
      this.isLoading = false;
  }

  markLostAndRemoveExpired() {
      const now = Date.now();

      for (const [ id, obj ] of this.objects) {
          const elapsedMs = now - obj.lastSeen;

          if (elapsedMs > OBJECT_CONFIG.REMOVE_AFTER_MS) {
              this.objects.delete(id);
              continue;
          }

          if (elapsedMs > OBJECT_CONFIG.MARK_LOST_AFTER_MS && obj.status !== 'lost') {
              obj.status = 'lost';
          }
      }
  }

  startStaleCheck() {
      this.stopStaleCheck();
      if (this.staleCheckTimer) return;

      this.staleCheckTimer = setInterval(() => {
          this.markLostAndRemoveExpired();
      }, OBJECT_CONFIG.CHECK_INTERVAL_MS);
  }

  stopStaleCheck() {
      if (!this.staleCheckTimer) return;
      clearInterval(this.staleCheckTimer);
      this.staleCheckTimer = null;
  }

  clear() {
      this.stopStaleCheck();
      this.objects.clear();
  }

  get objectsArray(): ITrackedObject[] {
      return Array.from(this.objects.values());
  }
}

export const objectsStore = new ObjectsStore();
