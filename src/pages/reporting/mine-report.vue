<template>
  <div class="container">
    <div class="input">
      <span>请输入队列数量:</span>
      <input type="number" v-model="numOfTeams" />
    </div>
    <div class="input">
      <span>请输入人数:</span>
      <input type="number" v-model="numOfPeople" />
    </div>
    <div class="btn">
      <button @click.prevent="generateTeams()">生成队伍</button>
    </div>
    <div v-if="teams.length" class="listText">
      <ul>
        <li v-for="(team, index) in teams" :key="index">
          {{ `队伍 ${index + 1}: ${sortArr(team).join(", ")}` }}
          <p>队伍总人数：{{ team.length }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "mine-report",
  data() {
    return {
      numOfTeams: null,
      numOfPeople: null,
      teams: [],
    };
  },
  watch: {},
  onLoad() {},
  onShow() {},
  methods: {
    generateTeams() {
      if (!this.numOfTeams || !this.numOfPeople) return;
      let numOfPeople = this.numOfPeople;
      let numOfTeams = this.numOfTeams;
      // 生成一个包含1到numOfPeople的整数数组
      let people = Array.from({ length: numOfPeople }, (_, i) => i + 1);
      // 随机打乱数组顺序
      let shuffledPeople = this.shuffleArray(people);
      let teams = [];
      let currentTeamSize;

      for (let i = 0; i < numOfTeams; i++) {
        // 计算当前队伍的人数
        currentTeamSize = Math.ceil(numOfPeople / (numOfTeams - i));
        // 将随机分配的人员添加到当前队伍中
        teams.push(shuffledPeople.splice(0, currentTeamSize));
        // 更新剩余人数
        numOfPeople -= currentTeamSize;
      }
      this.teams = teams;
    },
    shuffleArray(array) {
      // 将每个元素与一个随机下标对应的元素交换位置
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    sortArr(arr) {
      arr.sort((a, b) => a - b);
      return arr;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding-top: 40rpx;
  padding-bottom: 24rpx;
  background: white;
  position: relative;
  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60rpx;
    margin-bottom: 16rpx;
    span {
      width: 240rpx;
    }
    input {
      flex-shrink: 0;
      margin-left: 16rpx;
      background: #eee;
    }
  }
  .btn {
    button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 220rpx;
      height: 96rpx;
      margin: 24rpx 0;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 48rpx;
      background: #333333;
      border-radius: 48rpx;
    }
  }
  .listText {
    font-size: 32rpx;
    ul {
      li {
        margin-bottom: 16rpx;
      }
    }
  }
}
</style>
