import { Space } from 'antd';
import React from 'react';
import { CharParams } from '../Settings/Char';

export default function (props: {
  params: CharParams;
  size: number;
  callback: (img: string) => void;
}) {
  const { params, size, callback } = props;
  const ref = React.useRef<HTMLCanvasElement>(null);

  const draw = React.useCallback(() => {
    if (ref?.current) {
      const canvas = ref?.current;
      const ctx = canvas.getContext('2d');
      if (!!ctx) {
        ctx.reset();

        // 背景
        ctx.fillStyle = params?.backgroundColor;
        ctx.fillRect(0, 0, size, size);

        // 字
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = params?.frontColor;
        ctx.fillStyle = params?.frontColor;
        ctx.strokeStyle = params?.frontColor;

        ctx.font = `bold ${params?.size}px ${params?.fontFamily}`;
        ctx.fillText(params?.value, params?.x, params?.y);

        //多画几遍光晕
        for (let i = params?.shadow; i > 0; i -= 1) {
          ctx.shadowBlur = i * 2;
          ctx.strokeText(params?.value, params?.x, params?.y);
        }

        callback(canvas.toDataURL('image/png'));
      }
    }
  }, [ref?.current, params, callback]);

  React.useEffect(() => {
    document.fonts.ready.then(() => {
      draw();
    });
  }, [draw, params?.fontFamily]);

  return (
    <Space>
      <canvas
        ref={ref}
        width={size}
        height={size}
        style={{ border: '2px dotted #ccc' }}
      />
    </Space>
  );
}
