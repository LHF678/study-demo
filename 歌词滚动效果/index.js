const doms = {
    audio: document.querySelector('audio'),
    container: document.querySelector('.container'),
    wrapper: document.querySelector('.wrapper')
}

/**
 * @description 解析数据
 * @return {Array} [{time: '', text: '}]
 */
function parseLrc () {
    return lrc.split('\n').map(text => {
        const arr = text.match(/\[(\d{2}:\d{2}\.\d{2})\]([\s\S]+)/) || []
        return {
            time: arr[1] ? parseTime2second(arr[1]) : '',
            text: arr[2] || ''
        }
    })
}

/**
 * @description 字符串时间转秒
 * @param {string} time 时间
 * @return {number} 秒
 */
function parseTime2second (time) {
    const arr = time.split(':')
    return +arr[0] * 60 + +arr[1]
}

const lrcData = parseLrc()

/**
 * @description 计算出，当前播放时间对应的数据集合下标
 * @return {number} 下标
 */
function findIndex() {
    const currentTime = doms.audio.currentTime
    const index = lrcData.findIndex(item => currentTime < item.time)
    // 如果找不到说明已经播放到最后
    if (index === -1) return lrcData.length - 1
    return index - 1
}

/**
 * @description 绘制歌词
 * @param info 参数
 * @return void
 */
function drawLrcElements () {
    /**
     * 插入 DOM 元素时会引起浏览器回流，然而在频繁做插入操作时，回流会严重影响性能
     * 所以可以使用 createDocumentFragment (创建一个新的空白的文档片段) 来优化
     *
     * 因为文档片段存在于内存中，并不在 DOM 树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。
     * 因此，使用文档片段通常会带来更好的性能
     */
    const frag = document.createDocumentFragment()
    for(let i = 0; i < lrcData.length; i++) {
        const li = document.createElement('li')
        li.textContent = lrcData[i].text
        frag.appendChild(li)
    }
    doms.wrapper.appendChild(frag)
}

drawLrcElements()


// 容器高度
const containerHeight = doms.container.clientHeight
// ul 高度
const wrapperHeight = doms.wrapper.clientHeight
// li 高度
const liHeight = doms.wrapper.children[0].clientHeight

/**
 * @description 设置歌词滚动位置
 * @param info 参数
 * @return void
 */

function setOffsetTop () {
    const index = findIndex()
    // 计算出当前歌词的偏移量
    let offsetTop = (liHeight * index + liHeight / 2) - containerHeight / 2
    // 最小偏移
    offsetTop = Math.max(0, offsetTop)
    // 最大偏移
    offsetTop = Math.min(offsetTop, wrapperHeight - containerHeight)
    doms.wrapper.style.transform = `translateY(-${offsetTop}px)`

    // 添加歌词高亮
    let _li = doms.wrapper.querySelector('.active')
    if (_li) {
        _li.classList.remove('active')
    }
    _li = doms.wrapper.children[index]
    if (_li) {
        _li.classList.add('active')
    }
}

doms.audio.addEventListener('timeupdate', setOffsetTop)