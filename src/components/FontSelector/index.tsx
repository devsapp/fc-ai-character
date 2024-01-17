import { Input, Select, Spin } from 'antd';
import React from 'react';
import { isFontInstalled } from './check';
import { fontList } from './fonts';

export function FontSelector(props: {
  value: string;
  onChange: (font: string) => void;
}) {
  const localFonts = React.useMemo(
    () => [
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
      ...fontList.filter((f) => isFontInstalled(f.family)),
    ],
    []
  );
  const [fonts, setFonts] = React.useState(localFonts);

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
        >
          <Select.Option key='custom' value='customfont'>
            自定义字体
          </Select.Option>

          {fonts.map((f) => (
            <Select.Option key={`${f.family} ${f.fullName}`} value={f.family}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ marginRight: '2em' }}>
                  {`${f.fullName}(${f.family})`}
                </span>
                <span style={{ fontFamily: f.family }}>
                  Hello，新年快乐 😊 ！
                </span>
              </div>
            </Select.Option>
          ))}
        </Select>

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

                setFonts((f) => [
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
