const a = require('./script/a')

import "~/assets/css/main.scss"


// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}