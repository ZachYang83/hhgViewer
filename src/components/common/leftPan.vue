<template>
  <div class="leftPan" ref="leftPan">
    <div class="itemGroup">
      <template v-for="item in subItems">
        <li :index="item.title" :key="item.id" @click="changeInfo(item)" class="subItem" :class="activeIndex == item.id ? 'active':''">
          <div class="itemImg">
            <img
              :src="item.src"
              style="width: 28px; height: 28px; margin: 0 auto"
            />
          </div>
          <span class="itemTitle">{{ item.title }}</span>
        </li>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      activeIndex:-1,
    }
  },
  props: {
    subItems: {
      default: Array,
    },
  },
  methods:{
    changeInfo(item){
      this.activeIndex = item.id;
      this.$emit("changeWMS",item)
    }
  }
};
</script>

<style lang="scss" scoped>
.leftPan {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 80px;
  height: 100%;
  z-index: 999;
  padding: 30px 5px;
  background: rgba(0, 0, 0, 0.3);

  .itemGroup {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;

    .subItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      width: 70px;
      height: 70px;
      margin:30px 0px; 
      border-radius: 20%;
      color:aliceblue;
      cursor: pointer;
      &.active{
        background:rgba(30, 198, 240, 0.5);
      }

      &:hover{
        background:rgba(30, 198, 240, 0.5);
      }

      .itemTitle{
        display: block;
      }
    }
  }
}
</style>