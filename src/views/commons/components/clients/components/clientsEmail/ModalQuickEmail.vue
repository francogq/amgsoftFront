<template>
  <div>
    <div class="w-100 text-right">
      <b-button variant="info" class="mb-2" @click="createQuick" >Create</b-button>
    </div>
    <b-table
      show-empty
      ref="refClientsList"
      sticky-header
      small
      responsive="sm"
      :fields="fieldsQuicks"
      :items="quicks"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>
      <!-- Column EMAIL -->
      <template #cell(content)="data">
        <div
          v-html="(data.item.content.length >= 75 && !data.item.showMore) ? `${data.item.content.replace(/\n/g, '<br \/>').substr(0, 75)}...` : data.item.content.replace(/\n/g, '<br \/>')"
        />
      </template>
      <!-- Column CREATED BY -->
      <template  #cell(user_created)="data">
        <div>
          <span>{{data.item.user_created}}</span>
        </div>
        <span>{{data.item.created_at | myGlobal}}</span>
      </template>
      <!-- Column UPDATED BY -->
      <template #cell(updated_at)="data">
        <div>
          <span>{{data.item.user_updated}}</span>
        </div>
        <span v-if="data.item.updated_at != null">{{data.item.updated_at | myGlobal}}</span>
      </template>
      <!-- Column ACTIONS -->
          <template #cell(action)="data">
            <b-dropdown variant="link" no-caret :right="$store.state.appConfig.isRTL">
              <template #button-content>
                <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
              </template>
              <!-- Button EDIT   -->
              <b-dropdown-item  variant="warning" @click="editQuick(data.item.id,data.item.content,data.item.subject)" >
                <feather-icon icon="TrashIcon" />
                <span class="align-middle ml-50">Edit</span>
              </b-dropdown-item>
              <!-- Button DELETE  -->
              <b-dropdown-item variant="danger" @click="deleteQuick(data.item.id)">
                <feather-icon icon="TrashIcon" />
                <span class="align-middle ml-50">Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
    </b-table>
    <!-- Modal Quick Email Save -->
   
     <b-modal
      id="modal-quick-email-save"
      title-class="h4 text-white"
      modal-class="modal-primary"
      centered
      size="lg"
      :title="(type)==1 ? 'Edit Quick Email' : 'New Quick Email'"
      hide-footer
    >
       <modal-quick-email-save :quick="this.addquick" :modul="this.modul" :type="this.type" />
    </b-modal>
  </div>
</template>

<script>
import {  mapActions, mapState } from "vuex";
// Import Service
import ClientService from "../../services/clients.services"
// Import Components
import ModalQuickEmailSave from "./ModalQuickEmailSave.vue"
export default {
  props:{
    modul:{
      type:[Number,String]
    }
  },
  components:{
    ModalQuickEmailSave,
  },
  data(){
    return {
      quickemail:false,
      modal:false,
      gifsearch: true,
      addquick: {},
      type:'',
      isBusy: false,
      fieldsQuicks: [
        { key: "subject",label:"Subject" },
        { key: "content",label:"Email" },
        { key: "user_created",label:"Created by" },
        { key: "updated_at",label:"Updated by" },
        { key : "action", label:"Actions"}
      ]
    }
  },
  computed:{
    ...mapState("clients-store",["quicks"]),
  },
  methods:{
    ...mapActions("clients-store",["REMOVE_QUICK"]),
    createQuick(){
      this.type = 0
      this.addquick = {'id': '','content' : '','subject':''}
      this.$bvModal.show("modal-quick-email-save")
    },
    editQuick(id,sms,title){
      this.type = 1
      this.addquick = {'id': id,'content' : sms ,'subject': title }
      this.$bvModal.show("modal-quick-email-save")
    },
    deleteQuick:async function(id){
        const confirm = await this.showConfirmSwal();
        if (confirm.isConfirmed) {
          try {
            this.REMOVE_QUICK(id)
            const data = await ClientService.deleteQuickEmail({ id:id})
            this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
          }catch(error){
            console.log("Something went wrong modalQuickDelete", error);
            this.showToast(
              "danger",
              "top-right",
              "Oop!",
              "AlertOctagonIcon",
              this.getInternalErrors(error)
            );
          }
        }
      
    }
    },
  created(){

  }
}
</script>
