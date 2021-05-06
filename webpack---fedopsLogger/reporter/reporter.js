import * as defaultLoggerFactory from '@wix/web-bi-logger/dist/src/logger';

export default class Reporter {
    constructor({
        biLoggerFactory,
        baseUrl,
        preset,
        useBatch
    }) {
        this._preset = preset;
        const shouldBatch = !(useBatch === false);

        this._factory =
            biLoggerFactory ||
            defaultLoggerFactory.factory({
                host: baseUrl,
                useBatch: shouldBatch,
            });

        this._publisher = this._factory.logger();
    }

    flush() {
        this._publisher.flush();
    }

    report(data, reporterEndpoint) {
        if (!data) {
            return null;
        }

        const endpoint = reporterEndpoint || this._preset.nonPersistentEndpoint;
        return this._publisher.log(data, {
            endpoint,
            category: 'essential',
        });
    }
}