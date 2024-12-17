module.exports = {
    presets: [
        [
            '@babel/preset-env',
            // 配置
            {
                // 指定需要兼容的浏览器
                targets: {
                    chrome: '58',
                    ie: '11'
                },
                useBuiltIns: 'usage', // 按需引入
                corejs: '3.39.0', // 指定corejs版本
            }
        ]
    ]
}