import { useLocalStorageState } from 'ahooks';
import React from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [state, _setState] = useLocalStorageState<T>(key, {
    serializer: (value) => JSON.stringify(value),
    deserializer: (value) =>
      Array.isArray(defaultValue)
        ? JSON.parse(value)
        : { ...defaultValue, ...JSON.parse(value) },
    defaultValue,
  });

  const ref = React.useRef({ state });
  React.useEffect(() => {
    ref.current.state = state;
  }, [state]);

  const setState = React.useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (value) => {
      _setState(
        typeof value === 'function' ? (value as any)(ref.current.state) : value
      );
    },
    [ref, _setState]
  );

  return [state, setState] as [T, React.Dispatch<React.SetStateAction<T>>];
}
