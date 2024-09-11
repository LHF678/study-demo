
/**
 * @description
 * @param {obj} 参数
 * @return void
 */
function observe (obj) {
    for (let key in obj) {
        let internalValue = obj[key]
        const funcs = new Set() // 依赖收集器
        Object.defineProperty(obj, key, {
            get () {
                // 依赖收集
                if (window.__func) {
                    funcs.add(window.__func)
                }
                return internalValue
            },
            set (val) {
                internalValue = val
                // 派发更新
                for (let func of funcs) {
                    func()
                }
            }
        })
    }
}

function autoRun (func) {
    window.__func = func
    func()
    // 依赖收集完置成 null
    window.__func = null
}
