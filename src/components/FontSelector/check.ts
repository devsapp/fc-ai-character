// 此代码来自 https://www.zhangxinxu.com/wordpress/2018/02/js-detect-suppot-font-family/
export function isFontInstalled(fontFamily: string) {
  if (typeof fontFamily != 'string') {
    return false;
  }

  var defaultFontFamily = 'Arial';
  if (fontFamily.toLowerCase() == defaultFontFamily.toLowerCase()) {
    return true;
  }

  var defaultLetter = 'a';
  var defaultFontSize = 100;

  // 使用该字体绘制的canvas
  var width = 100,
    height = 100;
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  if (!!context) {
    // 全局一致的绘制设定
    context.textAlign = 'center';
    context.fillStyle = 'black';
    context.textBaseline = 'middle';

    return (
      getFontData(
        defaultFontFamily,
        context,
        width,
        height,
        defaultFontSize,
        defaultFontFamily,
        defaultLetter
      ).join('') !==
      getFontData(
        fontFamily,
        context,
        width,
        height,
        defaultFontSize,
        defaultFontFamily,
        defaultLetter
      ).join('')
    );
  }
  return false;
}

function getFontData(
  fontFamily: string,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  defaultFontSize: number,
  defaultFontFamily: string,
  defaultLetter: string
) {
  // 清除
  context.clearRect(0, 0, width, height);
  // 设置字体
  context.font =
    defaultFontSize + 'px ' + fontFamily + ', ' + defaultFontFamily;
  context.fillText(defaultLetter, width / 2, height / 2);

  var data = context.getImageData(0, 0, width, height).data;

  return [].slice.call(data).filter(function (value) {
    return value != 0;
  });
}