<template>
  <main>
    <aside>
      <img src="../../assets/images/loginLogo.png" alt="" title="BIUT"/>
      <h2 class="titleTop">{{ $t(createTitle1) }}</h2>
      <h2>{{ $t(createTitle2) }}</h2>
      <span></span>
    </aside>
    <!-- <section class="wallet-nav">
      <wallet-nav/>
    </section> -->
    <img src="../../assets/images/closeImg.png" v-show="createClose" title="close" class="closeImg" @click="closeCreate"/>
    <!-- 创建钱包 createPages == 1 -->
    <section class="wallet-create" v-if="createPages == 1">
      <span class="wallet-button-important" @click="importCreate">{{ $t("login.loginImportBtn") }}</span>
      
      <wallet-title :title="walletNameText" :choose="true"  v-show="!walletNameDisable"/>
      <wallet-input 
        type="text" 
        :placeholder="$t('input.walletNameIpt')" 
        maxlength="14"
        v-model="walletName"
        @input="inputName" v-show="!walletNameDisable"></wallet-input>
      
      <h4 v-show="walletNameDisable">{{ walletName }}</h4>

      
      <wallet-title :title="walletPassText1" :choose="true"/>
      <wallet-input-pass :placeholder="$t('input.walletPass1Ipt')" maxlength="30" 
          v-model="walletPass1"
          :class="passFormatShow ? 'border-red' : ''"
          @loseFocus="loseFocus"
          @getFocus="getFocus"
          @input="inputContent1"></wallet-input-pass>
      <wallet-tips :tips="passFormat"  v-show="passFormatShow"/>
      
      <wallet-title :title="walletPassText2" :choose="true"/>
      <wallet-input-pass 
          :placeholder="$t('input.walletPass2Ipt')" 
          maxlength="30"
          :class="passFormat2Show ? 'border-red' : ''"
          v-model="walletPass2"
          @input="inputContent2"></wallet-input-pass>
      <wallet-tips :tips="passFormat2"  v-show="passFormat2Show"/>

      <wallet-title :title="walletCodeText" :choose="true"/>
      <wallet-input 
        type="text" 
        :placeholder="$t('input.walletCodeIpt')" 
        :class="walletCodeError ? 'border-red' : ''"
        maxlength="8"
        v-model="walletCode"
        @input="inputCode"></wallet-input>
      <wallet-tips :tips="walletCodeErrorText"  v-show="walletCodeError"/>

      <wallet-button  type="button" 
                      class="wallet-button-create" 
                      :text="walletButtonText"
                      :disabled="!createActive"
                      :readonly="createReadonly"
                      :class="[createActive?'passCorrect':'',createReadonly?'cantClick':'']"
                      @click.native="createWallet"/>
    </section>

    <!-- 创建钱包 -- 备份助记词 createPages == 2 -->
    <section class="wallet-backup"  v-if="createPages == 2">
      <section class="backup-title">
        <label>{{ $t('login.createdTips1') }}</label> 
        {{ $t('login.createdTips2') }}
      </section>
      <wallet-title :title="backupText1" :choose="false"/>
      <phrase-list :itemList="itemList"/>
      <wallet-title :title="backupText2" :choose="false" class="private-key-title"/>
      <section class="private-key-contant">
        <span id="privateKeyText">{{ privateKey }}</span>
        <img src="../../assets/images/copy.png" alt="" 
              @click="copyPrivateKey" 
              data-clipboard-target="#privateKeyText" 
              class="copyButton"/>
      </section>
      <wallet-translucent :text="copyText" v-show="copyShow"/>
      <section class="radio-content">
        <img :src="radioImg" alt="" @click="checkRadio">
        <span>{{ $t('login.createdAgreement') }}</span>
      </section>
      <wallet-button  class="wallet-button-backup" 
                      :text="walletBackupButton"
                      :disabled="!backupActive"
                      :class="backupActive?'passCorrect':''"
                      @click.native="backupWallet"/>
    </section>

    <!-- 创建钱包 -- 导入钱包 createPages == 3 -->
    <section class="wallet-import" v-if="createPages == 3">
      <ul>
        <li v-for="(item, index) in tabList" 
            :class="tabIndex == index?'check-li':''"
            @click="isTab(index)">{{ $t(item.cnt) }}</li>
      </ul>

      <!-- 私钥导入 -->
      <section class="wallet-import-private-key" v-show="tabIndex == 0">
        <wallet-input 
          :placeholder="$t('input.walletNameIpt')" 
          maxlength="14" 
          v-model="walletNameImport1"
          :readonly="walletNameDisable"
          @input="inputName1"></wallet-input>
        <textarea
            :placeholder="$t('input.walletPrivateKey')" 
            maxlength="64" 
            :class="privateKeyError ? 'border-red1' : ''"
            v-model="walletPrivateKey"
            @input="inputPrivateKey">
        </textarea>
        <wallet-tips :tips="privateKeyErrorText" v-show="privateKeyError"/>
        <wallet-button class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!privateActive"
                      :class="privateActive?'passCorrect':''"/>
      </section>

      <!-- keystore导入 -->
      <section class="wallet-import-keystore" v-show="tabIndex == 1">
         <p class="wallet-import-keystore-title">{{ $t('login.importSelectTit') }}</p>
         <div>
           <span :class="KeyStoreColor?'KeyStoreColor':''">{{ $t(KeyStoreVal) }}</span>
           <input type="file" @change="tirggerFile($event)"/>
         </div>
         
         <section v-show="showPass">
            <wallet-title :title="walletnNewPassText" :choose="false"/>
            <wallet-input-pass
              :placeholder="$t('input.walletPass1Ipt')" 
              maxlength="30" 
              v-model="walletNewPass"
              :class="walletnNewPassError ? 'border-red' : ''"
              @input="inputContent3"></wallet-input-pass>
            <wallet-tips :tips="walletnNewPassErrorText" v-show="walletnNewPassError"/>
         </section>
         <wallet-button  class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!keystoreActive"
                      :class="keystoreActive?'passCorrect':''"/>
      </section>

      <!-- 助记词导入 -->
      <section  class="wallet-import-phrase" v-show="tabIndex == 2">
        <wallet-input 
          :placeholder="$t('input.walletNameIpt')" 
          maxlength="14" 
          v-model="walletNameImport2"
          :readonly="walletNameDisable"
          @input="inputName2"></wallet-input>
        <textarea
          :placeholder="$t('input.walletPhrase')"
          :class="phraseError ? 'border-red1' : ''"
          v-model.trim="walletPhrase"></textarea>
        <wallet-tips :tips="phraseErrorText" v-show="phraseError"/>
        <wallet-button class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!phraseActive"
                      :class="phraseActive?'passCorrect':''"/>
      </section>

     <p class="go-create">{{ $t('login.loginFooter1') }}   <span @click="closeCreate">{{ $t('login.loginFooter2') }}</span></p> 
    </section>
    <!-- 钱包版本号 -->
    <span class="wallet-version"> V {{ versionNumber }}</span>

    <!-- 钱包已存在弹窗 -->
    <login-mask 
      v-show="loginMaskShow"
      @close="closeMask"/>
  </main>
</template>

<script>
import walletTitle from '../../components/wallet-title'
import walletButton from '../../components/wallet-button'
import walletInput from '../../components/wallet-input'
import walletInputPass from '../../components/wallet-input-pass'
import walletTips from '../../components/wallet-tips'
import phraseList from './components/phrase-list'
import loginMask from './components/login-mask'
import walletNav from '../../components/wallet-nav'
import agreement from '../../assets/images/agreement.png'
import agreements from '../../assets/images/agreements.png'
import walletTranslucent from '../../components/wallet-translucent'
import Clipboard from 'clipboard'
import walletsHandler from '../../lib/WalletsHandler'

const fs = require('fs')
const random = require('string-random')
const pkg = require('../../../../package.json')
const dataCenterHandler = require('../../lib/DataCenterHandler')

export default {
  name: 'walletCreate',
  components: {
    walletTitle,
    walletButton,
    walletInput,
    walletInputPass,
    walletTips,
    phraseList,
    walletNav,
    walletTranslucent,
    loginMask // 钱包已存在弹窗
  },
  props: {},
  data () {
    return {
      createTitle1: 'login.loginCreate1',
      createTitle2: 'login.loginCreate2',
      createPages: 1, // 1 创建钱包 2 备份助记词 3 导入钱包
      createClose: false, //创建钱包页面关闭按钮是否显示
      walletNameText: 'input.walletName',
      walletPassText1: 'input.walletPass1',
      walletPassText2: 'input.walletPass2',
      walletName: '', //创建钱包名称
      walletNameDisable: false,
      walletPass1: '',//密码
      walletPass2: '',//确认密码
      walletCodeText: 'input.walletCode', //邀请码标题
      walletCode: '',//邀请码输入框
      walletCodeError: false,//邀请码错误是否显示
      walletCodeErrorText: 'input.walletCodeError',//邀请码错误提示语

      loginMaskShow: false,//钱包未绑定邀请码的弹窗

      walletButtonText: 'login.loginBtn1',
      passFormat: 'input.passFormatTips',
      passFormatShow: false,//密码格式提示
      passFormat2: 'input.passDifferent',//两次密码输入不一致
      passFormat2Show: false,//密码格式提示
      backupText1: 'login.createdPhrase',
      backupText2: 'login.createdKey',
      privateKey: '',//备份助记词私钥
      walletBackupButton: 'login.loginBtn3',
      radioImg: agreement,//协议按钮
      radioIndex: 1,// 1 表示默认不选择 相反选择
      agreedId: false, //备份助记词按钮默认不可点击
      itemList: [],//助记词列表
      versionNumber: '',
      tabList: [
        {
          id: '01',
          cnt: 'login.importKey'
        },
        {
          id: '02',
          cnt: 'login.importKeystore'
        },
        {
          id: '03',
          cnt: 'login.importPhrase'
        }
      ],//导入钱包title
      tabIndex: 0,
      walletNameImport1: '',
      walletNameImport2: '',
      walletPrivateKey: '',//私钥
      walletNewPass: '',//导入keystroe文件输入密码
      walletPhrase: '',//助记词
      selectedKeystorePath: '',
      walletImportButton: 'login.loginBtn2',
      privateKeyErrorText: 'input.privateKeyError',//私钥错误提示语
      privateKeyError: false,//私钥错误提示是否显示
      walletnNewPassText: 'login.importSelectTxt2',//
      walletnNewPassErrorText: 'input.passUnlockError',//密码错误提示语
      showPass: false,//选择keystroe之后出现密码输入的框
      KeyStoreVal: 'login.importSelectTxt1',
      walletnNewPassError: false,//密码错误提示语是否显示
      phraseErrorText: 'input.phraseError',//助记词提示语错误
      phraseError: false,//助记词提示语是否显示
      KeyStoreColor: true,
      copyText: 'tips.copySuccess',//私钥复制
      copyShow: false,
      maskShow: false, //助记词导入钱包提示
      navQuery: {},
      contractAddress: '',
      createReadonly: false
    }
  },
  computed: {
    wallets () {
      return this.$store.getters.wallets
    },
    //创建钱包按钮是否激活
    createActive () {
      let passReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      let pass1 = this.walletPass1.replace(/\s+/g, "")
      let pass2 = this.walletPass2.replace(/\s+/g, "")
      if (passReg.test(pass1) && pass1 != pass2 && pass2.length > 0) {
        this.passFormat2Show = true
      } else {
        this.passFormat2Show = false
      }
      return this.walletName.trim().length > 0 
             && pass1.length > 7
             && passReg.test(pass1)
             && pass2 == pass1
             && this.walletCode.length === 8 && !this.createReadonly? true : false
    },
    
    //备份助记词按钮是否激活
    backupActive () {
      return this.agreedId ? true : false 
    },

    //导入钱包私钥按钮是否激活
    privateActive () {
      return this.walletPrivateKey.trim().length > 63 ? true : false
    },

    //导入钱包keystore按钮是否激活
    keystoreActive () {
      let pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      return this.walletNewPass.trim().length > 7
             && pass.test(this.walletNewPass) ? true : false
    },

    //导入钱包助记词按钮是否激活
    phraseActive () {
      return this.walletPhrase ? true : false
    }
  },
  created () {
    let createId = this.$route.query.createId
    if ((createId == 1 && this.createPages == 1) || createId === 1) {
      this.createClose = true
      this.walletNameDisable = false
    } else {
      this.createClose = false
      this.walletName = 'Mining Wallet'
      this.walletNameImport1 = 'Mining Wallet'
      this.walletNameImport2 = 'Mining Wallet'
      this.walletNameDisable = true
    }
    this.versionNumber = pkg.version
    // if (createId !== 1) {
    //   let dirPath = require('os').homedir() + '/.secwallet'
    //   let filePath = dirPath + '/wallets.data'
    //   let wallets = {}
    //   walletsHandler.getAllWalletsFromFile((wallets) => {
    //     if (JSON.stringify(wallets) !== '{}') {
    //         this.$router.push({
    //           name: 'walletIndex',
    //           query: {
    //             wallets: wallets,
    //             selectedPrivateKey: Object.keys(wallets)[0]
    //           }
    //       })
    //     } 
    //   })
    // }
  },
  mounted () {

  },
  destroyed () {},

  methods: {
    //失去焦点
    loseFocus () {
      this.passFormatShow = false
    },

    //得到焦点
    getFocus () {
      this.passFormatShow = true
    },

    //创建钱包名称不能空格开头
    inputName () {
      this.$nextTick(()=> {
        this.walletName = this.walletName.replace(/(^\s*)/g, '')
      })
    },

    //邀请码不能输入空格
    inputCode () {
      this.$nextTick(()=> {
        this.walletCode = this.walletCode.replace(/\s+/g, "").replace(/[\u4E00-\u9FA5]/g,'')
      })
    },

    //私钥钱包名称不能输入空格开头
    inputName1 () {
      this.$nextTick(()=> {
        this.walletNameImport1 = this.walletNameImport1.replace(/(^\s*)/g, '')
      })
    },

    //私钥不能输入空格
    inputPrivateKey () {
      this.$nextTick(()=> {
        this.walletPrivateKey = this.walletPrivateKey.replace(/\s+/g,'')
      })
    },

    //keystroe名称不能输入空格开头
    inputName2 () {
      this.$nextTick(()=> {
        this.walletNameImport2 = this.walletNameImport2.replace(/(^\s*)/g, '')
      })
    },

    //不能输入中文
    inputContent1 () {
      this.$nextTick(()=> {
        this.walletPass1 = this.walletPass1.replace(/[\u4E00-\u9FA5]/g,'').replace(/\s+/g,'')
      })
    },

    //不能输入中文
    inputContent2 () {
      this.$nextTick(()=> {
        this.walletPass2 = this.walletPass2.replace(/[\u4E00-\u9FA5]/g,'').replace(/\s+/g,'')
      })
    },

    //不能输入中文
    inputContent3 () {
      this.$nextTick(()=> {
        this.walletNewPass = this.walletNewPass.replace(/[\u4E00-\u9FA5]/g,'').replace(/\s+/g,'')
      })
    },

    //导入钱包
    importCreate () {
      this.createClose = true //进入导入钱包关闭按钮显示
      this.createPages = 3
      this.createTitle1 = 'login.loginImport1'
      this.createTitle2 = 'login.loginImport2'
    },

    //创建钱包  需要传邀请码
    async createWallet() {
      this.walletButtonText = 'login.loginBtn1s'
      this.createReadonly = true
      this.keys = walletsHandler.getWalletKeys() //create all keys of wallet
      let transfer = {
        nonce: "1",
        timestamp: new Date().getTime(),
        walletAddress: this.keys.userAddress,
        amount: '0',
        gasLimit: '0',
        gasPrice: '0',
        txFee: '0',
        chainName: 'SEC'
      }
      this.contractAddress = await this.$JsonRPCClient.createContractTransactionPromise(this.keys.privateKey, random(6), transfer)
      dataCenterHandler.createWallet({address: this.keys.userAddress, privateKey: this.keys.privateKey, invitationCode: this.walletCode, contractAddress: this.contractAddress}, (body) => {
        if (body && body.status && body.doc[0].role !== 'Owner') {
          this.parentWallet = body.doc[0]
          let wordsArray = this.keys.englishWords.split(' ')
          let keyDataJSON = {}
          this.itemList = []
          this.privateKey = this.keys.privateKey
          wordsArray.forEach((word, index)=>{
            this.itemList.push({
              id: index.toString(),
              cnt: word
            })
          })
          keyDataJSON[this.keys.privateKey] = {
            walletName: this.walletName,
            privateKey: this.keys.privateKey,
            publicKey: this.keys.publicKey,
            walletAddress: this.keys.userAddress,
            englishWords: this.keys.englishWords
          }
          walletsHandler.saveKeyStore(`BIUT${this.keys.userAddress}`, keyDataJSON, (this.walletPass1).replace(/\s+/g, ""))
          this.createClose = true //进入备份助记词关闭按钮显示
          this.createPages = 2
          this.createTitle1 = 'login.loginImport2'
          this.createTitle2 = 'login.loginCreated'
          this.walletButtonText = 'login.loginBtn1'
          this.createReadonly = false
        } else {
          this.walletCodeError = true
          this.walletCodeErrorText = 'input.walletCodeError'
          this.walletButtonText = 'login.loginBtn1'
          this.createReadonly = false
        }
      })
    },

    //创建钱包的关闭方法
    closeCreate () {
      let createId = this.$route.query.createId // 获取路由参数，如果 是 1 是从主页进入的 ，否则点击关闭按钮返回创建页面
      if (createId === 1 && this.createPages === 1) {
        this.$router.push({name: 'walletIndex'})
        // this.$router.push({name: 'walletIndex', query: {wallets: this.$route.query.wallets, selectedPrivateKey: this.$route.query.selectedPrivateKey}})
      } else if (this.createPages == 2 && createId == 1  || this.createPages == 3  && createId == 1) {
        this.createPages = 1
        this.createTitle1 = 'login.loginCreate1'
        this.createTitle2 = 'login.loginCreate2'
        this.walletNameImport1 = ''
        this.walletPrivateKey = ''
        this.showPass = false
        this.walletNameImport2 = ''
        this.walletPhrase = ''
        this.KeyStoreVal = 'login.importSelectTxt1'
        this.walletNewPass = ''
        this.walletnNewPassError = false
        this.KeyStoreColor = true
        this.radioIndex = 1
        this.agreedId = false
        this.radioImg = agreement
        this.walletName = ''
        this.walletPass1 = ''
        this.walletPass2 = ''
        this.privateKeyError = false
        this.phraseError = false
      } else {  //其他就是创建钱包
        this.createPages = 1
        this.createClose = false
        this.createTitle1 = 'login.loginCreate1'
        this.createTitle2 = 'login.loginCreate2'
        this.walletNameImport1 = 'Mining Wallet'
        this.walletPrivateKey = ''
        this.showPass = false
        this.walletNameImport2 = 'Mining Wallet'
        this.walletPhrase = ''
        this.KeyStoreVal = 'login.importSelectTxt1'
        this.walletNewPass = ''
        this.walletnNewPassError = false
        this.KeyStoreColor = true
        this.radioIndex = 1
        this.agreedId = false
        this.radioImg = agreement
        this.walletName = 'Mining Wallet'
        this.walletPass1 = ''
        this.walletPass2 = ''
        this.privateKeyError = false
        this.phraseError = false
      }
    },

    //复制私钥
    copyPrivateKey () {
      var clipboard = new Clipboard('.copyButton')
      this.copyShow = true
      clipboard.on('success', e => {
          clipboard.destroy()
          setTimeout(() => {
            this.copyShow = false
          }, 3000)
      })
      clipboard.on('error', e => {
          this.copyText = "tips.copyFailure"
          setTimeout(() => {
              this.copyShow = false
          }, 3000)
          clipboard.destroy()
      })
    },

    //备份助记词成功进入钱包主页
    backupWallet () {
      this.$store.commit('addWallet', {
        walletName: this.walletName,
        privateKey: this.keys.privateKey,
        publicKey: this.keys.publicKey,
        walletAddress: this.keys.userAddress,
        englishWords: this.keys.englishWords,
        invitationCode: this.parentWallet.invitationCode,
        ownInvitationCode: this.parentWallet.ownInvitationCode,
        mortgagePoolAddress: this.parentWallet.role === 'Miner' ? [this.parentWallet.mortgagePoolAddress] : [this.parentWallet.ownPoolAddress],
        mortgageValue: '0',
        ownPoolAddress: [this.contractAddress],
        role: this.parentWallet.role
      })
      this.$router.push({name: 'walletIndex'})
      // walletsHandler.backUpWalletIntoFile({
      //   walletName: this.walletName,
      //   privateKey: this.keys.privateKey,
      //   publicKey: this.keys.publicKey,
      //   walletAddress: this.keys.userAddress,
      //   englishWords: this.keys.englishWords,
      //   invitationCode: this.parentWallet.invitationCode,
      //   ownInvitationCode: this.parentWallet.ownInvitationCode,
      //   mortgagePoolAddress: this.parentWallet.role === 'Miner' ? [this.parentWallet.mortgagePoolAddress] : [this.parentWallet.ownPoolAddress],
      //   mortgageValue: '0',
      //   ownPoolAddress: [this.contractAddress],
      //   role: this.parentWallet.role
      // }, (keyDataJSON) => {
      //   window.sessionStorage.setItem("selectedPrivateKey", this.keys.privateKey)
      //     this.$router.push({name: 'walletIndex', query: {wallets: keyDataJSON, selectedPrivateKey: this.keys.privateKey}})
      // })
    },

    //导入钱包
    importWallet () {
      let walletIdx = this.tabIndex // walletIdx 0 私钥导入 1 keystroe 2 助记词导入

      if (walletIdx == 0) {
        if (this.walletNameImport1 === '' || this.walletNameImport1.trim().length === ' ') {
          this._importNameError(0)
          return
        } 
        walletsHandler.importWalletFromPrivateKey(this.walletPrivateKey, this.walletNameImport1, (wallets, selectedPrivateKey) => {
          window.sessionStorage.setItem("selectedPrivateKey", selectedPrivateKey)
          this._findOutWallet(wallets, selectedPrivateKey, 'privatekey')
            //this.$router.push({ name: 'index',query: { wallets: wallets, selectedPrivateKey: selectedPrivateKey}})
        })
      } else if (walletIdx == 1) {
        walletsHandler.decryptKeyStoreFile(this.selectedKeystorePath, (this.walletNewPass).replace(/\s+/g, ""), (wallets, selectedPrivateKey) => {
          window.sessionStorage.setItem("selectedPrivateKey", selectedPrivateKey)
          if (this.createId === 1) {
            wallets[selectedPrivateKey].walletName = 'Mining Wallet'
          }
          this._findOutWallet(wallets, selectedPrivateKey, 'keystore')
            //this.$router.push({ name: 'index',query: { wallets: wallets, selectedPrivateKey: selectedPrivateKey}})
        }) 
      } else {
        if (this.walletNameImport2 === '' || this.walletNameImport2.trim().length === ' ') {
          this._importNameError(2)
          return
        } 
        walletsHandler.importWalletFromPhrase(this.walletPhrase, this.walletNameImport2, (wallets, selectedPrivateKey) => {
              //this.maskShow = true
          this.navQuery = {
            wallets: wallets,
            selectedPrivateKey: selectedPrivateKey
          }
          window.sessionStorage.setItem("selectedPrivateKey", this.navQuery.selectedPrivateKey)
          this._findOutWallet(wallets, selectedPrivateKey, 'phrase')
              //this.$router.push({ name: 'index',query: { wallets: this.navQuery.wallets, selectedPrivateKey: this.navQuery.selectedPrivateKey}})
        })
      }
    },

    _findOutWallet (wallets, privateKey, from) {
      if (wallets === 'error') {

        this._showImportError(from, '')
        //this.walletnNewPassErrorText = "input.passUnlockError"
        //this.walletnNewPassError = true
        return
      }
      if (this.wallets.filter(item => item.privateKey === privateKey).length > 0) {
        this._showImportError(from, 'input.imporantExists')
      } else {
        dataCenterHandler.findOutWallet({address: wallets[privateKey].walletAddress}, (body) => {
        if (body && body.doc.length > 0) {
          wallets[privateKey].role = body.doc[0].role
          wallets[privateKey].invitationCode = body.doc[0].invitationCode
          wallets[privateKey].ownInvitationCode = body.doc[0].ownInvitationCode
          wallets[privateKey].mortgageValue = body.doc[0].mortgageValue
          wallets[privateKey].mortgagePoolAddress = body.doc[0].mortgagePoolAddress
          wallets[privateKey].ownPoolAddress = body.doc[0].ownPoolAddress
          this.$store.commit('addWallet', wallets[privateKey])
          this.$router.push({ name: 'index' })
        } else {
          this.loginMaskShow = true
          //this._showImportError(from, body.message)
        }
      })
      }
    },

    _showImportError (from, error) {
      switch (from) {
        case "privatekey":
          this.privateKeyError = true
          this.privateKeyErrorText = error === '' ? "input.privateKeyError" : error
          break
        case "keystore":
          this.walletnNewPassError = true
          this.walletnNewPassErrorText = error === '' ? "input.passUnlockError" : error
          break
        case "phrase":
            this.phraseError = true
            this.phraseErrorText = error === '' ? "input.phraseError" : error
          break
        default:
          break
      }
    },

    // _navToNext () {
    //   this.maskShow = false
    //   window.sessionStorage.setItem("selectedPrivateKey", this.navQuery.selectedPrivateKey)
    //   this.$router.push({ name: 'index',query: { wallets: this.navQuery.wallets, selectedPrivateKey: this.navQuery.selectedPrivateKey}})
    // },

    _importNameError (index) {
      switch (index) {
        case 0:
          this.privateKeyErrorText = 'input.nameNull'
          this.privateKeyError = true
          break
        case 1:
          this.walletnNewPassErrorText = 'input.nameNull'
          this.walletnNewPassError = true
          break
        case 2:
          this.phraseErrorText = 'input.nameNull'
          this.phraseError = true
          break
      }
    },

    //获取input file上传文件的相关属性
    tirggerFile (event) {
      var file = event.target.files;
      if (file.length === 1) {
        this.KeyStoreVal = file[0].name
        this.selectedKeystorePath = file[0].path
        this.showPass = true
        this.KeyStoreColor = false
      } else {
        this.KeyStoreVal = 'login.importSelectTxt1'
        this.walletNewPass = ''
        this.walletnNewPassError = false
        this.showPass = false
        this.KeyStoreColor = true
      }
    },

    //备份助记词同意协议
    checkRadio () {
      this.radioIndex = !this.radioIndex
      this.agreedId = !this.agreedId
      if (this.radioIndex == 1) {
        this.radioImg = agreement
      } else {
        this.radioImg = agreements
      }
    },

    //切换导入钱包的方式
    isTab (index) {
      // this.walletNameImport1 = ''
      // this.walletNameImport2 = ''
      // this.walletPrivateKey = ''
      // this.walletPhrase = ''
      this.tabIndex = index
    },

    closeMask () {
      this.loginMaskShow = false
    }
  },
  watch: {
    walletName (newVal, oldVal) {
      let xReg = /[^\x00-\xff]/g
      if (this.getBLen(newVal) > 14 && xReg.test(newVal)) {
        this.$nextTick(()=> {
          this.walletName = newVal.slice(0, 7)
        })
      }
    },

    walletNameImport1 (newName1, oldName1) {
      let xReg = /[^\x00-\xff]/g
      if (this.getBLen(newName1) > 14 && xReg.test(newName1)) {
        this.$nextTick(()=> {
          this.walletNameImport1 = newName1.slice(0, 7)
        })
      }
    },

    walletNameImport2 (newName2, oldName2) {
      let xReg = /[^\x00-\xff]/g
      if (this.getBLen(newName2) > 14 && xReg.test(newName2)) {
        this.$nextTick(()=> {
          this.walletNameImport2 = newName2.slice(0, 7)
        })
      }
    },

    walletCode (newCode, oldCode) {
      if (newCode.length > 0 && newCode.length < 8) {
       this.walletCodeError = true
      } else {
        this.walletCodeError = false
      }
    }
  }
}
</script>

<style scoped>
  main {display: flex;height: 100vh;position: relative;}
  main aside {background: url('../../assets/images/loginBackground.png') no-repeat center;
    background-size: 100% 100%;width: 372px;}
  main aside img {margin: 32px 0 0 24px;}
  main aside h2 {color: #fff;font-size: 32px;margin: 0;padding-left: 64px;font-family: Montserrat-SemiBold;}
  .en main aside h2 {font-family: Source-Medium;}

  h4 {font-size: 22px;font-family: Lato-Regular;font-weight: bold;margin: 0;padding-bottom: 32px;color:#6D7880;}

  main aside .titleTop {margin-top: 155px;}
  main aside span {display: block;width:43px;height:10px;background:rgba(255,255,255,1);
    margin-top: 16px;margin-left: 64px;}
  
  main .wallet-version {position: absolute;right: 28px;bottom: 24px;color: #839299;}
  .en main .wallet-version {font-family: Lato-Regular;}
  main .closeImg {width: 24px;height: 24px;position: absolute;top: 20px;right: 20px;}
  main .wallet-nav {position: absolute;top: 0;right: 0;height: 30px;left: 351px;
    border-bottom: 1px solid #E5E5E5;text-align: right;}
  
  /* 创建钱包 */
  .wallet-create {padding: 142px 68px 0;flex: 1;width: 450px;}
  .wallet-create p {padding-top: 24px;}
  .wallet-create .wallet-button-create {width:190px;margin-top: 36px;}
  .wallet-create .wallet-button-important {display: inline-block;padding: 8px 12px;
    color: #0B7FE6;font-weight: 400;border:1px solid rgba(229,229,229,1);border-radius:4px;
    position: absolute;right: 68px;top: 48px;}

  /* 备份助记词 */
  .wallet-backup {padding: 94px 68px 0;flex: 1;}

  .wallet-backup .backup-title {font-size: 14px;padding-top: 0;padding-bottom: 32px;word-break: break-word;color: #EE1C39;line-height: 1.5;}
  .en .wallet-backup .backup-title {font-size: 12px;padding-top: 0;padding-bottom: 20px;word-break: break-word;color: #EE1C39;line-height: 1.5;}
  .wallet-backup .backup-title label{font-family: Lato-Bold;}
  .en .wallet-backup .backup-title label{font-family: Source-Regular;}
  .wallet-backup .private-key-title {padding-top: 17px;}
  .wallet-backup .private-key-contant {background:rgba(242,242,242,1);border-radius:4px;color: #252F33;font-size: 14px;font-family: Lato-Regular;
    margin-top: 10px;padding: 11px 18px;word-break: break-all;line-height: 1.4;}
  .wallet-backup .private-key-contant img {margin-left: 20px;vertical-align: middle;}
  .wallet-backup .private-key-contant img:hover {cursor: pointer;}
  .wallet-backup .wallet-button-backup {width:190px;}
  .wallet-backup .radio-content {padding: 25px 0 16px;display: flex;align-items: center;color: #252F33;}
  .en .wallet-backup .radio-content {padding: 36px 0;}
  .wallet-backup .radio-content img {margin-right: 10px;width: 14px;height: 14px;}
  .wallet-backup .radio-content span {color: #00D86D;}

  /* 导入钱包 */
  .wallet-import {padding: 118px 94px 0 104px;flex: 1;}
  .wallet-import ul {display: flex;height: 36px;line-height: 36px;color: #388ED9;font-size: 14px;justify-content: space-between;}
  .wallet-import ul li {text-align: center;border:1px solid rgba(229,229,229,1);display: block;flex: 1;box-sizing: border-box;}
  .wallet-import ul li:first-child {border-top-left-radius: 4px;border-right: 0;border-bottom-left-radius: 4px;}
  .wallet-import ul li:last-child {border-top-right-radius: 4px;border-left: 0;border-bottom-right-radius: 4px;}
  .wallet-import ul .check-li {background:linear-gradient(90deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%);color: #fff;}
  .wallet-import button {width: 190px!important;margin-top: 48px;}
  .wallet-import .go-create {color: #576066;padding-top: 28px;}
  .wallet-import .go-create span {color: #29D893;}
  .wallet-import textarea {border: 1px solid #E6E6E6;border-radius: 4px;height: 108px;color: #252F33;box-sizing: border-box;
    padding: 24px;outline: none;resize: none;flex: 1;margin-top: 20px;font-size: 14px;overflow: auto;
    font-family: Lato-Regular;}
  .wallet-import textarea::-webkit-scrollbar {display: none;}

  .wallet-import .KeyStoreColor {color: #29D893;}
  /* 导入钱包 -- 私钥导入 */
  .wallet-import-private-key,.wallet-import-keystore,
  .wallet-import-phrase {display: flex;flex-direction: column;}

  .wallet-import-private-key input,.wallet-import-phrase input{margin-top: 32px;}
  
  /* 导入钱包 -- keyStore导入 */
  .wallet-import-keystore p {font-size: 14px;color: #839299;font-family: Lato-Bold;}
  .en .wallet-import-keystore p {font-family: Source-Medium;}
  .wallet-import-keystore .wallet-import-keystore-title {margin: 32px 0 12px;}
  .wallet-import-keystore div {flex: 1;background:rgba(242,242,242,1);border-radius:4px;font-family: Lato-Regular;
    color: #42535B;font-size: 14px;margin-bottom: 20px;text-align: center;height: 36px;line-height: 36px;
    position: relative;}
  .wallet-import-keystore button {margin-top: 28px;}
  .wallet-import-keystore div input[type='file'] {position: absolute;top: 0;left: 0;right: 0;bottom: 0;
    height: 36px;z-index: 2;width: 100%;opacity: 0;}

  .phrase-mask {position: relative;font-size: 14px;font-weight: 400;color: #576066;}
  .maskCloseImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  .maskCloseImg:hover {cursor: pointer;} 
  .phrase-mask-body {padding: 44px 20px 16px 24px;text-align: right;}
  .phrase-mask-body p {text-align: left;margin-bottom: 58px;}
  .phrase-mask-body button {color: #fff;width:97px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    height:32px;border: 0;border-radius: 4px;}
</style>