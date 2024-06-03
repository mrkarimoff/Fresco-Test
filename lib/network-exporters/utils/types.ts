import {
  caseProperty,
  codebookHashProperty,
  edgeExportIDProperty,
  egoProperty,
  nodeExportIDProperty,
  protocolName,
  protocolProperty,
  sessionExportTimeProperty,
  sessionFinishTimeProperty,
  sessionProperty,
  sessionStartTimeProperty,
} from '@codaco/shared-consts';
import { z } from 'zod';
import { ZNcEdge, ZNcNetwork, ZNcNode } from '~/schemas/network-canvas';

const ZNodeWithEgo = ZNcNode.extend({
  [egoProperty]: z.string(),
});

const ZEdgeWithEgo = ZNcEdge.extend({
  [egoProperty]: z.string(),
});

export type SessionsByProtocol = Record<string, SessionWithNetworkEgo[]>;

const ZSessionVariables = z.object({
  [caseProperty]: z.string(),
  [sessionProperty]: z.string(),
  [protocolProperty]: z.string(),
  [protocolName]: z.string(),
  [codebookHashProperty]: z.string(),
  [sessionExportTimeProperty]: z.string(),
  [sessionStartTimeProperty]: z.string().optional(),
  [sessionFinishTimeProperty]: z.string().optional(),
  COMMIT_HASH: z.string(),
  APP_VERSION: z.string(),
});

export type SessionVariables = z.infer<typeof ZSessionVariables>;

const ZFormattedSessionSchema = ZNcNetwork.extend({
  sessionVariables: ZSessionVariables,
});

const ZSessionWithNetworkEgo = ZFormattedSessionSchema.extend({
  nodes: ZNodeWithEgo.array(),
  edges: ZEdgeWithEgo.array(),
});

export type SessionWithNetworkEgo = z.infer<typeof ZSessionWithNetworkEgo>;

export const ExportOptionsSchema = z.object({
  exportGraphML: z.boolean(),
  exportCSV: z.boolean(),
  globalOptions: z.object({
    useScreenLayoutCoordinates: z.boolean(),
    screenLayoutHeight: z.number(),
    screenLayoutWidth: z.number(),
  }),
});

export type ExportOptions = z.infer<typeof ExportOptionsSchema>;

export type FormattedSession = z.infer<typeof ZFormattedSessionSchema>;

export type ExportFormat =
  | 'graphml'
  | 'attributeList'
  | 'edgeList'
  | 'ego'
  | 'adjacencyMatrix';

type ExportError = {
  success: false;
  error: Error;
};

type ExportSuccess = {
  success: true;
  filePath: string;
};

export type ExportResult = ExportError | ExportSuccess;

export type ExportReturn = {
  zipUrl?: string;
  zipKey?: string;
  status: 'success' | 'error' | 'cancelled' | 'partial';
  error: string | null;
  successfulExports?: ExportResult[];
  failedExports?: ExportResult[];
};

const ZNodeWithResequencedID = ZNodeWithEgo.extend({
  [nodeExportIDProperty]: z.number(),
});

export type NodeWithResequencedID = z.infer<typeof ZNodeWithResequencedID>;

const ZEdgeWithResequencedID = ZEdgeWithEgo.extend({
  [edgeExportIDProperty]: z.number(),
  from: z.number(),
  to: z.number(),
});

export type EdgeWithResequencedID = z.infer<typeof ZEdgeWithResequencedID>;

const ZSessionWithResequencedIDs = ZSessionWithNetworkEgo.extend({
  nodes: ZNodeWithResequencedID.array(),
  edges: ZEdgeWithResequencedID.array(),
});

export type SessionWithResequencedIDs = z.infer<
  typeof ZSessionWithResequencedIDs
>;

export type ArchiveResult = {
  path: string;
  completed: ExportResult[];
  rejected: ExportResult[];
};
