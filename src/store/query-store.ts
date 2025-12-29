import { create } from "zustand";
import {
  QueryState,
  WhereCondition,
  OrderByClause,
  QueryResult,
} from "@/types/query";

interface QueryStore extends QueryState {
  // SELECT 액션
  toggleColumn: (column: string) => void;
  toggleSelectAll: () => void;
  clearColumns: () => void;

  // FROM 액션
  setTable: (table: string) => void;

  // WHERE 액션
  addWhereCondition: (condition: Omit<WhereCondition, "id">) => void;
  updateWhereCondition: (id: string, updates: Partial<WhereCondition>) => void;
  removeWhereCondition: (id: string) => void;
  clearWhereConditions: () => void;

  // ORDER BY 액션
  addOrderBy: (clause: Omit<OrderByClause, "id">) => void;
  removeOrderBy: (id: string) => void;
  clearOrderBy: () => void;

  // LIMIT 액션
  setLimit: (limit: number) => void;

  // SQL 생성
  generateSQL: () => string;

  // 쿼리 실행 결과
  queryResult: QueryResult | null;
  setQueryResult: (result: QueryResult) => void;

  // 리셋
  reset: () => void;
}

const initialState: QueryState = {
  selectedColumns: [],
  selectAll: false,
  selectedTable: null,
  whereConditions: [],
  orderBy: [],
  limit: 100,
  generatedSQL: "",
  queryResult: null,
};

export const useQueryStore = create<QueryStore>((set, get) => ({
  ...initialState,

  // SELECT
  toggleColumn: (column) => {
    set((state) => {
      const exists = state.selectedColumns.includes(column);
      return {
        selectedColumns: exists
          ? state.selectedColumns.filter((c) => c !== column)
          : [...state.selectedColumns, column],
        selectAll: false,
      };
    });
  },

  toggleSelectAll: () => {
    set((state) => ({ selectAll: !state.selectAll, selectedColumns: [] }));
  },

  clearColumns: () => {
    set({ selectedColumns: [], selectAll: false });
  },

  // FROM
  setTable: (table) => {
    set({ selectedTable: table, selectedColumns: [], selectAll: false });
  },

  // WHERE
  addWhereCondition: (condition) => {
    set((state) => ({
      whereConditions: [
        ...state.whereConditions,
        { ...condition, id: crypto.randomUUID() },
      ],
    }));
  },

  updateWhereCondition: (id, updates) => {
    set((state) => ({
      whereConditions: state.whereConditions.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  removeWhereCondition: (id) => {
    set((state) => ({
      whereConditions: state.whereConditions.filter((c) => c.id !== id),
    }));
  },

  clearWhereConditions: () => {
    set({ whereConditions: [] });
  },

  // ORDER BY
  addOrderBy: (clause) => {
    set((state) => ({
      orderBy: [...state.orderBy, { ...clause, id: crypto.randomUUID() }],
    }));
  },

  removeOrderBy: (id) => {
    set((state) => ({
      orderBy: state.orderBy.filter((o) => o.id !== id),
    }));
  },

  clearOrderBy: () => {
    set({ orderBy: [] });
  },

  // LIMIT
  setLimit: (limit) => {
    set({ limit });
  },

  // SQL 생성
  generateSQL: () => {
    const state = get();
    const {
      selectedTable,
      selectedColumns,
      selectAll,
      whereConditions,
      orderBy,
      limit,
    } = state;

    if (!selectedTable) {
      return "";
    }

    let sql = "SELECT ";

    // SELECT 절
    if (selectAll || selectedColumns.length === 0) {
      sql += "*";
    } else {
      sql += selectedColumns.join(", ");
    }

    // FROM 절
    sql += ` FROM ${selectedTable}`;

    // WHERE 절
    if (whereConditions.length > 0) {
      sql += " WHERE ";
      sql += whereConditions
        .map((cond, index) => {
          let clause = "";
          if (index > 0) {
            clause += ` ${cond.conjunction} `;
          }

          let value = cond.value;
          if (cond.operator === "LIKE") {
            value = `'%${value}%'`;
          } else if (typeof value === "string") {
            value = `'${value}'`;
          }

          clause += `${cond.column} ${cond.operator} ${value}`;
          return clause;
        })
        .join("");
    }

    // ORDER BY 절
    if (orderBy.length > 0) {
      sql += " ORDER BY ";
      sql += orderBy.map((o) => `${o.column} ${o.direction}`).join(", ");
    }

    // LIMIT 절
    if (limit > 0) {
      sql += ` LIMIT ${limit}`;
    }

    sql += ";";

    set({ generatedSQL: sql });
    return sql;
  },

  // 쿼리 결과
  setQueryResult: (result) => {
    set({ queryResult: result });
  },

  // 리셋
  reset: () => {
    set(initialState);
  },
}));
