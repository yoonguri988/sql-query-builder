'use client';

import { WhereCondition, WhereOperator } from '@/types/query';
import { useColumnNames } from '@/hooks/useTableColumns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

/**
 * WHERE 조건에서 사용 가능한 연산자 목록
 */
const OPERATORS: { value: WhereOperator; label: string }[] = [
  { value: '=', label: '= (같음)' },
  { value: '!=', label: '!= (다름)' },
  { value: '>', label: '> (크다)' },
  { value: '>=', label: '>= (크거나 같다)' },
  { value: '<', label: '< (작다)' },
  { value: '<=', label: '<= (작거나 같다)' },
  { value: 'LIKE', label: 'LIKE (포함)' },
  { value: 'IN', label: 'IN (목록)' },
  { value: 'IS NULL', label: 'IS NULL (비어있음)' },
  { value: 'IS NOT NULL', label: 'IS NOT NULL (비어있지 않음)' },
];

interface ConditionRowProps {
  condition: WhereCondition;
  onUpdate: (id: string, updates: Partial<WhereCondition>) => void;
  onRemove: (id: string) => void;
  showLogicalOperator?: boolean;
}

/**
 * ConditionRow 컴포넌트
 * WHERE 절의 단일 조건을 입력하는 행
 * 
 * 기능:
 * - 컬럼 선택 드롭다운
 * - 연산자 선택 드롭다운
 * - 값 입력 필드
 * - 삭제 버튼
 * - 논리 연산자 선택 (AND/OR)
 * 
 * @component
 * @example
 * <ConditionRow
 *   condition={condition}
 *   onUpdate={handleUpdate}
 *   onRemove={handleRemove}
 *   showLogicalOperator={index > 0}
 * />
 */
export function ConditionRow({
  condition,
  onUpdate,
  onRemove,
  showLogicalOperator = false,
}: ConditionRowProps) {
  const columnNames = useColumnNames();

  // 값 입력이 필요 없는 연산자 확인
  const isNullOperator = condition.operator === 'IS NULL' || condition.operator === 'IS NOT NULL';

  return (
    <div className="flex items-start gap-2">
      {/* 논리 연산자 (AND/OR) - 첫 번째 조건이 아닐 때만 표시 */}
      {showLogicalOperator && (
        <Select
          value={condition.logicalOperator || 'AND'}
          onValueChange={(value) =>
            onUpdate(condition.id, { logicalOperator: value as 'AND' | 'OR' })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* 컬럼 선택 */}
      <Select
        value={condition.column}
        onValueChange={(value) => onUpdate(condition.id, { column: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="컬럼 선택" />
        </SelectTrigger>
        <SelectContent>
          {columnNames.map((columnName) => (
            <SelectItem key={columnName} value={columnName}>
              <span className="font-mono text-sm">{columnName}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 연산자 선택 */}
      <Select
        value={condition.operator}
        onValueChange={(value) =>
          onUpdate(condition.id, { operator: value as WhereOperator })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="연산자" />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 값 입력 - NULL 연산자가 아닐 때만 표시 */}
      {!isNullOperator && (
        <Input
          type="text"
          placeholder="값 입력"
          value={condition.value}
          onChange={(e) => onUpdate(condition.id, { value: e.target.value })}
          className="flex-1"
        />
      )}

      {/* 삭제 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(condition.id)}
        className="h-10 w-10 shrink-0"
        title="조건 삭제"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}