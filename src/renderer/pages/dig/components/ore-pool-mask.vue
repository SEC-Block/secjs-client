<template>
  <section class="mask">
    <section class="mask-container pool-mask">
      <header class="record-head">
        <h2>{{ $t('homeDigMask.hdMaskPoolTit') }}</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </header>

      <section>
        <p class="pool-txt1">{{ $t('homeDigMask.hdMaskPoolTxt1') }}</p>
        <section class="flexBetween">
          <p class="pool-txt2">{{ $t('homeDigMask.hdMaskPoolTxt2') }}<span class="color-red">*</span></p>
          <p class="color-red" v-show="nameError">{{ $t('homeDigMask.hdMaskPoolTxt3') }}</p>
        </section>
        
        <section class="ipt-list flexBetween" :class="nameError ? 'border-red' : ''">
          <input
            type="text"
            :placeholder="$t('homeDigMask.hdMaskPoolNameIpt')" 
            v-model="poolName"
            maxlength="15"
            @input="poolNameIpt" />
          <img src="../../../assets/images/clearAddress.png" v-show="clearImg" alt="" @click="clearIpt"/>
        </section>
      </section>

      <button 
        type="button"
        :class="updateIpt ? 'passCorrect' : ''"
        :disabled="!updateIpt"
        @click="submitFrom">
        {{ $t('homeDigMask.hdMaskPoolTxt4') }}
      </button>
    </section>
  </section>
</template>

<script>
import WalletHandler from '../../../lib/WalletsHandler';
const dataCenterHandler = require('../../../lib/DataCenterHandler')
export default {
  name: '',
  props: {},
  data() {
    return {
      poolName: '',
      clearImg: false,
      nameError: false
    }
  },
  computed: {
    walletAddress () {
      return this.$store.getters.miningWallet.walletAddress
    },
    privateKey () {
      return this.$store.getters.miningWallet.privateKey
    },
    contractAddress () {
      return this.$store.getters.miningWallet.ownPoolAddress[0]
    },
    updateIpt () {
      let name = this.poolName.trim()
      if (name.length >= 6 && this.poolNameIpt()) {
        return true
      }
    }
  },
  methods: {
    clearIpt () {
      this.poolName = ''
      this.clearImg = false
      this.nameError = false
    },

    cloasMask () {
      this.$emit('close')
      this.clearIpt()
      this.nameError = false
    },

    submitFrom() {
      let poolName = this.poolName
      let transferTimeLock = {
        timestamp: new Date().getTime(),
        walletAddress: this.walletAddress,
        sendToAddress: this.contractAddress,
        amount: '500000',
        gasLimit: '0',
        gasPrice: '0',
        txFee: '0',
        chainName: 'SEC'
      }
      this.$JsonRPCClient.sendContractTransaction(this.walletAddress, this.privateKey, new Date().getTime() + 365* 24 * 3600 * 1000, transferTimeLock, (response) => {
        if (response.result) {
          this.$emit('appendContract', this.privateKey, poolName)
        } 
      })
      //alert("点击了提交按钮")
      this.cloasMask()
    },

    //input开始不能输入空格、检测名称是否相同
    poolNameIpt () {
      this.$nextTick(()=> {
        this.poolName = this.inputNull(this.poolName)
      })

      let name = this.poolName.trim()
      /**
       * 判断名称重复 
       * this.nameError = true
       * 
       * 否则按钮可以点击状态
       */
      if (name === "1") {
        this.nameError = true
        return false
      } else {
        this.nameError = false
        return true
      }
    }
  },
  watch: {
    poolName(newVal, oldVal) {
      let xReg = /[^\x00-\xff]/g
      if (newVal.length > 0) {
        this.clearImg = true
      } else {
        this.clearImg = false
      }

      if (this.getBLen(newVal) > 15 && xReg.test(newVal)) {
        this.$nextTick(()=> {
          this.poolName = newVal.slice(0, 7)
        })
      }
    }
  },
}
</script>

<style scoped>
  .pool-mask {width: 372px;padding: 30px 32px 28px;}
  .record-head {position: relative;}
  .record-head h2 {margin: 0;font-size: 24px;font-family: Montserrat-SemiBold;}
  .en .record-head h2 {font-size: 20px;font-family: Source-Medium;font-weight: 500;}
  .record-head img {position: absolute;top: -10px;right: -12px;cursor: pointer;}

  .flexBetween {display: flex;align-items: center;justify-content: space-between;}

  .ipt-list {height: 40px;border-bottom: 1px solid #E6E6E6;box-sizing: border-box;}
  .ipt-list input {flex: 1;border: 0;}
  .ipt-list section {display: flex;align-items: center;}
  .ipt-list img,.ipt-list section span {margin-left: 8px;cursor: pointer;}

  .pool-txt1 {color: #99A1A6;line-height: 1.2;padding: 32px 0 16px;font-family: Lato-Regular;}
  .en .pool-txt1 {font-family: Source-Regular;}
  .pool-txt2 {color: #99A1A6;font-size: 16px;font-family: Lato-Bold;}
  .en .pool-txt2 {font-family: Source-Medium;}

  input,button {font-family: Lato-Regular;}
  
  button {width:372px;height:48px;background:#d8d8d8;border-radius:4px;border: 0;color: #F7FBFA;font-size: 14px;
    margin-top: 32px;}

  .color-red {color: #EE1C39;}
</style>