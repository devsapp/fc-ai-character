import { Carousel, Image } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import React from 'react';
import styles from './styles.scss';

export function ImageCarousel(props: { images: string[] }) {
  const { images } = props;
  const ref = React.useRef<CarouselRef>(null);

  return (
    <Image.PreviewGroup>
      <Carousel ref={ref} dots={false}>
        {images.filter(Boolean).map((img) => (
          <Image src={img} />
        ))}
      </Carousel>

      {images && images.length > 1 && (
        <div className={styles.container}>
          {images.filter(Boolean).map((img, idx) => (
            <img
              src={img}
              key={img}
              onClick={() => {
                if (!!ref.current) ref.current.goTo(idx);
              }}
            />
          ))}
        </div>
      )}
    </Image.PreviewGroup>
  );
}
