import { CloseOutlined } from '@ant-design/icons';
import { Col, Image, Pagination, Row, Space } from 'antd';
import React from 'react';
import { SdParams } from '../Settings/Sd';
import styles from './style.scss';

export type ImgHistoryWithParams = {
  url: string;
  cost: number;
} & Partial<SdParams>;
export type ImgHistory = ImgHistoryWithParams | string;

export function ImageHistory(props: {
  imageHistory: ImgHistory[];
  setImageHistory: React.Dispatch<React.SetStateAction<ImgHistory[]>>;
}) {
  const { imageHistory, setImageHistory } = props;
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(12);

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>
      <span>
        当前浏览器最新的部分出图历史，图片存储于
        OSS，进可在有效期内访问。如需查看较久前的图片，请前往 OSS Bucket 查看。
      </span>

      <Image.PreviewGroup>
        <Row gutter={[24, 24]}>
          {imageHistory
            ?.slice((page - 1) * pageSize, page * pageSize)
            ?.map((img, idx) => {
              const item = (
                typeof img === 'string' ? { url: img } : img
              ) as ImgHistoryWithParams;

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
                  {!!item.model && (
                    <div className={styles.mask}>
                      {`模型 ${item.model}\n步骤数 ${
                        item.steps
                      } ControlNet 范围 ${item.start}~${item.end}\n权重 ${
                        item.weight
                      }\n人脸修复 ${item.face}\n高清修复 ${
                        item.hr
                      }\n高清修复步数 ${item.hrSteps}\n耗时 ${
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

      <Pagination
        pageSizeOptions={[12, 24, 48]}
        showSizeChanger
        hideOnSinglePage
        pageSize={pageSize}
        current={page}
        total={imageHistory?.length || 0}
        onChange={(p, pz) => {
          setPage(p);
          setPageSize(pz);
        }}
        style={{ textAlign: 'right' }}
      />
    </Space>
  );
}
