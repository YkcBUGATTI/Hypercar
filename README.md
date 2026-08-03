# HYPERCAR.SITE · 门户页

> 超级跑车纪实入口:Bugatti Tourbillon、Ferrari F80,与更多即将加入的传奇
> 版本: v2.0 · 2026-08

## 结构

```
hypercar-site/
├── index.html    中文版(含海外 IP 自动跳转英文)
├── en.html       英文版
├── css/style.css 样式(深色 · 双品牌色 · 子站同款排版气质)
├── js/main.js    交互(光标 / 卡片左右入场 / 数字滚动 / 视频视口播放)
└── assets/
    ├── tourbillon.webp / f80.webp   视频封面(poster)
    └── videos/
        ├── tourbillon.mp4  布加迪官方氛围视频
        └── f80.mp4         法拉利官方整车视频
```

## 新增网站(可扩展)

门户按"编号卡列表"设计,每张卡 = 一行(视频 + 文字)。加新站:
1. 复制一段 `.door` 卡片 HTML(见 index.html 的 `01`/`02` 结构),编号改 `03`/`04`...
2. 视频放 `assets/videos/`,图放 `assets/`
3. 链接指向新子域名,品牌色在 CSS 加一条 `--xxx` 规则(或复用红/蓝)

中英文两个文件都要加。

## 部署(www.hypercar.site)

### Cloudflare Pages(推荐)
1. Cloudflare → Workers & Pages → 上传 `hypercar-site/` 内容
2. 自定义域添加 `www.hypercar.site`,DNS 加 CNAME `www` → Pages 域名
3. 根域直达门户(可选):另加 CNAME `@` → Pages 域名

### GitHub Pages
1. 推送 `hypercar-site/` 到仓库 main
2. Settings → Pages → 部署 main
3. DNS:CNAME `www` → `YkcBUGATTI.github.io`(灰云,等 HTTPS)

## 合规

粉丝自制门户页,商标、图片、视频版权归 Bugatti Automobiles S.A.S. 与 Ferrari S.p.A. 所有,页脚已保留声明。
