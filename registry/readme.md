
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ${模版名称}` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# fc-ai-character 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-ai-character&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-ai-character" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-ai-character&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-ai-character" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-ai-character&type=packageDownload">
  </a>
</p>

<description>

通过 Stable Diffusion Serverless API，进行艺术字创作

</description>

<codeUrl>

- [:smiley_cat: 代码](https://github.com/devsapp/fc-ai-character)

</codeUrl>
<preview>



</preview>


## 前期准备

使用该项目，您需要有开通以下服务：

<service>



| 服务 |  备注  |
| --- |  --- |
| 函数计算 FC |  提供计算资源 |

</service>

推荐您拥有以下的产品权限 / 策略：
<auth>
</auth>

<remark>

您还需要注意：   
本项目依赖于 Stable Diffusion Serverless API，您可以在 函数计算 - 应用 部署 Stable Diffusion，并开启 Serverless API 后使用本项目

</remark>

<disclaimers>

免责声明：   
该项目通过加载本地字体及部分网络字体生成双色字体图片，通过 Stable Diffusion 接口调用 ControlNet Tail 模型进行 AI 绘图，字体及模型版权将由用户提供。

</disclaimers>

## 部署 & 体验

<appcenter>
   
- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=fc-ai-character) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=fc-ai-character) 该应用。
   
</appcenter>
<deploy>
    
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-ai-character -d fc-ai-character`
  - 进入项目，并进行项目部署：`cd fc-ai-character && s deploy -y`
   
</deploy>

## 应用详情

<appdetail id="flushContent">

1. 部署 Stable Diffusion 应用
2. 开通 Serverless API 功能
3. 部署艺术字（当前）应用，填写 Serverless API 的地址
4. 进入应用页面，开始出图

</appdetail>

## 使用文档

<usedetail id="flushContent">
</usedetail>


<devgroup>


## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">  

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                         | <center>微信小助手：`xiaojiangwh`</center>                                                                                        | <center>钉钉交流群：`33947367`</center>                                                                                           |
</p>
</devgroup>
