<template>
  <div>
    <b-modal
      modal
      v-model="modalService"
      size="lg"
      header-class="p-0"
      header-bg-variant="transparent border-bottom border-bottom-2"
      modal-class="modal-primary"
      title-class="h2 text-white"
      hide-footer
      :no-close-on-backdrop="true"
    >
      <!-- HEADER START -->
      <template v-slot:modal-header>
        <modal-service-header
          :type-modal="typeModal"
          :programs-all="programsAll"
          :users-services="usersServices"
          :sales="Client"
          :twoPerRow="true"
          @close="hideModal(false)"
          @changeProgram="changeProgram"
        />
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ModalServiceHeader from "@/views/crm/views/sales-made/components/modals/services/ModalServiceHeader.vue";
import ButtonCancel from "@/views/commons/utilities/ButtonCancel";
import ButtonSave from "@/views/commons/utilities/ButtonSave";
// Import Services
import ClientService from "../services/clients.services"
export default {
  components: {
    ButtonSave,
    ButtonCancel,
    ModalServiceHeader,
  },
  props: {
    modalOpenAddService: {
      type: Boolean,
    },
    detailsClient:{
        type:Object
    },
    typeModal:{
        type:[Number,String]
    }
  },
  data() {
      return {
          modalService: this.modalOpenAddService,
          Client:{},
          programsAll:[],
          usersServices:[],
      }
  },
  computed:{
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    
  },
  methods: {
    closeModal(){
          this.$emit("closeModalService")
    },
    changeProgram(data) {
      this.$emit("changeProgram", data);
    },
    hideModal() {
      this.$emit("hideModal", false);
    },
    usersAllPrograms:async function(){
      try{
        const data = await ClientService.usersAllPrograms({id: this.$route.meta.module})
        this.usersServices = data.data
        this.usersServices.unshift({id: 1, user_name: "CEO"})
      }catch(error){
        console.log(error)
      }
    },
    searchPrograms:async function(lead_id) {
      try{
        const response = await ClientService.searchClientPayment({id: lead_id})
        if (response.status == 200) {
            let programs = response.data;
            const data = await ClientService.programs()
            this.programsAll = data.data;
            programs.sort(function (a, b) {
                return a.program_id - b.program_id;
              });
              for (var i = 0; i < this.programsAll.length; i++) {
                for (var y = 0; y < programs.length; y++) {
                  if (this.programsAll[i].id == programs[y].program_id) {
                    this.programsAll.splice(i, 1);
                  }
                }
              }
            var sper = this.currentUser.sale_permission
            var spn = [];
            if (sper.length != this.programsAll.length) {
                sper.map((spe) => {
                  this.programsAll.map((pro) => {
                    if (spe.id == pro.id) {
                      spn.push(pro);
                    }
                  });
                });
                this.programsAll = spn;
              }
          }
      }catch(error){
          console.log(error)
        }
    },
    
  },
  mounted() {
    this.changeProgram();
  },
  created(){
      this.Client = {
          lead_name:this.detailsClient.lead_name,
          program :JSON.parse(this.detailsClient.accounts)[0].program,
          ...this.detailsClient
      }
      this.searchPrograms(this.detailsClient.lead_id)
      this.usersAllPrograms()
  }
};

</script>
