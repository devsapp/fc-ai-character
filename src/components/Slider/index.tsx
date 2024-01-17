import { Slider as AntdSlider, InputNumber, Space } from 'antd';

export default function Slider(props: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const { value, onChange, min, max } = props;

  return (
    <Space.Compact style={{ width: '100%' }}>
      <AntdSlider
        value={value}
        onChange={(v) => onChange(v)}
        style={{ width: 'calc(100% - 100px)' }}
        min={min}
        max={max}
      />
      <InputNumber
        value={value}
        onChange={(v) => onChange(v || 0)}
        min={min}
        max={max}
      />
    </Space.Compact>
  );
}

export function Range(props: {
  valueL: number;
  valueR: number;
  onChange: (l: number, r: number) => void;
  min?: number;
  max?: number;
}) {
  const { valueL, valueR, onChange, max, min } = props;

  return (
    <Space.Compact style={{ width: '100%' }}>
      <InputNumber
        value={valueL}
        onChange={(v) => onChange(v || 0, valueR)}
        min={min}
        max={max}
      />
      <AntdSlider
        range
        value={[valueL, valueR]}
        onChange={(v: number[]) => onChange(v[0], v[1])}
        style={{ width: 'calc(100% - 200px)' }}
        max={max}
      />
      <InputNumber
        value={valueR}
        onChange={(v) => onChange(valueL, v || 0)}
        min={min}
        max={max}
      />
    </Space.Compact>
  );
}
