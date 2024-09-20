// 单件商品的数据
class UIGoods {
    constructor(g) {
        this.data = g
        this.choose = 0 // 商品选择数量
    }

    // 获取总价
    getTotalPrice() {
        return this.data.price * this.choose
    }

    // 是否选中此商品
    isChoose() {
        return this.choose > 0
    }

    // 增加
    increase () {
        this.choose++
    }

    // 减少
    decrease () {
        if (this.choose === 0) {
            return
        }
        this.choose--
    }
}

// 整个界面的数据
class UIData {
    constructor({
        data = [],
        deliveryThreshold = 30, // 起送费
        deliveryPrice = 5 // 配送费
    } = {}) {
        this.uiGoods = data.map(g => new UIGoods(g))
        this.deliveryThreshold = deliveryThreshold // 起送费
        this.deliveryPrice = deliveryPrice // 配送费
    }

    // 获取总价
    getTotalPrice() {
        return this.uiGoods.reduce((total, uiGoods) => total + uiGoods.getTotalPrice(), 0)
    }

    // 通过下标 增加
    increase(index) {
        this.uiGoods[index].increase()
    }

    // 通过下标 减少
    decrease(index) {
        this.uiGoods[index].decrease()
    }

    isChoose(index) {
        return this.uiGoods[index].isChoose()
    }

    // 获取全部的选中数量
    getAllChooseCount() {
        return this.uiGoods.reduce((total, uiGoods) => total + uiGoods.choose, 0)
    }

    // 购物车是否不为空
    isCarNotEmpty() {
        return this.getAllChooseCount() > 0
    }

    // 是否满足起送条件
    isDelivery() {
        return this.getTotalPrice() >= this.deliveryThreshold
    }
}

// UI界面
class UI {
    constructor (options = {}) {
        const {
            goodsTemplate,
            el = {},
            ...other
        } = options
        this.el = el
        this.goodsTemplate = goodsTemplate
        this.uiData = new UIData(other)
        this.doms = {
            goodsContainer: document.querySelector(el.container),
            distribution: document.querySelector(el.distribution), // 配送费容器
            minimum: document.querySelector(el.minimum), // 起送费容器
            totalPrice: document.querySelector(el.totalPrice), // 总价容器
            deliveryBtn: document.querySelector(el.deliveryBtn), // 结算按钮
            leftPrice: document.querySelector(el.leftPrice), // 购物车容器
            carCount: document.querySelector(el.carCount), // 购物车数量容器
            car: document.querySelector(el.car), // 购物车

        }
        const carRect = this.doms.car.getBoundingClientRect()
        this.jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5
        }
        this._createHTML()
        this._footerRender()
        this._listenEvents()
    }

    // 根据商品列表创建商品元素
    _createHTML () {
        let html = ''
        for (let i = 0; i < this.uiData.uiGoods.length; i++) {
            const g = this.uiData.uiGoods[i]
            html += this.goodsTemplate(g, i)
        }
        this.doms.goodsContainer.innerHTML = html
    }

    _footerRender() {
        this.doms.distribution.textContent = this.uiData.deliveryPrice
        this.doms.minimum.textContent = this.uiData.deliveryThreshold
    }

    _listenEvents () {
        this.doms.car.addEventListener('animationend', function () {
            this.classList.remove('car-animate')
        })
    }

    // 增加
    increase (index) {
        this.uiData.increase(index)
        this.updateGoodsItem(index)
        this.updateFooter(index)
        this.jump(index)
    }

    // 减少
    decrease (index) {
        this.uiData.decrease(index)
        this.updateGoodsItem(index)
        this.updateFooter(index)
    }

    // 更新某个商品元素的显示状态
    updateGoodsItem (index) {
        const goodsItemDom = this.doms.goodsContainer.children[index]
        if (this.uiData.isChoose(index)) {
            goodsItemDom.classList.add('active')
        } else {
            goodsItemDom.classList.remove('active')
        }
        goodsItemDom.querySelector(this.el.goodsCount).textContent = this.uiData.uiGoods[index].choose
    }

    // 更新页脚
    updateFooter (index) {
         // 总价
        const total = this.uiData.getTotalPrice()
         // 设置总价
        this.doms.totalPrice.textContent = total.toFixed(2)
        // 设置起送状态&还差多少起送
        if (this.uiData.isDelivery()) {
            this.doms.deliveryBtn.classList.add('active')
        } else {
            this.doms.deliveryBtn.classList.remove('active')
            // 还差多少
            this.doms.minimum.textContent = Math.round(this.uiData.deliveryThreshold - total)
        }
        // 设置购物车数量
        if (this.uiData.isCarNotEmpty()) {
            this.doms.leftPrice.classList.add('active')
            this.doms.carCount.textContent = this.uiData.getAllChooseCount()
        } else {
            this.doms.leftPrice.classList.remove('active')
        }
    }

    // 购物车动画
    carAnimation () {
        this.doms.car.classList.add('car-animate')
    }

    // 抛物线跳跃
    jump (index) {
        // 商品加好
        const addBtn = this.doms.goodsContainer.children[index].querySelector(this.el.addBtn)
        const rect = addBtn.getBoundingClientRect()
        const start = {
            x: rect.left,
            y: rect.top
        }
        // 创建抛物线跳跃元素
        const div = document.createElement('div')
        div.className = 'add-to-car'
        const span = document.createElement('span')
        span.textContent = '+'
        span.className = 'circle add'
        // 设置初始化位置
        div.style.transform = `translateX(${start.x}px)`
        span.style.transform = `translateY(${start.y}px)`
        div.appendChild(span)
        document.body.appendChild(div)
        // 强制渲染
        div.clientWidth

        // 设置结束位置
        div.style.transform = `translateX(${this.jumpTarget.x}px)`
        span.style.transform = `translateY(${this.jumpTarget.y}px)`

        // 动画介绍
        div.addEventListener('transitionend', () => {
            div.remove()
            this.carAnimation()
        }, { 
            once: true
        })
    }
}