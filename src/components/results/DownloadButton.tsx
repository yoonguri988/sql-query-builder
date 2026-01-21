"use client";

import { Download } from "lucide-react";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DownloadButtonProps {
  data: Record<string, unknown>[];
  filename?: string;
  disabled?: boolean;
}

export default function DownloadButton({
  data,
  filename,
  disabled = false,
}: DownloadButtonProps) {
  // 데이터가 없으면 버튼 비활성화
  if (data.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="h-4 w-4 mr-2" />
        CSV 내려받기
      </Button>
    );
  }

  // CSV 헤더 추출
  const headers = Object.keys(data[0]).map((key) => ({
    label: key,
    key: key,
  }));

  // 파일명 생성 (타임스탬프 포함)
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  const csvFilename = filename || `query_results_${timestamp}.csv`;

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={csvFilename}
      className="inline-flex"
    >
      <Button variant="outline" size="sm" disabled={disabled}>
        <Download className="h-4 w-4 mr-2" />
        CSV 내려받기
      </Button>
    </CSVLink>
  );
}
