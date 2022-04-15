<template>
  <div>
    <feather-icon id="icon" icon="CircleIcon" size="13" :class="colorStatusText.selected" />
    {{colorStatusText.text}}
  </div>
</template>

<script>
export default {
  props: {
    account: {
      type: Object,
    },
  },
  computed: {
    colorStatusText() {
      let selected
      let text
      switch (this.account.status) {
        case 1:
          selected = "green"
           text = "Active"
          break
        case 2:
          if (this.account.validate_sp == 1) {
            selected = "yellow"
          }
          if (this.account.validate_sp == 2) {
            selected = "red"
          }
          text = "Hold"
          break
        case 3:
          selected = "blue"
          text = "Transition"
          break
        case 4:
          selected = "red"
          text = "Canceled"
          break
        case 5:
          selected = "red"
          text = "Loyal"
          break
        case 6:
          selected = "red"
          text = "Closed"
          break
      }
      return {selected,text}
    },
  },
}
</script>

<style scoped>
#icon {
  border-radius: 50%;
  margin-bottom: 2px;
  margin-right: 5px;
}
.green {
  color: #00cc00;
  border-color: #00cc00;
  background: #00cc00;
}
.blue {
  color: #0066ff;
  border-color: #00cc00;
  background: #0066ff;
}
.red {
  color: red;
  border-color: red;
  background: red;
}
.yellow {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 14px solid #ffc107;
}
</style>
