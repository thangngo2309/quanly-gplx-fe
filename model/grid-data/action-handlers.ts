export interface ActionHandlers<T> {
  onEdit?: (row: T) => void;
  onDelete?: (id: number) => void;
  getDeleteId?: (row: T) => number;
  getDeleteLabel?: (row: T) => string;
}