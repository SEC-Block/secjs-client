<template>
  <main class="wallet-container" @click="closeMenuList">
    <!-- 钱包列表 -->
    <section class="wallet-list">
      <left-nav
        :wallets="wallets"
        :selectedPrivateKey="selectedPrivateKey"
        createdId="walletIndex"
        @walletSelectionChanged="onSelectWalletChanged"
      />
    </section>

    <!-- 钱包相关信息 -->
    <section class="wallet-content">
      <section class="wallet-content-header">
        <section class="wallet-content-header-left">
          <!-- 头部删除 修改名字 -->
          <section class="flex-between">
            <section class="header-left">
              <img
                src="../../assets/images/menu.png"
                alt=""
                @click="tabMenuList"
                id="menuListImg"
              />
              <section
                class="wallet-content-header-left-update"
                :class="[
                  inputActive ? 'input-active' : '',
                  changeActive ? 'load' : ''
                ]"
                @click="updateName"
              >
                <span v-show="inputReadonly">{{ walletName }}</span>
                <input
                  type="text"
                  maxlength="14"
                  ref="contentInput"
                  v-model="newWalletName"
                  v-show="!inputReadonly"
                  :readonly="inputReadonly"
                  onkeyup="this.value=this.value.replace(/(^\s*)/g, '')"
                  @input="inputUpdateName"
                  @blur="saveName"
                />
                <!-- <img src="../../assets/images/updateName.png" v-show="inputActive" alt="" @click="clearInput"> -->
              </section>

              <ul v-show="menuShow">
                <li
                  v-for="(item, index) in menuList"
                  :key="index"
                  @click="lookMask(index)"
                >
                  {{ $t(item.text) }}
                </li>
              </ul>
            </section>

            <section class="invitation-list">
              <figure class="flex">
                <figcaption>
                  {{ $t("homeWallet.hwCode") }}：
                  <span id="invitation" v-show="!mortgageShow">
                    {{ selectedWallet.ownInvitationCode }}
                  </span>
                  <span v-show="mortgageShow">
                    --
                  </span>
                </figcaption>
                <img
                  src="../../assets/images/copy.png"
                  alt=""
                  v-show="!mortgageShow"
                  @click="copyCode"
                  data-clipboard-target="#invitation"
                  class="copyCodeButton"
                />

                <img
                  src="../../assets/images/exclamationImg.png"
                  alt=""
                  v-show="mortgageShow"
                  @mouseover="showInvitation1(item)"
                  @mouseout="showInvitation2(item)"
                />
              </figure>

              <transition name="fade">
                <section class="invitation-tips" v-show="showInvitation">
                  {{ $t("homeWallet.hwInvitationTips") }}
                </section>
              </transition>
            </section>
          </section>

          <!-- 私钥 转账 --->
          <!-- <h2>{{walletBalance}} <span>BIUT Token</span></h2> -->
          <section class="wallet-header-list">
            <section class="wallet-header-copy-list">
              <span id="address">0x{{ selectedWallet.walletAddress }}</span>
              <img
                src="../../assets/images/copy.png"
                alt=""
                @click="copyCnt"
                data-clipboard-target="#address"
                class="copyButton"
              />
            </section>
            <section class="wallet-button-list">
              <wallet-button
                :text="receiptButton"
                :imgUrl="receiptImg"
                @click.native="lookMask(5)"
              />
              <wallet-button
                :text="transferButon"
                :imgUrl="transferImg"
                @click.native="lookMask(4)"
              />
            </section>
          </section>
        </section>
        <!-- left结束 -->

        <!-- 金额展示 -->
        <section class="wallet-header-money-list">
          <section class="money-content">
            <span>{{ $t("homeWallet.hwBiut") }}</span>
            <p :class="[moneyLengthBIUT ? 'moneyLength': '',moneyLengthBIUTs ? 'moneyLengths' : '']">{{ getPointNum(walletBalance) }} BIUT</p>
            <section class="money-text-list">
              <section class="money-text">
                <span>{{ $t("homeWallet.hwBiutTxt1") }}</span>
                <span>{{ getPointNum(availibleMoney) }}</span>
              </section>
              <section class="money-text">
                <span>{{ $t("homeWallet.hwBiutTxt2") }}</span>
                <span>{{ getPointNum(freezeMoney) }}</span>
              </section>
            </section>
            <!-- <img src="../../assets/images/indexAmountBg.png" alt=""/> -->
          </section>
          <section class="money-content">
            <span>{{ $t("homeWallet.hwBiu") }}</span>
            <p :class="[moneyLengthBIU ? 'moneyLength': '',moneyLengthBIUs ? 'moneyLengths': '']">{{ getPointNum(walletBalanceSEN) }} BIU</p>
            <!-- <img src="../../assets/images/indexAmountBg.png" alt=""/> -->
          </section>
        </section>
      </section>

      <section
        class="wallet-content-body"
        :class="moreShow ? '' : 'wallet-padidng-bottom'"
      >
        <p class="wallet-content-body-title">
          {{ $t("homeWallet.hwListTit") }}
        </p>

        <section class="wallet-container-list">
          <!-- 没有数据列表 walletContent == 1  -->
          <section class="wallet-content-body-mull" :style="noTradingStyle">
            <img src="../../assets/images/wallet-null.png" alt="" />
            <p>{{ $t("homeWallet.hwListNull") }}</p>
          </section>
          <!-- 有数据列表 walletContent == 1 -->
          <section class="wallet-content-body-list" :style="noTradingStyles">
            <trading-list
              :tradingList="tradingList"
              :wallets="wallets"
              :selectedPrivateKey="selectedPrivateKey"
            />
          </section>
        </section>

        <!-- 暂无更多数据 -->
        <!-- <p class="noMore" v-show="noMoreData">No further data available ^_^</p> -->
        <section class="moreList" v-show="moreShow" @click="onClickLoadMore">
          <img src="../../assets/images/moreList.png" alt="" />
          <span>{{ $t("page.clickMore") }}</span>
        </section>
      </section>
    </section>

    <!-- 半透明弹窗 -->
    <wallet-translucent :text="translucentText" v-show="translucentShow" />
    <!-- 遮罩层弹窗 -->
    <wallet-mask
      :maskPages="maskPages"
      :maskShow="maskShow"
      @changeClose="closeMask"
      @updateWalletList="onUpdateWalletList"
      @updateWalletBalance="onUpdateWalletBalance"
      @updateWalletBalanceSEN="onUpdateWalletBalanceSEN"
    />
  </main>
</template>

<script>
import leftNav from './components/wallet-left-nav'
import walletMask from './components/wallet-mask'
import tradingList from './components/wallet-trading-list'
import walletTranslucent from '../../components/wallet-translucent'
import walletButtonImg from '../../components/wallet-button-img'
import receiptImg from '../../assets/images/receiptImg.png'
import transferImg from '../../assets/images/transferImg.png'
import Clipboard from 'clipboard'
import WalletsHandler from '../../lib/WalletsHandler'
import { clearInterval, setInterval } from 'timers';
let FileSaver = require('file-saver')
let jobID
export default {
  name: '',
  components: {
    leftNav,
    walletTranslucent,
    walletButton: walletButtonImg,
    walletMask,
    tradingList
  },
  props: {},
  data() {
    return {
      receiptButton: 'homeWallet.hwBtn1',
      receiptImg: receiptImg,
      transferButon: 'homeWallet.hwBtn2',
      wallets: {},
      // selectedWallet: {},
      selectedPrivateKey: '',
      selectedWalletData: {},
      transferImg: transferImg,
      menuShow: false,
      newWalletName: '',
      invitationCode: '',//邀请码
      showInvitation: false,//邀请码提示 是否显示
      walletAddress: '',
      inputReadonly: true,
      inputActive: false,
      noMoreData: false, //暂无更多数据
      isMoreClicked: false,
      menuList: [
        {
          id: '01',
          text: 'homeWallet.hwSet1',
        },
        {
          id: '02',
          text: 'homeWallet.hwSet2',
        },
        {
          id: '03',
          text: 'homeWallet.hwSet3',
        },
        {
          id: '04',
          text: 'homeWallet.hwSet4',
        }
      ],
      translucentText: '',
      translucentShow: false,
      maskPages: 0,
      maskShow: false,
      // tradingList: [],
      tradingListTotalLength: 0,
      tradingListSkip: 4,
      // tradingPgeSize: 2, // rpc 请求交易历史每页显示数量
      tradingPge: 1 // rpc 请求交易历史页数
    }
  },
  computed: {
    selectedWallet () {
      this.selectedPrivateKey = this.$store.getters.selectedWallet.privateKey
      return this.$store.getters.selectedWallet
    },

    walletBalance () {
      return this.$store.getters.walletBalance
    },

    availibleMoney () {
      return this.$store.getters.availibleMoney
    },

    freezeMoney () {
      return this.$store.getters.freezeMoney
    },

    mortgageShow () {
      return !(this.$store.getters.freezeMoney !== "0" &&  this.$store.getters.freezeMoney !== "-")
    },

    walletBalanceSEN () {
      return this.$store.getters.walletBalanceSEN
    },

    walletName () {
      this.newWalletName = this.$store.getters.walletName
      return this.$store.getters.walletName
    },

    transListPage () {
      return this.$store.getters.transactionListPage
    },

    transListPageSize () {
      return this.$store.getters.transactionListPageSize
    },

    tradingList () {
      this.tradingListTotalLength = this.$store.getters.transactionList.length
      return this.$store.getters.transactionList
    },

    noTradingStyle() {
      if (this.tradingListTotalLength > 0) {
        return {
          display: 'none'
        }
      }
    },
    noTradingStyles() {
      if (this.tradingListTotalLength == 0) {
        return {
          display: 'none'
        }
      }
    },
    moreShow() {
      if (this.tradingListTotalLength > 4 && !this.noMoreData) {
        return true
      } else {
        return false
      }
    },

    changeActive() {
      let name = this.walletName
      if (name === "Mining Wallet" || name === "挖矿钱包") {
        return true
      }
    },

    moneyLengthBIUT () {
      return this.$store.getters.walletBalance > 15 ? true : false
    },

    moneyLengthBIUTs () {
      return this.$store.getters.walletBalance.length > 21 ? true : false
    },

    moneyLengthBIU () {
      return this.$store.getters.walletBalanceSEN > 15 ? true : false
    },

    moneyLengthBIUs () {
      return this.$store.getters.walletBalanceSEN > 21 ? true : false
    }
  },
  created() {
    this.wallets = this.$route.query.wallets
    this._getWalletBalance(this.selectedWallet, this.selectedPrivateKey, this.selectedWallet.walletAddress)
    this._getWalletTransactions(this.selectedPrivateKey, this.selectedWallet.walletAddress)
    // this.onSelectWalletChanged(this.selectedWallet)
    // this.selectedPrivateKey = this.$route.query.selectedPrivateKey
  },
  mounted() {

  },
  destroyed() {
    if (jobID) {
      clearInterval(jobID)
    }
  },
  methods: {
    //交易记录方法
    onClickLoadMore() {
      this.isMoreClicked = true
      this.tradingPge = this.tradingPge + 1
      this.tradingListSkip = this.tradingListSkip + 4
      this.$store.commit('updateTransPage', {
        privateKey: this.selectedWallet.privateKey,
        pageSize: this.transListPageSize + 10
      })
      clearInterval(jobID)
      this._getWalletBalance(this.selectedWallet, this.selectedWallet.privateKey, this.selectedWallet.walletAddress)
      this._getWalletTransactions(this.selectedWallet.privateKey, this.selectedWallet.walletAddress, 'click')
      this._startUpateJob()
    },

    //遮罩层相关弹窗
    lookMask(index) {
      // maskPages 0 私钥 1 keystrore 2 助记词 3 删除 4  转账 5 二维码地址
      if (index === 3) {
        let mingingStatus = JSON.parse(window.sessionStorage.getItem('miningStatus'))
        if (mingingStatus && mingingStatus.wallet.privateKey === this.selectedWallet.privateKey && mingingStatus.miningIn) {
          this.maskPages = 6
        } else {
          this.maskPages = index
        }
      } else if (index === 4) {
        /**
         * SEN余额小于 （获取） 转账手续费最小值（0.001）
         * 
         * toast提示语 'SEN isn't enough to sent'
        */
        if (Number(this.walletBalanceSEN) < 0.01) {
          this.translucentShow = true
          this.translucentText = "homeWallet.hwBiuInsufficient"
          setTimeout(() => {
            this.translucentShow = false
          }, 3000)
          return
        } else {
          this.maskPages = 4
        }
      } else {
        this.maskPages = index
      }
      this.maskShow = true
    },

    //复制邀请码
    copyCode() {
      var clipboard = new Clipboard('.copyCodeButton')
      this.translucentShow = true
      clipboard.on('success', e => {
        clipboard.destroy()
        this.translucentText = 'tips.copySuccess'
        setTimeout(() => {
          this.translucentShow = false
        }, 3000)
      })
      clipboard.on('error', e => {
        this.translucentText = 'tips.copyFailure'
        setTimeout(() => {
          this.translucentShow = false
        }, 3000)
        clipboard.destroy()
      })
    },

    //复制地址
    copyCnt() {
      var clipboard = new Clipboard('.copyButton')
      this.translucentShow = true
      clipboard.on('success', e => {
        clipboard.destroy()
        this.translucentText = 'tips.copySuccess'
        setTimeout(() => {
          this.translucentShow = false
        }, 3000)
      })
      clipboard.on('error', e => {
        this.translucentText = 'tips.copyFailure'
        setTimeout(() => {
          this.translucentShow = false
        }, 3000)
        clipboard.destroy()
      })
    },

    //切换操作菜单是否显示
    tabMenuList() {
      this.menuShow = !this.menuShow
    },

    //钱包名称不能输入空格开头
    inputUpdateName() {
      this.$nextTick(() => {
        this.newWalletName = this.newWalletName.replace(/(^\s*)/g, '')
      })
    },

    //修改钱包名称
    updateName() {
      this.inputReadonly = false
      this.inputActive = true
      this.$nextTick(() => {
        this.$refs.contentInput.focus()
      })
    },

    //失去焦点保存名称
    saveName() {
      let newKeyStore = {}
      if (this.newWalletName.trim().length === 0) {
        this.translucentShow = true
        this.translucentText = "homeWallet.hwNameNull"
        setTimeout(() => {
          this.translucentShow = false
        }, 4000)
        return
      } else if (this.newWalletName === this.selectedWallet.name) {
        this.inputReadonly = true
        this.inputActive = false
        return
      }
      let miningWallet = JSON.parse(window.sessionStorage.getItem("miningStatus"))

      if (miningWallet) {
        miningWallet.wallet.walletName = this.newWalletName
        window.sessionStorage.setItem("miningStatus", JSON.stringify(miningWallet))
      }
      this.$store.commit('updateWalletName', {
        privateKey: this.selectedWallet.privateKey,
        newName: this.newWalletName
      })
      this.selectedWallet.name = this.walletName
      this.wallets[this.selectedWallet.privateKey].walletName = this.walletName
      // this.selectedWalletData.walletName = this.walletName
      // newKeyStore[this.selectedWalletData.privateKey] = this.selectedWalletData
      WalletsHandler.updateWalletFile(this.selectedWalletData, () => {
        this.translucentShow = true
        this.translucentText = "homeWallet.hwUpdateNameSuccess"
        this.oldWalletName = this.walletName
      })

      setTimeout(() => {
        this.translucentShow = false
      }, 4000)
      //修改失败
      //  this.translucentShow = true
      //  this.translucentText = "Name option no empty"
      this.inputReadonly = true
      this.inputActive = false
    },

    //清楚输入框
    // clearInput () {
    //   this.walletName = ""
    // },

    //点击其他的地方关闭菜单列表
    closeMenuList(event) {
      let menuList = document.getElementById('menuListImg')
      if (this.menuShow && !menuList.contains(event.target)) {
        this.menuShow = false;
      }
    },

    //关闭遮罩层
    closeMask() {
      this.maskShow = false
    },

    _resetSkipTotal() {
      this.tradingListTotalLength = 0
      this.tradingListSkip = 4
      this.tradingPge = 1
      this.tradingPgeSize = 5
      this.tradingListSkip = 4
     // this.tradingList = []
      this.noMoreData = false
    },

    /** Event Method, triggerd if wallet selection changed*/
    onSelectWalletChanged(selectedWallet) {
      if (jobID) {
        clearInterval(jobID)
      }
      window.sessionStorage.setItem("selectedPrivateKey", selectedWallet.privateKey)
      this._resetSkipTotal()
      this._startUpateJob()
      //return
    },

    _startUpateJob() {
      if (jobID) {
        clearInterval(jobID)
      }
      // this._getWalletBalance(this.selectedWallet.walletAddress)
      // this._getWalletTransactions(this.selectedWallet.walletAddress, this.tradingPge, this.tradingPgeSize)
      jobID = setInterval(() => {
        console.log('Job ID')
        this._getWalletBalance(this.selectedWallet, this.selectedWallet.privateKey, this.selectedWallet.walletAddress)
        this._getWalletTransactions(this.selectedWallet.privateKey, this.selectedWallet.walletAddress)
      }, 30 * 1000)
    },

    _getWalletBalance(wallet, privateKey, walletAddress) {
      let poolAddress = []
      this.$JsonRPCClient.getWalletBalanceOfBothChains(walletAddress, (balanceSEC) => {
        let freezeMoney = 0
        let walletBalance = 0
        let availableMoney = Number(balanceSEC)
        if (this.selectedWallet.mortgagePoolAddress.length > 0) {
          for (let i = 0; i < this.selectedWallet.mortgagePoolAddress.length; i++) {
            let pool = this.selectedWallet.mortgagePoolAddress[i]
            poolAddress.push(this.$JsonRPCClient.getContractInfoSync(pool))
          }
        }
        if (wallet.ownPoolAddress.length > 0) {
          for (let ownpool of this.selectedWallet.ownPoolAddress) {
            poolAddress.push(this.$JsonRPCClient.getContractInfoSync(ownpool))
          }
        }
        poolAddress = Array.from(new Set(poolAddress))
        Promise.all(poolAddress).then((contractInfos) => {
          for (let contract of contractInfos) {
            let timeLock = contract.timeLock || {}
            if (wallet.walletAddress in timeLock && wallet.walletAddress in timeLock[wallet.walletAddress]) {
              let benifitAddress = timeLock[wallet.walletAddress][wallet.walletAddress]
              for (let i = 0; i < benifitAddress.length; i++) {
                freezeMoney = freezeMoney + Number(benifitAddress[i].lockAmount)
              }
            }
          }

          walletBalance = this.cal.accAdd(freezeMoney, availableMoney) //精度问题处理
          this.$store.commit('updateWalletBalanceSEC', {
            privateKey: privateKey,
            walletBalance: walletBalance.toString(),
            availibleMoney: availableMoney.toString(),
            freezeMoney: freezeMoney.toString()
          })
        })
      }, (balanceSEN) => {
        this.$store.commit('updateWalletBalanceSEN', {
          privateKey: privateKey,
          walletBalanceSEN: balanceSEN.toString()
        })
      })
    },

    /** intern methode to handle the value format */
    _checkValueFormat(value) {
      let splitValue = value.split("e-")
      if (splitValue.length > 1) {
        return Number(value).toFixed(Number(splitValue[1])).toString()
      } else {
        return Number(value).toString()
      }
    },

    _getWalletTransactions(privateKey, walletAddress, eventFrom) {
      this.$JsonRPCClient.getWalletTransactionsBothChains(walletAddress, this.transListPage, this.transListPageSize, (transactions) => {
        this.$store.commit('updateTransList', {
          privateKey: privateKey,
          trans: transactions
        })
        
        if (transactions.length <= this.selectedWallet.transactionHistory.length) {
          /**判断是否显示加载更多按钮 */
          if (this.isMoreClicked && eventFrom === 'click') {
            this.noMoreData = true
          } else if (!this.isMoreClicked && eventFrom === 'click') {
            this.noMoreData = false
          }
        }
      })
    },

    /** Event Method, triggered if wallet removed, update the wallet list */
    onUpdateWalletList(wallets) {
      // Delete wallet successfully 删除成功 Delete wallet failure 删除失败
      this.translucentShow = true
      this.translucentText = "homeWallet.hwDeleteSuccess"
      setTimeout(() => {
        this.translucentShow = false
        this.translucentText = ""
      }, 3000)
      if (JSON.stringify(wallets) === '{}') {
        this.$router.push({ name: 'walletCreate' })
      } else {
        this.wallets = wallets
        //this.$route.query.wallets = this.wallets
      }
    },

    /** Event Method, triggered if wallet balance updated */
    onUpdateWalletBalance(balance, privateKey, walletAddress) {
        this._getWalletBalance(this.selectedWallet, privateKey, walletAddress)
        this._getWalletTransactions(privateKey, walletAddress)
    },

    onUpdateWalletBalanceSEN(balance, privateKey, walletAddress) {
      this.$store.commit('updateWalletBalanceSEN', {
        privateKey: privateKey,
        walletBalanceSEN: balance.toString()
      })
    },

    showInvitation1() {
      this.showInvitation = true
    },

    showInvitation2() {
      this.showInvitation = false
    }
  },
  watch: {
    walletName(newVal, oldVal) {
      let xReg = /[^\x00-\xff]/g
      if (this.getBLen(newVal) > 14 && xReg.test(newVal)) {
        this.$nextTick(() => {
          this.walletName = newVal.slice(0, 7)
        })
      }
    },
  }

}
</script>

<style scoped>
.wallet-content {
  padding: 36px 32px 0;
}
.wallet-content-header {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.wallet-content-header-left .header-left {
  display: flex;
  align-items: center;
  color: #576066;
  justify-content: space-between;
}
.wallet-content-header-left .header-left img {
  width: 16px;
  height: 12px;
  margin-right: 12px;
}
.wallet-content-header-left .header-left {
  position: relative;
}
.wallet-content-header-left .header-left ul {
  width: 146px;
  background: rgba(66, 83, 91, 1);
  box-shadow: 0px 10px 10px rgba(66, 83, 91, 0.2);
  position: absolute;
  top: 24px;
  left: -7px;
  z-index: 9;
  border-radius: 4px;
  color: #afc3cc;
  font-size: 14px;
}
.wallet-content-header-left .header-left ul li {
  height: 37px;
  line-height: 37px;
  padding-left: 12px;
  border-bottom: 1px solid #536973;
}
.wallet-content-header-left .header-left ul li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  position: relative;
}
.wallet-content-header-left .header-left ul li:last-child {
  border: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.wallet-content-header-left .header-left ul li:hover {
  cursor: pointer;
  background: #536973;
}

.invitation-list img {
  margin-left: 12px;
}
.invitation-list figure {
  margin: 0;
}
.invitation-list figure figcaption {
  font-size: 14px;
  color: #99a1a6;
}
.invitation-list figure figcaption span {
  font-family: Lato-Bold;
  color: #252f33;
}
.invitation-list {
  position: relative;
}
.invitation-tips {
  position: absolute;
  right: 0;
  color: #c9d1d4;
  width: 220px;
  font-size: 12px;
  height: 58px;
  top: 30px;
  background: #42535b;
  box-shadow: 0 10px 10px rgba(66, 83, 91, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 12px 0 14px;
}
.invitation-tips::after {
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #42535b;
  content: "";
  position: absolute;
  width: 0;
  top: -6px;
  right: 2px;
}
.en .invitation-tips {
  font-size: 14px;
  width: 174px;
}

/* 修改名称 */
.wallet-content-header-left-update {
  display: flex;
  align-items: center;
  height: 24px;
  border: 1px solid #fff;
  width: 124px;
  border-radius: 4px;
}
.wallet-content-header-left-update input {
  border: 0;
  height: 20px;
  color: #576066;
  width: 106px;
}
.wallet-content-header-left-update img {
  width: 10px !important;
  height: 10px !important;
  margin-right: 8px !important;
}
.input-active {
  border-color: rgba(229, 229, 229, 1);
}
.wallet-content-header-left-update span {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  font-family: Montserrat-SemiBold;
  font-size: 16px;
}
.en .wallet-content-header-left-update span {
  font-family: Source-Medium;
  color: #42535b;
}
.wallet-content-header-left-update span:hover {
  background: #f2f2f2;
  cursor: pointer;
}

/* 按钮列表 */
.wallet-header-list {
  display: flex;
  justify-content: space-between;
  padding: 8px 0 24px;
  align-items: center;
}
.wallet-header-list .wallet-header-copy-list {
  display: flex;
  align-items: center;
  font-family: Lato-Regular;
  font-size: 14px;
}
.wallet-header-list .wallet-header-copy-list img {
  width: 14px;
  height: 14px;
  margin-left: 12px;
}
.wallet-button-list {
  display: flex;
}
.wallet-button-list section {
  width: 96px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  border: 1px solid rgba(229, 229, 229, 1);
  font-size: 14px;
}
.wallet-button-list section:hover {
  cursor: pointer;
}
.wallet-button-list section >>> p {
  color: #252f33 !important;
}
.wallet-button-list section:last-child {
  margin-left: 6px;
}

/* 金额列表 */
.wallet-header-money-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.wallet-header-money-list .money-content {
  height: 112px;
  flex: 1;
  border-radius: 4px;
  color: #fff;
  position: relative;
  background: linear-gradient(
    90deg,
    rgba(41, 216, 147, 1) 0%,
    rgba(12, 197, 183, 1) 100%
  );
  padding-left: 16px;
  box-shadow: 0px 3px 6px rgba(37, 47, 51, 0.16);
}
.wallet-header-money-list .money-content:last-child {
  margin-left: 10px;
  background: linear-gradient(
    90deg,
    rgba(66, 145, 255, 1) 0%,
    rgba(11, 127, 230, 1) 100%
  );
  box-shadow: 0px 3px 6px rgba(37, 47, 51, 0.16);
}
.wallet-header-money-list .money-content span {
  display: block;
  padding: 12px 0 8px;
}
.wallet-header-money-list .money-content p {
  font-size: 24px;
  font-weight: normal;
  font-family: Lato-Regular;
}
.wallet-header-money-list .money-content .moneyLength {
  font-size: 20px;
}
.wallet-header-money-list .money-content .moneyLengths {
  font-size: 18px;
}
.wallet-header-money-list .money-content img {
  width: 128px;
  height: 112px;
  position: absolute;
  right: 0;
  top: 0;
}

.money-text-list {
  display: flex;
  padding-top: 16px;
}
.wallet-header-money-list .money-content .money-text-list .money-text {
  display: flex;
  flex-direction: column;
  width: 50%;
  font-size: 12px;
}
.wallet-header-money-list .money-content .money-text-list .money-text span {
  padding: 3px 0 0 0;
}
.wallet-header-money-list
  .money-content
  .money-text-list
  .money-text
  span:last-child {
  font-family: Lato-Regular;
}
.wallet-header-money-list
  .money-content
  .money-text-list
  .money-text
  span:first-child {
  padding: 0;
}

.wallet-content-body {
  box-shadow: 0px 0px 6px rgba(37, 47, 51, 0.16);
  margin-top: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.wallet-container-list {
  overflow: auto;
  box-sizing: border-box;
  height: 248px;
}

.wallet-content-body-list {
  width: 100%;
}
.wallet-container-list::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
.wallet-container-list::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 1px #00d6b2;
  background: #00d6b2;
  border-radius: 1px;
}
.wallet-container-list::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 1px #edf5f4;
  border-radius: 0;
  background: #edf5f4;
}

.wallet-content-body .wallet-content-body-title {
  padding: 18px 0 12px;
  color: #839299;
  background: #fff;
  font-size: 13px;
  font-family: Montserrat-Regular;
  margin: 0 32px;
}
.en .wallet-content-body .wallet-content-body-title {
  color: #99a1a6;
  font-size: 14px;
}

.wallet-content-body .wallet-content-body-mull {
  text-align: center;
  width: 100%;
  margin-top: 97px;
}
.wallet-content-body .wallet-content-body-mull img {
  width: 71px;
  height: 71px;
}
.wallet-content-body .wallet-content-body-mull p {
  color: #999999;
  font-family: Lato-Bold;
  margin-top: 14px;
}

.en .wallet-content-body .wallet-content-body-title,
.en .wallet-content-body .wallet-content-body-mull p {
  font-family: Source-Regular;
}

.moreList {
  background: #fff;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #576066;
  z-index: 9;
}
.moreList img {
  width: 11px;
  height: 7px;
  margin-right: 5px;
}

.wallet-padidng-bottom {
  padding-bottom: 16px;
}
.noMore {
  text-align: center;
  color: #576066;
  padding: 15px 0;
}

.load {
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>