<template>
  <main class="mask">
    <section class="rules-content" v-show="pagesIdx == 1">
      <section class="public-title">
        <h2>{{ $t('homeInvitationMask.hiMaskRulesTit') }}</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </section>
      <p>{{ $t('homeInvitationMask.hiMaskRulesTxt') }}</p>
      <ul>
        <li>
          <span> </span>
          <span>{{ $t('homeInvitationMask.hiMaskRulesListTxt1') }}</span>
          <span>{{ $t('homeInvitationMask.hiMaskRulesListTxt2') }}</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <span><img :src="item.rulesImg" alt=""></span>
          <span>{{ $t(item.rulesLevel) }}</span>
          <span>{{ $t(item.rulesNumber) }}</span>
        </li>
      </ul>
    </section>

    <section class="details-content" v-show="pagesIdx == 2">
      <section class="public-title">
        <h2>{{ $t('homeInvitationMask.hiMaskDetailsTit') }}</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </section>

      <ul>
        <li>
          <span>{{ $t('homeInvitationMask.hiMaskDetailsListTxt1') }}</span>
          <span>{{ $t('homeInvitationMask.hiMaskDetailsListTxt2') }}</span>
          <span>{{ $t('homeInvitationMask.hiMaskDetailsListTxt3') }}</span>
        </li>
        <li v-for="(item, index) in detailsLists" :key="index">
          <span>{{ item.detailsAddress }}</span>
          <span>{{ item.detailsTime.slice(0, 19) }}</span>
          <span class="list-money">{{ getPointNum(item.detailsMoney) }}</span>
        </li>

        <!-- 列表为空 -->
        <p v-show="detailsLists.length === 0" class="list-null">
          {{ $t('homeInvitationMask.hiMaskDetailsListNull') }}
        </p>
      </ul>

      <!-- 分页 -->
         <!-- <wallet-pages 
        class="page-container"
        v-show="detailsLists.length > 5"
        :total="detailsLists.length"
        @next="nextPage"
        @prev="prevPage"
        @goPage="goPage" /> -->
    </section>
  </main>
</template>

<script>
import level1 from '../../../assets/images/level1.png'
import level2 from '../../../assets/images/level2.png'
import level3 from '../../../assets/images/level3.png'
import level4 from '../../../assets/images/level4.png'
import walletPages from '../../../components/wallet-pages'
export default {
  name: '',
  props: {
    pagesIdx: Number,
    maskAddress: String,
    maskLevel: Number,
    maskMoney: String,
    detailList: Array
  },
  components: {
    walletPages
  },
  computed: {
    detailsLists () {
      return this.detailList
    },

    userLevel () {
      let level = this.maskLevel
      let locale = this.$i18n.locale
      if (locale === "en") {
        if (level == 1) {
          return 'level1'
        } else if (level == "2") {
          return 'level2'
        } else if (level == "3") {
          return 'level3'
        } else {
          return 'level4'
        }
      } else {
        if (level == "1") {
          return '一级'
        } else if (level == "2") {
          return '二级'
        } else if (level == "3") {
          return '三级'
        } else {
          return '四级'
        }
      }
    }
  },
  created() {

  },

  data () {
    return {
      itemList: [
        {
          id: '1',
          rulesImg: level1,
          rulesLevel: 'homeInvitationMask.hiMaskRulesListLevel1',
          rulesNumber: '0-9',
          rulesReward1: '2%',
          rulesReward2: '1%'
        },
        {
          id: '2',
          rulesImg: level2,
          rulesLevel: 'homeInvitationMask.hiMaskRulesListLevel2',
          rulesNumber: '10-31',
          rulesReward1: '4%',
          rulesReward2: '2%'
        },
        {
          id: '3',
          rulesImg: level3,
          rulesLevel: 'homeInvitationMask.hiMaskRulesListLevel3',
          rulesNumber: '32-63',
          rulesReward1: '7%',
          rulesReward2: '3%'
        },
        {
          id: '4',
          rulesImg: level4,
          rulesLevel: 'homeInvitationMask.hiMaskRulesListLevel4',
          rulesNumber: 'homeInvitationMask.hiMaskRulesListLevel4Txt',
          rulesReward1: '10%',
          rulesReward2: '4%'
        }
      ]
    }
  },
  methods: {
    //关闭弹窗
    cloasMask () {
      this.$emit('close')
    },

    //下一页
    nextPage () {
      alert("下一页")
    },

    //上一页
    prevPage () {
      alert("上一页")
    },

    //失去焦点跳转到指定的页面
    goPage (e) {
      alert("失去焦点跳转页面" + e)
    }
  },
}
</script>

<style scoped>
  .public-title {display: flex;align-items: center;justify-content: space-between;position: relative;}
  .public-title h2 {margin: 0;font-size: 22px;color: #42535B;padding: 30px 0 28px;font-family: Lato-Bold;}
  .en .public-title h2 {font-family: Source-Medium;font-weight: 500;}
  .public-title img {cursor: pointer;position: absolute;right: -16px;top: 16px;}

  .rules-content {width: 332px;background: #fff;padding: 0 32px 36px;border-radius: 4px;}
  .rules-content p {padding-bottom: 14px;color: #99A1A6;font-size: 14px;}
  .en .rules-content p {font-size: 12px;color: #6D7880;}
  .rules-content ul li {display: flex;align-items: center;border-bottom:1px solid #e6e6e6;height: 42px;
    color: #252F33;font-size: 13px;}
  .en .rules-content ul li {color: #42535B;}
  .rules-content ul li:first-child {color: #99A1A6;background:#f7fbfa;border: 0;font-family: Lato-Medium;}
  .en .rules-content ul li:first-child {font-family: Source-Medium;}
  .rules-content ul li span:nth-child(2) {margin-left: 20px;width: 100px;}
  .rules-content ul li span:last-child {width: 200px;text-align: center;}
  .rules-content ul li:first-child span:nth-child(2) {margin-left: 44px;}
  .rules-content ul li:first-child span:last-child {width: 200px;text-align: center;display: inline-block;}


  .details-content {width: 778px;background: #fff;padding: 32px 0 0 32px;border-radius: 4px;height: 470px;}
  .details-content h2 {padding: 0;}
  .details-content .public-title img {top: -8px;right: 30px;}
  .details-content ul {margin-top: 36px;overflow: auto;padding-right: 32px;height: calc(100% - 62px);}
  .details-content ul::-webkit-scrollbar { width: 2px; height: 2px;}
  .details-content ul::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .details-content ul::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}

  .details-content ul li {display: flex;align-items: center;padding-left: 20px;color: #252F33;font-size: 14px;height: 42px;
    box-sizing: border-box;border-bottom: 1px solid #E6E6E6;font-family: Lato-Medium;}
  
  
  .details-content ul li:first-child {height:42px;background:#f7fbfa;padding: 0 0 0 20px;color: #99A1A6;border: 0;}
  .en .details-content ul li:first-child {font-family: Source-Medium;}

  .details-content ul li span:first-child {display: inline-block;width: 368px;}
  .details-content ul li span:nth-child(2) {width: 194px;}
  .details-content ul li span:last-child {flex: 1;}
  

  .details-list {font-size: 14px;color: #252F33;}
  .details-list-top {padding-top: 16px;}
  .details-list-tit {color: #99A1A6;padding-bottom: 6px;font-family: Lato-Bold;}
  .en .details-list-tit {font-family: Source-Regular;}
  .details-list-level {width:56px;height:24px;background:#f5a623;border-radius:16px;display: inline-block;margin-left: 12px;
    text-align: center;line-height: 24px;color: #fff;}

  .page-container {padding-top: 16px;}

  .list-null {display: flex;align-items: center;justify-content: center;height: calc(100% - 42px);font-size: 16px;font-family: Lato-Medium;
    color: #99A1A6;}

  .en .list-null {font-family: Source-Medium;}

  .list-money {color: #388ED9;}
</style>