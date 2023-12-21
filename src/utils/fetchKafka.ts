import { DataSourceSettings } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { PluginBackendResult } from 'types';
let datasourceIdCache = -1;
let redIndex = 0;
export const fetchKafka = async (datasourceName: string, callback: Function, postData: any) => {
  let srv = getBackendSrv();
  let rid = 'RQ-' + (++redIndex).toString();

  // Find datasourceId from its "name"
  ((datasourceName: string, then: Function): void => {
    if (datasourceIdCache > -1) {
      // Datasourceid already found on previous request
      then(datasourceIdCache);
      return;
    }

    // Call api /api/datasources to list available datasources
    srv
      .fetch({
        method: 'GET',
        url: document.location.protocol + '//' + document.location.host + '/api/datasources',
        headers: { 'Content-Type': 'application/json' },
      })
      .forEach((value) => {
        if (value.status === 200) {
          // Search datasource named "datasourceName"
          let list = value.data as DataSourceSettings[];
          list.forEach((v: DataSourceSettings) => {
            if (v.type === datasourceName) {
              datasourceIdCache = v.id;
            }
          });
        }
      })
      .then((v) => {
        if (datasourceIdCache > -1) {
          then(datasourceIdCache);
        } else {
          callback(new Error('Expected datasource not found'), null);
        }
      })
      .catch((e) => {
        callback(new Error('Fail to call backend, ' + e), null);
      });
  })(datasourceName, (datasourceid: number) => {
    // Test
    let request: any = null;
    srv
      .fetch({
        method: 'POST',
        url: document.location.protocol + '//' + document.location.host + '/api/ds/query',
        data: {
          queries: [
            {
              datasourceId: datasourceid,
              refId: rid,
              query: postData,
            },
          ],
        },
      })
      .forEach((value) => {
        if (request === null) {
          request = value;
        }
      })
      .then(() => {
        // Check for response
        if (request.status === 200) {
          if (typeof request.data.results[rid] === 'undefined') {
            callback(new Error('Request has no matching response'), null);
          } else {
            // Rebuilt response data
            let data: any = {};
            request.data.results[rid].frames.forEach((v: any) => {
              v.schema.fields.map((w: any, i: number) => {
                data[w.name] = v.data.values[i][0];
              });
            });
            callback(null, data as PluginBackendResult);
          }
        } else {
          callback(new Error('Fail to send data (http: ' + request.status + ')'), null);
        }
      })
      .catch((e) => {
        callback(e, null);
      });
  });
};
