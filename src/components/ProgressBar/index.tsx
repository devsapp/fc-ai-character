import { toFloat } from '@/utils/helper';
import React from 'react';

export function ProgressBar(props: {
  progress: number;
  eta: number;
  style?: React.CSSProperties;
}) {
  const { progress, eta, style } = props;

  return (
    <div
      style={{
        ...style,
        background: '#aaa',
        color: 'white',
        width: '100%',
      }}
    >
      <div
        style={{
          zIndex: 2,
          position: 'relative',
          padding: '0 1em',
        }}
      >
        {`进度 ${toFloat(progress * 100) || 0}%，预计剩余时间 ${
          toFloat(eta) || 0
        }s`}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${(progress || 0) * 100}%`,
          height: '100%',
          background: '#27adfa',
        }}
      />
    </div>
  );
}
