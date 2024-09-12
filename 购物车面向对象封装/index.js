// 单件商品的数据
class UIGoods {
    constructor(g) {
        this.data = g
        this.choose = 0
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
        deliveryThreshold = 30,
        deliveryPrice = 5
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
        }
        this._createHTML()
        this._footerRender()
    }

    // 根据商品列表创建商品元素
    _createHTML () {
        let html = ''
        for (let g of this.uiData.uiGoods) {
            html += this.goodsTemplate(g)
        }
        this.doms.goodsContainer.innerHTML = html
    }

    _footerRender() {
        this.doms.distribution.textContent = this.uiData.deliveryThreshold
        this.doms.minimum.textContent = this.uiData.deliveryPrice
    }

    // 增加
    increase (index) {
        this.uiData.increase(index)
        this.updateGoodsItem(index)
        this.updateFooter(index)
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
        
    }
}