"use client";

import { useEffect, useState } from "react";
import { HomeButton } from "@/components/ui/HomeButton";

interface RawRow {
  transaction_type: string;
  category_large: string;
  category_small: string;
  description: string;
  total: number;
}

interface TreeNode {
  label: string;
  amount: number;
  children?: TreeNode[];
}

function groupData(rows: RawRow[]): TreeNode[] {
  const map = new Map<string, TreeNode>();

  for (const row of rows) {
    const { transaction_type, category_large, category_small, description } = row;
    const total = Number(row.total);

    if (!transaction_type || !category_large || !category_small || !description) continue;

    if (!map.has(transaction_type)) {
      map.set(transaction_type, { label: transaction_type, amount: 0, children: [] });
    }
    const typeNode = map.get(transaction_type)!;
    typeNode.amount += total;

    let largeNode = typeNode.children!.find(n => n.label === category_large);
    if (!largeNode) {
      largeNode = { label: category_large, amount: 0, children: [] };
      typeNode.children!.push(largeNode);
    }
    largeNode.amount += total;

    let smallNode = largeNode.children!.find(n => n.label === category_small);
    if (!smallNode) {
      smallNode = { label: category_small, amount: 0, children: [] };
      largeNode.children!.push(smallNode);
    }
    smallNode.amount += total;

    let descNode = smallNode.children!.find(n => n.label === description);
    if (!descNode) {
      descNode = { label: description, amount: total };
      smallNode.children!.push(descNode);
    } else {
      descNode.amount += total;
    }
  }

  return Array.from(map.values());
}

function formatAmount(amount: number): string {
  return `${amount < 0 ? '-' : ''}${Math.abs(amount).toLocaleString()}원`;
}

function getTreeSymbol(children: TreeNode[] | undefined, expanded: boolean): string {
  if (!children) return "•";
  return expanded ? "🔽" : "▶️";
}

function TreeItem({ node }: Readonly<{ node: TreeNode }>) {
  const [expanded, setExpanded] = useState(false);
  const levelStyle = expanded ? "bg-gray-50" : "bg-white";
  const rowClass = `cursor-pointer hover:bg-gray-100 grid grid-cols-[auto_1fr_auto] items-center w-full text-left py-1 px-2 gap-1 rounded transition ${levelStyle}`;

  return (
    <div className="ml-2 border-l border-dashed pl-2">
      <button role="treeitem" aria-selected="false"
        tabIndex={0}
        className={rowClass}
        onClick={() => node.children && setExpanded(!expanded)}
      >
        <span className="truncate font-medium text-sm leading-relaxed col-span-1">
          {getTreeSymbol(node.children, expanded)} {node.label}
        </span>
        <span className="text-right font-semibold text-gray-800 tracking-tight">
          {formatAmount(node.amount)}
        </span>
      </button>
      {expanded && node.children && (
        <div className="ml-2 border-l pl-2">
          {node.children.map((child) => (
            <TreeItem key={child.label} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SummaryPage() {
  const [month, setMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const [tree, setTree] = useState<TreeNode[]>([]);

  useEffect(() => {
    fetch(`/api/summary?month=${month}`)
      .then((res) => res.json())
      .then((data: RawRow[]) => {
        setTree(groupData(data));
      });
  }, [month]);

  return (
    <div className="relative p-6 space-y-4">
      {<HomeButton />}
      <h1 className="text-2xl font-bold">수입/지출 요약</h1>
      <div>
        <label htmlFor="month" className="mr-2 font-medium">월 선택:</label>
        <input
          id="month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
      <div className="space-y-1" style={{width:'50%'}}>
        {tree.map((node) => (
          <TreeItem key={node.label} node={node} />
        ))}
      </div>
    </div>
  );
}