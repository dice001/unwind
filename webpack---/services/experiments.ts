export class Experiments {
  constructor(private readonly experiments: Record<string, string>) {}

  enabled(key: string): boolean {
    return this.experiments[key] === 'true';
  }

  all() {
    return this.experiments;
  }
}
