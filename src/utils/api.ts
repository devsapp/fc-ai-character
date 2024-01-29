import { SdParams } from '@/components/Settings/Sd';
import { notification } from 'antd';
import axios from 'axios';

const MaxRetryTimes = 2;

export async function txt2image(
  params: SdParams,
  asyncCallback?: (progress: any) => any
) {
  if (!!asyncCallback) asyncCallback({ progress: 0, etaRelative: 0 });

  const sdParams = {
    prompt: params?.prompt,
    negative_prompt: params?.negativePrompt,
    steps: params.steps,
    n_iter: 1, // 迭代步数
    height: 512,
    width: 512,
    sampler_index: 'DPM++ 2M Karras',
    sampler_name: 'DPM++ 2M Karras',
    batch_size: 1,
    denoising_strength: 0.7, // 噪声抑制强度
    enable_hr: params.hr > 1,
    hr_scale: params.hr,
    hr_upscaler: 'Latent',
    hr_second_pass_steps: params.hrSteps,
    override_settings: {
      sd_model_checkpoint: params.model,
    },
    alwayson_scripts: {
      ...(params.weight > 0 && params.end - params.start > 0
        ? {
            controlnet: {
              args: [
                {
                  control_mode: 0,
                  enabled: true,
                  guidance_start:
                    Math.round((params?.start / params.steps) * 100) / 100, // 起始步数
                  guidance_end:
                    Math.round((params?.end / params.steps) * 100) / 100, // 结束步数
                  input_image: params?.mask,
                  model: 'control_v11f1e_sd15_tile', // 模型
                  // module: 'softedge_pidinet', // 预处理器
                  pixel_perfect: true,
                  resize_mode: 1, // 0 Just Resize; 1 Scale to Fit (Inner Fit); 2 Envelope (Outer Fit)
                  lowvram: false,
                  processor_res: 64, // 预处理器分辨率
                  weight: params?.weight / 100, // 权重
                },
              ],
            },
          }
        : {}),
      ...(params.face
        ? {
            ADetailer: {
              args: [
                {
                  ad_model: 'mediapipe_face_full',
                  ad_use_inpaint_width_height: true,
                  ad_denoising_strength: 0.4,
                },
              ],
            },
          }
        : {}),
    },
  };

  let retryTimes = MaxRetryTimes;
  while (!!retryTimes) {
    const resp = await axios.post(
      `${params?.endpoint}/txt2img`,
      {
        stable_diffusion_model: params.model,
        ...sdParams,
      },
      {
        headers: { 'Request-Type': asyncCallback ? 'async' : 'sync' },
      }
    );

    if (!!resp?.data) {
      if (!!asyncCallback) {
        const taskId = resp?.data?.taskId;

        while (true) {
          const res = await getProgress(params.endpoint, taskId);
          asyncCallback(res?.data);
          if (res?.data?.progress >= 1) {
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        while (true) {
          const res = await getResult(params.endpoint, taskId);
          if (res?.data?.status === 'succeeded') {
            return res;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } else {
        // 同步模式可以直接返回
        return resp;
      }
    }
  }

  throw new Error(`重试 ${MaxRetryTimes} 次后，失败`);
}

export async function getProgress(endpoint: string, taskId: string) {
  return axios.get(`${endpoint}/tasks/${taskId}/progress`);
}

export async function getResult(endpoint: string, taskId: string) {
  return axios.get(`${endpoint}/tasks/${taskId}/result`);
}

export async function getModels(endpoint: string): Promise<
  {
    config: null;
    filename: string;
    hash: string;
    model_name: string;
    sha256: string;
    title: string;
  }[]
> {
  if (!endpoint) return [];

  try {
    const resp = await axios.get(`${endpoint}/sdapi/v1/sd-models`, {
      // headers: { 'Request-Type': 'sync' },
    });

    if (resp.status !== 200) throw resp;
    if (!Array.isArray(resp?.data))
      throw resp?.data?.Message || resp?.data?.errorMsg;

    return resp?.data;
  } catch (e: any) {
    console.error(e);
    notification.error({
      message: `${e}`,
      description: e?.response?.data,
    });
    return [];
  }
}
