import { Input,Select,Spin } from 'antd';
import React from 'react';
import { Option } from './Option';
import { isFontInstalled } from './check';
import { fontList } from './fonts';

const builtinFonts = [
  {
    family: 'AlibabaPuHuiTi-3-55',
    fullName: '阿里巴巴普惠体',
  },
  {
    family: 'AlimamaFangYuanTiVF',
    fullName: '阿里妈妈方圆体',
  },
  {
    family: 'AlimamaAgileVF',
    fullName: '阿里妈妈灵动体',
  },
  {
    family: 'AlimamaDaoLiTi',
    fullName: '阿里妈妈刀隶体',
  },
  {
    family: 'AlimamaShuHeiTi',
    fullName: '阿里妈妈数黑体',
  },
  {
    family: 'AlimamaDongFangDaKai',
    fullName: '阿里妈妈东方大楷',
  },
  {
    family: 'DingTalkJinBuTi',
    fullName: '钉钉进步体',
  },
];

export function FontSelector(props: {
  value: string;
  onChange: (font: string) => void;
}) {
  const localFonts = React.useMemo(
    () => [...fontList.filter((f) => isFontInstalled(f.family))],
    []
  );
  const [remoteFonts, setRemoteFonts] = React.useState<
    {
      family: string;
      fullName: string;
    }[]
  >([]);

  const { value, onChange } = props;
  const [loading, setLoading] = React.useState(false);
  const [fontUrl, setFontUrl] = React.useState('');

  const ref = React.useRef<HTMLStyleElement | undefined>(undefined);
  React.useEffect(() => {
    return () => {
      if (!!ref.current) ref.current.remove();
    };
  }, [ref]);

  return (
    <Spin spinning={loading} style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Select
          style={{ width: value === 'customfont' ? '49%' : '100%' }}
          value={value}
          onChange={onChange}
          options={[
            {
              label: '远程加载的字体',
              options: remoteFonts.map((item) => ({
                key: `${item.fullName}(${item.family})`,
                label: <Option family={item.family} fullName={item.fullName} />,
                value: item.family,
              })),
            },
            {
              label: '内置字体',
              options: builtinFonts.map((item) => ({
                key: `${item.fullName}(${item.family})`,
                label: <Option family={item.family} fullName={item.fullName} />,
                value: item.family,
              })),
            },
            {
              label: '本地字体',
              options: localFonts.map((item) => ({
                key: `${item.fullName}(${item.family})`,
                label: <Option family={item.family} fullName={item.fullName} />,
                value: item.family,
              })),
            },
          ]}
        />

        {value === 'customfont' && (
          <Input
            style={{ width: '50%' }}
            placeholder='请填入字体文件地址'
            defaultValue={fontUrl}
            onChange={async (e) => {
              setLoading(true);
              try {
                const fontUrl = e?.target?.value || '';
                setFontUrl(fontUrl);

                const fontName = `customfont-${
                  fontUrl.split('/').pop()?.split('.')?.[0]
                }`;

                console.log('start to load font', fontName, fontUrl);
                const font = new FontFace(fontName, `url(${fontUrl})`);
                document.fonts.add(font);
                await font.load();
                console.log('load finish');

                setRemoteFonts((f) => [
                  {
                    family: fontName,
                    fullName: '自定义字体',
                  },
                  ...f,
                ]);
                onChange(fontName);
              } catch (e) {
                console.error(e);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </div>
    </Spin>
  );
}
