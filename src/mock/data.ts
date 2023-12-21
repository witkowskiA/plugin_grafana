import {
  AlertState,
  DataFrame,
  DataQuery,
  DataQueryRequest,
  LoadingState,
  PanelData,
  ScopedVar,
  TimeRange,
} from '@grafana/data';

const loadingState: LoadingState = LoadingState.Loading;

const mockTimeRange: TimeRange = {
  from: '2023-07-20T00:00:00Z' as any,
  to: '2023-10-17T14:12:41Z' as any,
  raw: {
    start: '2023-10-17T13:12:41Z' as any,
    end: '2023-10-17T14:12:41Z' as any,
  } as any,
};
const scopedVar1: ScopedVar<string> = {
  value: 'Hello, world!',
};

const scopedVar2: ScopedVar<number> = {
  value: 123,
};

const scopedVar3: ScopedVar<object> = {
  value: {
    name: 'John Doe',
    age: 30,
  },
};
const dataQueriesRequest: DataQueryRequest<DataQuery> = {
  requestId: '1234567890',
  interval: '1m',
  intervalMs: 60000,
  maxDataPoints: 1000,
  range: mockTimeRange,
  scopedVars: {
    name: scopedVar1,
    age: scopedVar2,
    user: scopedVar3,
  },
  targets: [{ key: 'toto', refId: 'totot' }],
  cacheTimeout: '30s',
  queryCachingTTL: 3600000,
  rangeRaw: {
    from: '1658000000000',
    to: '1658003600000',
  },
  timeInfo: '2023-07-20T00:00:00Z to 2023-07-20T01:00:00Z',
  panelId: 1,
  dashboardUID: '1234567890',
  publicDashboardAccessToken: 'abc123',
  startTime: 1658000000000,
  endTime: 1658003600000,
  liveStreaming: false,
  hideFromInspector: false,
  queryGroupId: '1234567890',
} as any;
const dataframe: DataFrame = {
  name: 'DataFrame 1',
  fields: {
    name: { 'Column 1': 'test' },
    type: 'string',
    config: {},
    values: ['Row 1, Column 1', 'Row 2, Column 1', 'Row 3, Column 1'] as any,
  } as any,
  length: 3,
};
export const data: PanelData = {
  state: loadingState,
  series: [],
  structureRev: 1,
  annotations: [dataframe],
  alertState: {
    id: 1,
    dashboardId: 2,
    panelId: 3,
    state: AlertState.Alerting,
  },
  request: dataQueriesRequest,
  timings: undefined,
  errors: [],
  timeRange: {
    from: '2023-10-17T10:14:55Z' as any,
    to: '2023-10-17T10:15:55Z' as any,
  } as any,
  traceIds: [],
};
