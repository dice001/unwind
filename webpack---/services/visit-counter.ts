import { DataCapsule } from 'data-capsule';

interface VisitData {
  visitCount: number;
  lastUpdate: string | null;
}

export class VisitCounter {
  private readonly key: string;

  constructor(private readonly dataCapsule: DataCapsule, instanceId: string) {
    this.key = `wix-visitor-data-key-${instanceId}`;
  }

  private getFromStorage(): Promise<VisitData> {
    const defaultData: VisitData = {
      visitCount: 0,
      lastUpdate: null,
    };
    return this.dataCapsule.getItem(this.key).catch(() => defaultData);
  }

  private getTodayDate() {
    const currentTime = Date.now();
    return new Date(currentTime).toISOString().substring(0, 10);
  }

  async getVisitNumber(): Promise<number> {
    const data = await this.getFromStorage();
    return data.visitCount;
  }

  async increaseVisitNumber(): Promise<void> {
    const todayDate = this.getTodayDate();
    const { lastUpdate, visitCount } = await this.getFromStorage();

    if (lastUpdate !== todayDate) {
      const updatedVisitCount = visitCount + 1;
      try {
        await this.dataCapsule.setItem(this.key, {
          visitCount: updatedVisitCount,
          lastUpdate: todayDate,
        });
      } catch (e) {
        // swallow
      }
    }
  }
}
