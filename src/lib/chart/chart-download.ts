/**
 * SVG 요소를 PNG 이미지로 다운로드하는 유틸리티 함수
 */

export interface DownloadChartOptions {
  chartType: string;
  backgroundColor?: string;
}

/**
 * 차트 영역의 SVG를 PNG 이미지로 다운로드
 */
export async function downloadChartAsPNG(
  chartElement: HTMLElement,
  options: DownloadChartOptions
): Promise<void> {
  const { chartType, backgroundColor = "white" } = options;

  const svgElement = chartElement.querySelector("svg");
  if (!svgElement) {
    throw new Error("chart 안에서 SVG 요소를 찾을 수 없습니다.");
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 콘텐츠를 이용할 수 없습니다.");
  }

  const svgBlob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("PNG blob를 만드는데 실패했습니다."));
            return;
          }

          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          link.download = `chart-${chartType}-${timestamp}.png`;
          link.href = downloadUrl;
          link.click();

          URL.revokeObjectURL(downloadUrl);
          resolve();
        });
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG 이미지를 로드하는데 실패했습니다."));
    };

    img.src = url;
  });
}

/**
 * 파일명에 사용할 타임스탬프 생성
 */
export function generateTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

/**
 * 차트 타입에 따른 기본 파일명 생성
 */
export function generateChartFilename(chartType: string): string {
  const timestamp = generateTimestamp();
  return `chart-${chartType}-${timestamp}.png`;
}
