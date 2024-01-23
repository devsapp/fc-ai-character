import Canvas from '@/components/Canvas';
import { txt2image } from '@/utils/api';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
Button,
Descriptions,
Space,
Spin,
Typography,
notification,
} from 'antd';
import axios from 'axios';
import React from 'react';
import { ImageCarousel } from '../ImageCarousel';
import { ImageHistory,ImgHistory } from '../ImageHistory';
import { ProgressBar } from '../ProgressBar';
import { CharParams,useCharSettings } from '../Settings/Char';
import { SdParams,useSdSettings } from '../Settings/Sd';
import styles from './style.scss';

const SIZE = 512;
const DEFAULT_ENDPOINT_HASH = 'c410d179b056797269a4a2188bdf8a48'; // 用来方便在混淆后替换环境变量的值

export default function () {
  const {
    data: sdStyles,
    loading: loadingStyles,
    runAsync: refreshStyles,
  } = useRequest<
    ({ name: string; img: string } & Partial<CharParams & SdParams>)[],
    []
  >(async () => {
    const resp = await axios.get(
      'https://serverless-tool-images.oss-cn-hangzhou.aliyuncs.com/aigc/json/fc-ai-character.json',
      { headers: { 'Cache-Control': 'no-cache' } }
    );

    return resp?.data;
  });

  const [charState, setCharState] = useLocalStorage<CharParams>('char', {
    fontAdvance: false,
    value: 'Hi',
    fontFamily: 'DingTalkJinBuTi',
    frontColor: '#fff',
    backgroundColor: '#ce2322',
    x: SIZE / 2,
    y: SIZE / 2,
    size: 256,
    shadow: 8,
  });
  const [sdState, setSdState] = useLocalStorage<SdParams>('sd', {
    sdAdvance: false,
    endpoint: DEFAULT_ENDPOINT_HASH.startsWith('http')
      ? DEFAULT_ENDPOINT_HASH
      : '',
    prompt:
      'chinese dragon, orange (fruit), fruit, petals, apple, mandarin orange, food, barefoot, goldfish, orange slice, confetti, open mouth, fire, 1girl, pants, closed eyes, smile,<lora:20240106-1704550485876:1>,',
    negativePrompt:
      '(worst quality, low quality:2),monochrome,zombie,overexposure,watermark,text,bad anatomy,bad hand,extra hands,extra fingers,too many fingers,fused fingers,bad arm,distorted arm,extra arms,fused arms,extra legs,missing leg,disembodied leg,extra nipples,detached arm,liquid hand,inverted hand,disembodied limb,small breasts,loli,oversized head,extra body,completely nude,extra navel,easynegative,(hair between eyes),sketch,duplicate,ugly,huge eyes,text,logo,worst face,(bad and mutated hands:1.3),(blurry:2),horror,geometry,bad_prompt,(bad hands),(missing fingers),multiple limbs,bad anatomy,(interlocked fingers:1.2),Ugly Fingers,(extra digit and hands and fingers and legs and arms:1.4),((2girl)),(deformed fingers:1.2),(long fingers:1.2),(bad-artist-anime),bad-artist,bad hand,extra legs,(ng_deepnegative_v1_75t),02-A2[芩潇功能]修手04完整版较推荐-bad_prompt,negative_hand-neg,Negfeet-neg,sketch,(worst quality:2),(low quality:2),(normal quality:2),low res,bad anatomy,bad hands,normal quality,((monochrome)),((abdominal muscle)),((grayscale:1.2)),disfigured,kitsch,ugly,oversaturated,grain,low-res,Deformed,blurry,bad anatomy,disfigured,poorly drawn face,mutation,mutated,extra limb,ugly,poorly drawn hands,missing limb,blurry,floating limbs,disconnected limbs,malformed hands,blur,out of focus,long neck,long body,ugly,disgusting,poorly drawn,childish,mutilated,mangled,old,surreal,big pussy,ugly pussy,deformed pussy,extra legs,nsfw,badhandv4,easynegative,nipples,mole,freckles,bad-hands-5,bad_prompt,badhandv4,',
    model: 'revAnimatedV1.2.2.safetensors',
    start: 2,
    end: 8,
    weight: 90,
    mask: '',
    steps: 20,
    face: true,
    hr: 2,
    hrSteps: 10,
    count: 4,
  });

  const charItems = useCharSettings(charState, setCharState);
  const sdItems = useSdSettings(sdState, setSdState);
  const setMask = React.useCallback(
    (img: string) => {
      setSdState((o) => ({
        ...o,
        mask: img.startsWith('data:image/png;base64,')
          ? img.slice('data:image/png;base64,'.length)
          : img,
      }));
    },
    [setSdState]
  );

  const [imgs, setImages] = React.useState<string[]>([]);
  // const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [imageHistory, setImageHistory] = useLocalStorage<ImgHistory[]>(
    'image_history',
    []
  );

  const [progress, setProgress] = React.useState<
    {
      progress: number;
      etaRelative: number;
    }[]
  >([]);

  return (
    <Space direction='vertical' style={{ width: '100%' }} size='large'>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginBottom: '2em',
        }}
      >
        <Space style={{ alignItems: 'end' }}>
          <Typography.Title style={{ margin: 0 }}>
            新年新气象，换个新头像
          </Typography.Title>
          <Typography.Text type='secondary'>
            基于函数计算 + Stable Diffusion API 解决方案生成AI文字头像
          </Typography.Text>
        </Space>

        <Space style={{ alignItems: 'end' }}>
          <Button onClick={() => localStorage.clear()}>清理缓存</Button>
          <Button
            style={{ flex: '0 0 0%', marginLeft: 4 }}
            loading={loadingStyles}
            onClick={() => refreshStyles()}
          >
            {loadingStyles || <SyncOutlined />}
          </Button>
        </Space>
      </Space>

      <Spin spinning={loadingStyles}>
        <Space className={styles.styles}>
          {(sdStyles || [])?.map((style) => (
            <div
              className={styles.item}
              onClick={() => {
                setCharState((o) => ({ ...o, ...style }));
                setSdState((o) => ({ ...o, ...style }));
                notification.success({
                  message: `已配置为 ${style.name}`,
                });
              }}
            >
              <img src={style.img} />
              <span>{style.name}</span>
            </div>
          ))}
        </Space>
      </Spin>

      <Descriptions
        bordered
        size={'small'}
        column={24}
        labelStyle={{ width: '10em' }}
        contentStyle={{ maxWidth: 0 }}
        items={[...charItems, ...sdItems]}
      />

      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Canvas params={charState} size={SIZE} callback={setMask} />

        <Button
          type='primary'
          loading={loading}
          onClick={async () => {
            try {
              setLoading(true);

              setImages([]);
              setProgress(
                Array(sdState.count).fill({ progress: 0, etaRelative: 0 })
              );

              await Promise.all(
                Array(sdState.count)
                  .fill(0)
                  .map(async (_, idx) => {
                    const startTime = Date.now();
                    const resp = await txt2image(sdState, (p) =>
                      setProgress((o) => [
                        ...o.slice(0, idx),
                        p,
                        ...o.slice(idx + 1),
                      ])
                    );
                    const cost = Date.now() - startTime;
                    const imageArr =
                      resp?.data?.ossUrl || resp?.data?.images || [];
                    if (imageArr.length > 0) {
                      const img = imageArr?.[0].startsWith('http')
                        ? imageArr?.[0]
                        : `data:image/png;base64,${imageArr?.[0]}`;
                      setImages((o) => [...o, img]);
                      setImageHistory((o) =>
                        [{ ...sdState, url: img, cost }, ...(o || [])].slice(
                          0,
                          50
                        )
                      );
                    }
                  })
              );
            } catch (e: any) {
              console.error(e);
              notification.error({
                message: `${e}`,
                description: e?.response?.data,
              });
              setImages([]);
            } finally {
              setLoading(false);
            }
          }}
        >
          生成 🚀
        </Button>

        <div
          style={{
            width: SIZE,
            height: SIZE,
            border: '2px dotted #ccc',
            position: 'relative',
          }}
        >
          {!!loading && (
            <div>
              {progress.map((p, idx) => (
                <ProgressBar
                  key={idx}
                  progress={p?.progress || 0}
                  eta={p?.etaRelative || 0}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `calc(${idx} * 1.5em)`,
                    zIndex: 100,
                  }}
                />
              ))}
            </div>
          )}
          {!!loading && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 256,
                transform: 'translate(-50%, -50%)',
                filter: 'opacity(0.5)',
              }}
            >
              出图需要一定的时间，请耐心等待。长时间不使用需要重新初始化 Stable
              Diffusion，这可能需要您等待模型初始化。
            </div>
          )}

          <Spin spinning={loading} style={{ minHeight: SIZE }}>
            <ImageCarousel images={imgs || []} />
          </Spin>
        </div>
      </div>

      <hr style={{ borderTop: '2px dashed #ccc', margin: '2em 0' }} />

      <ImageHistory
        imageHistory={imageHistory}
        setImageHistory={setImageHistory}
      />
    </Space>
  );
}
