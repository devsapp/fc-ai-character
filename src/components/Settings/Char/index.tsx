import { FontSelector } from '@/components/FontSelector';
import Slider from '@/components/Slider';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Input, Typography } from 'antd';
import React from 'react';

const SIZE = 512;

export type CharParams = {
  fontAdvance: boolean;
  value: string;
  fontFamily: string;
  frontColor: string;
  backgroundColor: string;
  x: number;
  y: number;
  size: number;
  shadow: number;
};

export function useCharSettings(
  state: CharParams,
  setState: React.Dispatch<React.SetStateAction<CharParams>>
) {
  const items = React.useMemo(() => {
    const {
      fontAdvance,
      value,
      fontFamily,
      frontColor,
      backgroundColor,
      x,
      y,
      size,
      shadow,
    } = state;
    return [
      {
        label: '文字内容',
        span: 24,
        children: (
          <div style={{ display: 'flex' }}>
            <Input
              placeholder='请输入您需要的字'
              value={value}
              onChange={(e) =>
                setState((o) => ({ ...o, value: e?.target?.value || '' }))
              }
              suffix={
                <Typography.Text
                  type='secondary'
                  style={{ pointerEvents: 'none' }}
                >
                  建议少于2个汉字，文字结构复杂影响生成效果
                </Typography.Text>
              }
            />
            <Button
              style={{ flex: '0 0 0%', marginLeft: 4 }}
              onClick={() => {
                setState((o) => ({ ...o, fontAdvance: !o?.fontAdvance }));
              }}
            >
              高级设置
              {fontAdvance ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </div>
        ),
      },

      ...(fontAdvance
        ? [
            {
              label: '字体',
              span: 24,
              children: (
                <FontSelector
                  value={fontFamily}
                  onChange={(v) => setState((o) => ({ ...o, fontFamily: v }))}
                />
              ),
            },
            {
              label: '前景色',
              span: 12,
              children: (
                <ColorPicker
                  value={frontColor}
                  onChange={(_, v) =>
                    setState((o) => ({ ...o, frontColor: v }))
                  }
                  showText
                />
              ),
            },
            {
              label: '背景色',
              span: 12,
              children: (
                <ColorPicker
                  value={backgroundColor}
                  onChange={(_, v) =>
                    setState((o) => ({ ...o, backgroundColor: v }))
                  }
                  showText
                />
              ),
            },
            {
              label: 'x',
              span: 12,
              children: (
                <Slider
                  value={x}
                  onChange={(v) => setState((o) => ({ ...o, x: v }))}
                  max={SIZE}
                />
              ),
            },
            {
              label: 'y',
              span: 12,
              children: (
                <Slider
                  value={y}
                  onChange={(v) => setState((o) => ({ ...o, y: v }))}
                  max={SIZE}
                />
              ),
            },

            {
              label: '字体大小',
              span: 12,
              children: (
                <Slider
                  value={size}
                  onChange={(v) => setState((o) => ({ ...o, size: v }))}
                  max={SIZE * 2}
                />
              ),
            },

            {
              label: '边缘发光',
              span: 12,
              children: (
                <Slider
                  value={shadow}
                  onChange={(v) => setState((o) => ({ ...o, shadow: v }))}
                  max={64}
                />
              ),
            },
            {
              label: '其他操作',
              span: 24,
              children: (
                <Button
                  onClick={() =>
                    setState((o) => ({ ...o, x: SIZE / 2, y: SIZE / 2 }))
                  }
                >
                  文字居中
                </Button>
              ),
            },
          ]
        : []),
    ].filter(Boolean) as {
      label: string;
      span: number;
      children: JSX.Element;
    }[];
  }, [state]);

  return items;
}
