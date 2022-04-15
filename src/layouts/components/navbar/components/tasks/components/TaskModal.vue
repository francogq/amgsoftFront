<template>
  <b-tabs pills lazy active-nav-item-class="bg-primary box-shadow-info">
    <b-tab active :title-link-class="[bgTabsNavs, 'px-3']">
      <template #title>OVERDUE ({{taskCounter.overdue}})</template>
      <task-list :type="1"></task-list>
    </b-tab>
    <b-tab :title-link-class="[bgTabsNavs, 'px-3']">
      <template #title>TODAY ({{taskCounter.today}})</template>
      <task-list :type="2"></task-list>
    </b-tab>
    <b-tab :title-link-class="[bgTabsNavs, 'px-3']">
      <template #title>UPCOMING ({{taskCounter.upcoming}})</template>
      <task-list-upcoming :type="3"></task-list-upcoming>
    </b-tab>
    <b-tab :title-link-class="[bgTabsNavs, 'px-3']">
      <template #title>COMPLETED ({{taskCounter.done}})</template>
      <task-list :type="4"></task-list>
    </b-tab>
  </b-tabs>
</template>

<script>
import TaskList from "./TaskList.vue";
import TaskListUpcoming from "./TaskListUpcoming.vue";
import { mapState } from "vuex";
export default {
  components: {
    TaskList,
    TaskListUpcoming
  },
  computed: {
    ...mapState({
      taskCounter: state => state.TaskStore.S_TASK_COUNTER
    })
  }
};
</script>

<style>
</style>