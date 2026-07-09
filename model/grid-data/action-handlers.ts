import { ReactNode } from "react";

export interface ActionHandlers<T> {
  onEdit?: (row: T) => void;
  onDelete?: (id: number) => void;
  getDeleteId?: (row: T) => number;
  getDeleteLabel?: (row: T) => string;
  customAction?: (row: T) => ReactNode;
  isHidden?: (row: T) => boolean;
}