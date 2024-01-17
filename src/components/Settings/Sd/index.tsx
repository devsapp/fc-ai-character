import Slider, { Range } from '@/components/Slider';
import { getModels } from '@/utils/api';
import { DownOutlined, SyncOutlined, UpOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Input, Select, Switch } from 'antd';
import React from 'react';

export type SdParams = {
  sdAdvance: boolean;
  endpoint: string;
  prompt: string;
  negativePrompt: string;
  model: string;
  start: number;
  end: number;
  weight: number;
  mask: string;
  steps: number;
  face: boolean; // 人脸修复
  hr: number; // 高清修复
  hrSteps: number; // 高清修复步骤数
};

export function useSdSettings(
  state: SdParams,
  setState: React.Dispatch<React.SetStateAction<SdParams>>
) {
  const isDev = React.useMemo(() => {
    return !!localStorage.getItem('development');
  }, []);

  const {
    data: models,
    loading,
    runAsync,
  } = useRequest(() => getModels(state?.endpoint), {
    refreshDeps: [state?.endpoint],
  });

  const items = React.useMemo(() => {
    const {
      sdAdvance,
      endpoint,
      prompt,
      negativePrompt,
      start,
      end,
      weight,
      model,
      steps,
      hr,
      hrSteps,
      face,
    } = state;

    return [
      {
        label: 'SD 地址',
        span: 24,
        children: (
          <div style={{ display: 'flex' }}>
            <Input
              placeholder='http://example.com'
              value={endpoint}
              onChange={(e) =>
                setState((o) => ({ ...o, endpoint: e?.target?.value || '' }))
              }
            />
            {isDev && (
              <Button
                style={{ flex: '0 0 0%', marginLeft: 4 }}
                onClick={() => {
                  setState((o) => ({ ...o, sdAdvance: !o?.sdAdvance }));
                }}
              >
                高级设置
                {sdAdvance ? <UpOutlined /> : <DownOutlined />}
              </Button>
            )}
          </div>
        ),
      },

      ...(sdAdvance && isDev
        ? [
            {
              label: '提示词',
              span: 24,
              children: (
                <Input.TextArea
                  value={prompt}
                  onChange={(e) =>
                    setState((o) => ({ ...o, prompt: e?.target?.value || '' }))
                  }
                  rows={5}
                />
              ),
            },
            {
              label: '反向提示词',
              span: 24,
              children: (
                <Input.TextArea
                  value={negativePrompt}
                  onChange={(e) =>
                    setState((o) => ({
                      ...o,
                      negativePrompt: e?.target?.value || '',
                    }))
                  }
                  rows={5}
                />
              ),
            },
            {
              label: '模型',
              span: 24,
              children: (
                <div style={{ display: 'flex' }}>
                  <Select
                    value={model}
                    onChange={(v) => {
                      setState((o) => ({ ...o, model: v }));
                    }}
                    style={{ width: '100%' }}
                    options={models?.map((item) => ({
                      label: item.model_name,
                      key: item.hash,
                      value: item.title?.split(' [')?.[0],
                    }))}
                  />
                  <Button
                    style={{ flex: '0 0 50px', marginLeft: 4 }}
                    onClick={() => runAsync()}
                    loading={loading}
                  >
                    {!loading && <SyncOutlined />}
                  </Button>
                </div>
              ),
            },
            {
              label: '迭代步数',
              span: 12,
              children: (
                <Slider
                  value={steps}
                  onChange={(v) => setState((o) => ({ ...o, steps: v }))}
                  max={200}
                />
              ),
            },
            {
              label: '文字生效步骤',
              span: 12,
              children: (
                <Range
                  valueL={start}
                  valueR={end}
                  onChange={(l, r) =>
                    setState((o) => ({ ...o, start: l, end: r }))
                  }
                  max={steps}
                />
              ),
            },
            {
              label: '文字权重',
              span: 12,
              children: (
                <Slider
                  value={weight}
                  onChange={(v) => setState((o) => ({ ...o, weight: v }))}
                  max={200}
                />
              ),
            },
            {
              label: '人脸修复',
              span: 12,
              children: (
                <Switch
                  value={face}
                  onChange={(v) => setState((o) => ({ ...o, face: v }))}
                />
              ),
            },
            {
              label: '高清放大倍数',
              span: 12,
              children: (
                <Slider
                  value={hr}
                  onChange={(v) => setState((o) => ({ ...o, hr: v }))}
                  min={1}
                  max={8}
                />
              ),
            },
            {
              label: '高清放大步数',
              span: 12,
              children: (
                <Slider
                  value={hrSteps}
                  onChange={(v) => setState((o) => ({ ...o, hrSteps: v }))}
                  max={200}
                />
              ),
            },
          ]
        : []),
    ];
  }, [state, loading, models, runAsync, isDev]);

  return items;
}
