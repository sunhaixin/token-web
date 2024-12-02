<template>
  <div class="top">
    <div class="top-trade-line">
      <div
        class="top-trade-type"
        :class="{ active: tradeType === 'buy' }"
        @click="onClickTradeType('buy')"
      >
        买入
      </div>
      <div
        class="top-trade-type"
        :class="{ active: tradeType === 'sell' }"
        @click="onClickTradeType('sell')"
      >
        卖出
      </div>
    </div>
  </div>

  <div class="token-info">
    <div class="token-info-main">
      <div class="token-info-title" v-if="!!tokenInfo.symbol">
        {{ `${tokenInfo.symbol}(${tokenInfo.name})` }}
      </div>
      <div class="token-info-address" :class="!tokenInfo.symbol ? 'title' : ''">
        {{ tokenInfo.address }}
      </div>
      <div class="token-info-tip" v-if="!tokenInfo.address">请粘贴或在下方输入 address</div>
    </div>
    <div class="token-info-paste" @click="pasteAddress">
      <img class="token-info-paste-img" src="@/assets/icon/paste.svg" />粘贴
    </div>
  </div>

  <div class="token-info-address-input">
    <input placeholder="请输入 address" @input="onAddressInputChange" />
  </div>

  <div class="setting">
    <div class="setting-amount">
      <div
        class="setting-amount-item"
        :class="{
          active: index === (tradeType === 'buy' ? activeQuickBuyIndex : activeQuickSellIndex),
        }"
        v-for="(quickTrade, index) in quickTradeSelect"
        :key="quickTrade.value"
        @click="onClickQuickTradeNumber(quickTrade.value, index)"
      >
        <div class="setting-amount-item-skeleton" />
        <div class="setting-amount-item-box">
          {{ quickTrade.label }}
        </div>
      </div>
    </div>

    <div
      class="setting-amount-input"
      v-if="
        tradeType === 'buy'
          ? activeQuickBuyIndex === quickBuyAmounts.length - 1
          : activeQuickSellIndex === quickSellPercents.length - 1
      "
    >
      <input
        type="number"
        inputmode="decimal"
        @input="onAmountInputChange"
        v-model="amountInputValue"
      />
      <div class="setting-amount-input-unit" v-if="tradeType === 'sell'">%</div>
    </div>
  </div>

  <div class="auto-sell">
    <div class="auto-sell-label">{{ `挂单${tradeType === 'buy' ? '买入' : '卖出'}价` }}：</div>
    <div class="auto-sell-input">
      <input ref="autoTradeRef" type="number" inputmode="decimal" @input="onAutoTradeInputChange" />
      <div class="auto-sell-input-unit">$</div>
    </div>
  </div>

  <div class="auto-sell" v-if="tradeType === 'buy'">
    <div class="auto-sell-label">挂单卖出价：</div>
    <div class="auto-sell-input">
      <input ref="autoTradeRef" type="number" inputmode="decimal" @input="onAutoSellInputChange" />
      <div class="auto-sell-input-unit">$</div>
    </div>
  </div>

  <div class="trade-button" :class="{ disabled: tradeButtonDisabled }" @click="onClickTradeButton">
    挂单{{ tradeType === 'buy' ? '买入' : '卖出' }}
  </div>
</template>

<script lang="ts">
const initialSetting = {
  buy: {
    amount: 0.5,
    autoBuyPrice: 0,
    autoSellPrice: 0,
  },
  sell: {
    percent: 1,
    autoSellPrice: 0,
  },
}

export default {
  data() {
    return {
      webApp: null as any,
      tradeType: 'sell',
      tokenInfo: {} as any,
      address: '',
      quickBuyAmounts: [
        { label: '0.25', value: 0.25 },
        { label: '0.5', value: 0.5 },
        { label: '1', value: 1 },
        { label: '自定义', value: 0 },
      ],
      quickSellPercents: [
        { label: '25%', value: 0.25 },
        { label: '50%', value: 0.5 },
        { label: '最大', value: 1 },
        { label: '自定义', value: 0 },
      ],
      activeQuickBuyIndex: 1,
      activeQuickSellIndex: 2,
      quickTradeSelect: [] as any[],
      amountInputValue: '',
      setting: JSON.parse(JSON.stringify(initialSetting)),
    }
  },

  mounted() {
    this.tokenInfo = {
      address: '',
      symbol: '',
      name: '',
    }

    this.quickTradeSelect = this.quickSellPercents
    this.webApp = window.Telegram?.WebApp
  },

  computed: {
    tradeButtonDisabled() {
      const noAmount =
        this.tradeType === 'buy' ? !this.setting.buy.amount : !this.setting.sell.percent
      const noAddress = !this.tokenInfo.address

      const noAutoPrice =
        this.tradeType === 'buy' ? !this.setting.buy.autoBuyPrice : !this.setting.sell.autoSellPrice

      return noAmount || noAddress || noAutoPrice
    },
  },

  watch: {
    tradeType() {
      this.amountInputValue = ''
      ;(this.$refs.autoTradeRef as any).value = ''

      this.setting = JSON.parse(JSON.stringify(initialSetting))
    },
    activeQuickBuyIndex(newValue) {
      if (newValue !== this.quickBuyAmounts.length - 1) {
        this.setting.buy.amount = this.quickBuyAmounts[newValue].value
      }

      this.amountInputValue = ''
    },

    activeQuickSellIndex(newValue) {
      if (newValue !== this.quickSellPercents.length - 1) {
        this.setting.sell.percent = this.quickSellPercents[newValue].value
      }

      this.amountInputValue = ''
    },
  },

  methods: {
    onClickTradeType(type: string) {
      this.tradeType = type

      if (type === 'buy') {
        this.quickTradeSelect = this.quickBuyAmounts
        this.activeQuickBuyIndex = 1
      } else {
        this.quickTradeSelect = this.quickSellPercents
        this.activeQuickSellIndex = 2
      }
    },

    pasteAddress() {
      if (navigator.clipboard?.readText) {
        navigator.clipboard
          .readText()
          .then((data) => {
            if (!data) {
              return
            }

            this.tokenInfo = {
              address: data,
            }
          })
          .catch(function (err) {
            console.error('无法读取粘贴板数据: ', err)
            alert('无法读取粘贴板数据')
          })
      } else if (this.webApp) {
        this.webApp.readTextFromClipboard((data: string) => {
          alert(data)

          this.tokenInfo = {
            address: data,
          }
        })
      } else {
        console.error('浏览器不支持读取粘贴板数据')
        alert('浏览器不支持读取粘贴板数据')
      }
    },

    onClickQuickTradeNumber(value: number, index: number) {
      if (this.tradeType === 'buy') {
        this.setting.buy.amount = +value
        this.activeQuickBuyIndex = index
      } else {
        this.setting.sell.percent = +value
        this.activeQuickSellIndex = index
      }
    },

    onAmountInputChange(e: any) {
      let value = e.target.value

      if (this.tradeType === 'buy') {
        this.setting.buy.amount = +value
      } else {
        if (!!value && +value > 100) {
          this.amountInputValue = '100'
          value = '100'
        }

        this.setting.sell.percent = value / 100
      }
    },

    onAddressInputChange(e: any) {
      const value = e.target.value

      this.tokenInfo = {
        address: value,
      }
    },

    onAutoTradeInputChange(e: any) {
      const value = e.target.value

      if (this.tradeType === 'buy') {
        this.setting.buy.autoBuyPrice = +value
      } else {
        this.setting.sell.autoSellPrice = +value
      }
    },

    onAutoSellInputChange(e: any) {
      const value = e.target.value

      this.setting.buy.autoSellPrice = +value
    },

    onClickTradeButton() {
      if (this.tradeButtonDisabled) {
        return
      }

      let cmd = ''
      let tradeText = ''
      let num = ''

      if (this.tradeType === 'buy') {
        tradeText = '买入'
        num = this.setting.buy.amount + ' SOL'
        cmd = `/auto_buy ${this.tokenInfo.address} ${this.setting.buy.autoBuyPrice} ${this.setting.buy.amount}`

        if (this.setting.buy.autoSellPrice) {
          cmd += ` ${this.setting.buy.autoSellPrice}`
          cmd += ' up'
        }
      } else {
        tradeText = '卖出'

        const percent = this.setting.sell.percent * 100 + '%'
        num = percent
        cmd = `/auto_sell ${this.tokenInfo.address} ${this.setting.sell.autoSellPrice} ${percent}`
      }

      const symbolText = this.tokenInfo.symbol ? ` ${this.tokenInfo.symbol}` : ''
      const autoPrice =
        this.tradeType === 'buy' ? this.setting.buy.autoBuyPrice : this.setting.sell.autoSellPrice

      showConfirmDialog({
        title: `是否挂单${tradeText} ${num}${symbolText}`,
        message: `挂单价：${autoPrice}$\n address：${this.tokenInfo.address}`,
      })
        .then(() => {
          console.log(cmd)

          this.webApp.sendData(cmd)
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="less">
@border-radius-common: 10px;
@trade-type-rader-radius: 20px;
@background-color: #eee;

.top {
  margin-bottom: 16px;

  .top-trade-line {
    display: inline-block;
    border-radius: @trade-type-rader-radius;
    background-color: @background-color;
  }

  .top-trade-type {
    display: inline-block;
    padding: 6px 16px;
    border-radius: @trade-type-rader-radius;
    font-size: 14px;
    cursor: pointer;
    user-select: none;

    &.active {
      background-color: #333;
      color: #fff;
      font-weight: bold;
    }

    &.disabled {
      opacity: 0.2;
    }
  }
}

.token-info {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  min-height: 60px;
  background-color: @background-color;
  border-radius: @border-radius-common;

  &-main {
    flex: 1;
    margin-right: 6px;
  }

  &-title {
    font-size: 15px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &-address {
    font-size: 12px;
    color: #999;
    word-break: break-all;
    &.title {
      color: var(--van-base-font);
    }
  }

  &-tip {
    font-size: 15px;
    color: #ccc;
  }

  &-paste {
    flex: 0 0 auto;
    height: 30px;
    padding: 4px 10px;
    border-radius: 18px;
    font-size: 12px;
    border: 1px solid #ccc;
    cursor: pointer;

    &-img {
      width: 12px;
      vertical-align: middle;
      margin-top: -1px;
      margin-right: 4px;
    }
  }

  &-address-input {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 0 10px;
    background-color: @background-color;
    border-radius: @border-radius-common;
    input {
      flex: 1;
      width: 100%;
      background-color: @background-color;
      border-radius: @border-radius-common;
      font-size: 16px;
      border: none;
      height: 48px;
    }
    input::placeholder {
      color: #ccc;
    }
  }
}

.setting-amount {
  margin: 10px 0;
  display: flex;

  &-item {
    position: relative;
    flex: 1;
    background-color: @background-color;
    border-radius: @border-radius-common;
    border: 1px solid transparent;
    user-select: none;

    &.active {
      border-color: #333;
    }

    &-skeleton {
      width: 100%;
      padding-top: 105%;
    }

    &-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-right: 8px;
    }
  }

  &-input {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background-color: @background-color;
    border-radius: @border-radius-common;
    input {
      flex: 1;
      width: 100%;
      background-color: @background-color;
      border-radius: @border-radius-common;
      font-size: 16px;
      border: none;
      height: 48px;
    }
    &-unit {
      flex: 0 0 auto;
    }
  }
}

.trade-button {
  height: 46px;
  line-height: 46px;
  margin-top: 18px;
  border-radius: 23px;
  background-color: #333;
  color: #fff;
  text-align: center;
  user-select: none;
  cursor: pointer;

  &.disabled {
    background-color: @background-color;
    color: #ccc;
  }
}

.auto-sell {
  display: flex;
  align-items: center;
  margin: 18px 0;

  &-label {
    flex: 0 0 auto;
    font-weight: bold;
  }
  &-input {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background-color: @background-color;
    border-radius: @border-radius-common;
    input {
      flex: 1;
      width: 100%;
      background-color: @background-color;
      border-radius: @border-radius-common;
      font-size: 16px;
      border: none;
      height: 48px;
    }
  }
  &-unit {
    display: 0 0 auto;
  }
}
</style>
