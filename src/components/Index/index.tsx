import Canvas from '@/components/Canvas';
import { txt2image } from '@/utils/api';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Carousel,
  Col,
  Descriptions,
  Image,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  notification,
} from 'antd';
import axios from 'axios';
import React from 'react';
import { CharParams, useCharSettings } from '../Settings/Char';
import { SdParams, useSdSettings } from '../Settings/Sd';
import styles from './style.scss';

const SIZE = 512;
const DEFAULT_ENDPOINT_HASH = 'c410d179b056797269a4a2188bdf8a48'; // 用来方便在混淆后替换环境变量的值

type ImageHistoryWithParams = { url: string; cost: number } & Partial<SdParams>;
type ImageHistory = ImageHistoryWithParams | string;

export default function () {
  const {
    data: sdStyles,
    loading: loadingStyles,
    runAsync: refreshStyles,
  } = useRequest<({ name: string } & Partial<CharParams & SdParams>)[], []>(
    async () => {
      const resp = await axios.get(
        'https://serverless-tool-images.oss-cn-hangzhou.aliyuncs.com/aigc/json/fc-ai-charact.json'
      );
      return resp?.data;
    }
  );

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

  const [imgs, setImages] = React.useState([]);
  // const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [imageHistory, setImageHistory] = useLocalStorage<ImageHistory[]>(
    'image_history',
    []
  );

  const isDev = React.useMemo(() => !!localStorage.getItem('development'), []);

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Typography.Title>AI 艺术字</Typography.Title>

      <Descriptions
        bordered
        size={'small'}
        extra={<Button onClick={() => localStorage.clear()}>清理缓存</Button>}
        column={24}
        labelStyle={{ width: '10em' }}
        contentStyle={{ maxWidth: 0 }}
        items={[
          {
            label: '样式',
            span: 24,
            children: (
              <div style={{ display: 'flex' }}>
                <Select
                  placeholder='配置内置的样式'
                  value={null}
                  style={{ width: '100%' }}
                  loading={loadingStyles}
                  options={[
                    ...(sdStyles || [])?.map((s) => ({
                      label: s.name,
                      value: s.name,
                    })),
                  ]}
                  onSelect={(v) => {
                    const style = (sdStyles || [])?.filter(
                      (s) => s.name === v
                    )?.[0];
                    if (!!style) {
                      setCharState((o) => ({ ...o, ...style }));
                      setSdState((o) => ({ ...o, ...style }));
                      notification.success({
                        message: `已配置为 ${style.name}`,
                      });
                    }
                  }}
                />
                <Button
                  style={{ flex: '0 0 0%', marginLeft: 4 }}
                  loading={loadingStyles}
                  onClick={() => refreshStyles()}
                >
                  {loadingStyles || <SyncOutlined />}
                </Button>
              </div>
            ),
          },
          ...charItems,
          ...sdItems,
        ]}
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
              const startTime = Date.now();
              const resp = await txt2image(sdState);
              const cost = Date.now() - startTime;

              const imageArr = resp?.data?.ossUrl || resp?.data?.images || [];
              setImages(
                imageArr
                  .filter(Boolean)
                  .map((img: string) =>
                    img.startsWith('http')
                      ? img
                      : `data:image/png;base64,${img}`
                  )
              );

              if (!!imageArr && imageArr.length > 0) {
                setImageHistory((o) => [
                  isDev ? { ...sdState, url: imageArr[0], cost } : imageArr[0],
                  ...(o || []),
                ]);
              }
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
        <Spin spinning={loading}>
          <div
            style={{
              width: SIZE,
              height: SIZE,
              border: '2px dotted #ccc',
              position: 'relative',
            }}
          >
            {!!loading && (
              <div
                style={{
                  position: 'relative',
                  top: '50%',
                  left: '50%',
                  width: 256,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                出图需要一定的时间，请耐心等待。长时间不使用需要重新初始化
                Stable Diffusion，这可能需要您等待模型初始化。
              </div>
            )}
            {!!imgs && !loading && (
              <Image.PreviewGroup>
                <Carousel>
                  {imgs.filter(Boolean).map((img) => (
                    <Image src={img} />
                  ))}
                </Carousel>
              </Image.PreviewGroup>
            )}
          </div>
        </Spin>
      </div>

      <hr style={{ borderTop: '2px dashed #ccc', margin: '2em 0' }} />

      <Image.PreviewGroup>
        <Row gutter={[24, 24]}>
          {imageHistory?.map((img, idx) => {
            const item = (
              typeof img === 'string' ? { url: img } : img
            ) as ImageHistoryWithParams;

            return (
              <Col
                xs={24}
                sm={8}
                // md={8}
                lg={6}
                // xl={4}
                xxl={4}
                key={item.url}
                className={styles['mask-container']}
              >
                {isDev && !!item.model && (
                  <div className={styles.mask}>
                    {`模型 ${item.model}\n步骤数 ${
                      item.steps
                    } ControlNet 范围 ${item.start}~${item.end}\n权重 ${
                      item.weight
                    }\n人脸修复 ${item.face}\n高清修复 ${
                      item.hr
                    } 高清修复步数 ${item.hrSteps}\n耗时 ${
                      Math.round((item.cost * 100) / 1000) / 100
                    }s`}
                  </div>
                )}
                <CloseOutlined
                  className={styles.close}
                  onClick={() => {
                    setImageHistory((o) => [
                      ...o.slice(0, idx),
                      ...o.slice(idx + 1),
                    ]);
                  }}
                />
                <Image src={item.url} width='100%' />
              </Col>
            );
          })}
        </Row>
      </Image.PreviewGroup>
    </Space>
  );
}
