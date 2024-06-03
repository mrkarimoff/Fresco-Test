import { AttributeListFormatter } from '../formatters/csv/attribute-list';
import { EdgeListFormatter } from '../formatters/csv/edge-list';
import { EgoListFormatter } from '../formatters/csv/ego-list';
import { AdjacencyMatrixFormatter } from '../formatters/csv/matrix';
import GraphMLFormatter from '../formatters/graphml/GraphMLFormatter';
import type { ExportFormat } from './types';

/**
 * Formatter factory
 * @param  {string} formatterType one of the `format`s
 * @return {class}
 */
const getFormatterClass = (formatterType: ExportFormat) => {
  switch (formatterType) {
    case 'graphml':
      return GraphMLFormatter;
    case 'adjacencyMatrix':
      return AdjacencyMatrixFormatter;
    case 'edgeList':
      return EdgeListFormatter;
    case 'attributeList':
      return AttributeListFormatter;
    case 'ego':
      return EgoListFormatter;
  }
};

export default getFormatterClass;
