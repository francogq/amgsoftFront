<template>
  <b-modal
    id="modal-closing"
    ref="modal"
    v-model="onControl"
    size="lg"
    title="Create Answer"
    modal-class="modal-primary"
    title-tag="h3"
    @hidden="close"
  >
    <div class="d-block">
      <validation-observer ref="vform">
        <b-container>
          <b-form-row>
            <b-col>
              <validation-provider
                v-slot="{ errors }"
                name="program"
                rules="required"
              >
                <b-row class="mt-2">
                  <b-col sm="2" class="p-0">
                    <div class="d-flex align-items-center pl-1 prepend"
                         style="height: 80%;"
                    ><span>PROGRAM:</span></div>
                  </b-col>
                  <template v-if="!dataLoaded">
                    <b-col  v-for="cont in conts" :key="cont" sm="2" class="mobile">
                      <b-form-radio>
                        <b-skeleton-img rounded  animation="wave" no-aspect width="40px" height="40px"></b-skeleton-img>
                      </b-form-radio>
                    </b-col>
                  </template>
                  <template v-else>
                    <b-col v-for="program in programs" :key="program.id" sm="2" class="mobile">
                        <b-form-radio
                            v-model="selectedProgram"
                            unchecked-value="not_accepted"
                            name="checkbox-2"
                            :value="program.id"
                            :disabled="fromTree"
                        >
                          <b-img
                            :src="baseUrl + program.logo"
                            class="img-fan-page"
                            :alt="'Logo of the program '+program.value"
                            fluid
                            thumbnail
                        />
                        </b-form-radio>
                    </b-col>
                  </template>
                  <span v-if="errors[0] && secondTime" class="text-danger">
                    Program {{ errors[0] }}</span
                  >
                </b-row>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="title"
                rules="required"
              >
                <b-row class="mt-2">
                  <b-col sm="2" class="p-0">
                    <div class="d-flex align-items-center pl-1 prepend"
                         style="height: 100%;"
                    >TYPE:</div>
                  </b-col>
                  <b-col sm="2" style="height: 32px" class="d-flex align-items-center">
                    <b-form-radio
                      v-model="selectedType"
                      name="checkbox-1"
                      value="1"
                      unchecked-value="not_accepted"
                      >Client
                    </b-form-radio>
                  </b-col>
                  <b-col sm="2" style="height: 32px" class="d-flex align-items-center">
                    <b-form-radio
                      v-model="selectedType"
                      name="checkbox-1"
                      value="2"
                      unchecked-value="not_accepted"
                      >Team
                    </b-form-radio>
                  </b-col>
                  <span v-if="errors[0]" class="text-danger">
                    Type {{ errors[0] }}</span
                  >
                </b-row>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="option"
                rules="required"
              >
                <b-row class="mt-2">
                  <b-col sm="2" class="p-0">
                    <div class="d-flex align-items-center pl-1 prepend"
                         style="height: 32px;"
                    >OPTION: </div>
                  </b-col>
                  <b-col sm="10">
                    <b-form-textarea id="textarea-default" v-model="option" />
                  </b-col>
                  <span v-if="errors[0]" class="text-danger">
                    Option {{ errors[0] }}</span
                  >
                </b-row>
              </validation-provider>

              <b-row v-if="selectedProgram" class="mt-2">
                <b-col v-if="!fromTree">
                  <b-form-checkbox
                    v-model="selectedSubOption"
                    value="checked"
                    unchecked-value="notchecked"
                  >
                    Is sub option?
                  </b-form-checkbox>
                  <span v-if="answers.length==0" class="text-primary">There are no sub options to show</span>
                  <template v-if="showAnswersTree && answers.length!==0">
                    <validation-provider
                      v-slot="{ errors }"
                      name="suboption"
                      rules="required"
                    >
                      <div
                        v-for="answer in answers"
                        :key="answer.id"
                        :value="answer.id"
                        class="mar-top"
                      >
                        <b-form-radio
                          :id="answer.id"
                          v-model="father"
                          :value="answer.id"
                          unchecked-value="not_accepted"
                          :style="`margin-left: ${
                            answer.type === 1 ? 0 : 10 * answer.type
                          }px;`"
                        >
                          <label :for="answer.id">{{
                            answer.content.length > 20
                              ? answer.content.substr(0, 20) + "..."
                              : answer.content
                          }}</label>
                          <feather-icon
                            v-if="answer.ans_open && answer.count_father"
                            class="pointer mar-icon"
                            icon="ChevronRightIcon"
                            @click="
                              getChildData(answer.program, answer.id, answer)
                            "
                          />
                          <feather-icon
                            v-if="!answer.ans_open && answer.count_father"
                            class="pointer mar-icon"
                            icon="ChevronDownIcon"
                            @click="
                              deleteChildData(
                                answer.grandpa,
                                answer.id,
                                answer.type
                              )
                            "
                          />
                        </b-form-radio>
                      </div>
                      <span v-if="errors[0]" class="text-danger">
                        Sub Option {{ errors[0] }}</span
                      >
                    </validation-provider>
                  </template>
                </b-col>
                <b-col v-else>Parent: {{ itemTree.content }}</b-col>
              </b-row>
            </b-col>
          </b-form-row>
        </b-container>
      </validation-observer>
    </div>
    <template #modal-footer="{ cancel }">
      <button-cancel @click="cancel()"></button-cancel>
      <button-save @click="saveUpdateAnswer"></button-save>
    </template>
  </b-modal>
</template>

<script>
import AnswersGuideService from "@/views/social-network/views/answers-guide/answers-guide.service";
import { mapGetters } from "vuex";
import buttonSave from "@/views/commons/utilities/ButtonSave";
import buttonCancel from "@/views/commons/utilities/ButtonCancel";

export default {
  components: {
    buttonSave,
    buttonCancel,
  },
  props: {
    itemTree: null,
  },
  data() {
    return {
      onControl: false,
      programs: {},
      selectedProgram: "",
      selectedType: "",
      option: "",
      programIsSelected: false,
      selectedSubOption: "notchecked",
      father: null,
      answers: {},
      showAnswersTree: false,
      fromTree: false,
      dataLoaded: false,
      conts: 5,
      secondTime: false
    };
  },
  async created() {
    this.onControl = true;
    this.dataLoaded = false
    await this.getFanPages();
    this.dataLoaded = true
    if (this.itemTree) {
      this.fromTree = true;
      this.selectedProgram = this.itemTree.program;
      this.father = this.itemTree.id;
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getFanPages() {
      const data = await AnswersGuideService.getFanPages();
      this.programs = data;
    },
    async getAnswerGuide(program, father) {
      const data = await AnswersGuideService.getAnswersGuide({
        father,
        program,
      });
      return data;
    },
    async getChildData(program, father, answer) {
      const response = await AnswersGuideService.getAnswersGuide({
        father,
        program,
      });
      const index = this.answers.map((e) => e.id).indexOf(father);
      response.map((e) => (e.content = `${e.content}`));
      this.answers.splice(index + 1, 0, ...response);
      answer.ans_open = false;
    },
    deleteChildData(grandpa, id, type) {
      // eslint-disable-next-line array-callback-return,consistent-return
      this.answers = this.answers.filter((value) => {
        if (!(value.grandpa == grandpa && value.type > type)) {
          return true;
        }
      })
      this.answers = this.answers.filter((e) => e.grandpa != id);
      // eslint-disable-next-line camelcase
      const index_father = this.answers.map((e) => e.id).indexOf(id);
      this.answers[index_father].ans_open = true;
    },
    async saveUpdateAnswer() {
      this.secondTime = true
      try {
        const result = await this.$refs.vform.validate();
        if (result) {
          const response = await this.showConfirmSwal();
          if (this.itemTree) {
            this.father = this.itemTree.id;
          }
          if (response.isConfirmed) {
            const data = await AnswersGuideService.saveAnswerGuide({
              id: null,
              program: this.selectedProgram,
              content: this.option,
              user: this.currentUser.user_id,
              father: this.father,
              type: this.selectedType,
            });

            if (data.status === 200) {
              if (this.itemTree) {
                this.$emit("reloadTree");
              } else {
                if (this.selectedProgram === this.$route.meta.program) {
                  this.$store.dispatch(
                    "SocialNetworkAnswerGuide/A_GET_ANSWERS",
                    { father: null, program: this.selectedProgram }
                  );
                } else {
                  this.$emit("reloadTable", this.selectedProgram);
                }
              }
              this.showSuccessSwal("Answer has been added successfully");
              this.close();
            }
          }
        }
      } catch (e) {
        this.showErrorSwal(e);
        return [];
      }
    },
  },
  watch: {
    selectedProgram(newVal) {
      if (newVal) {
        if (this.selectedSubOption === 'checked') {
          this.father = null
          this.getAnswerGuide(this.selectedProgram, this.father).then((res) => {
            this.answers = res
          })
        }
        if (this.type !== 4) {
          this.father = ""
        }
        this.secondTime = true
      } else {
        if (this.type !== 4) {
          this.father = ""
        }
      }
    },
    selectedSubOption(newVal) {
      if (newVal === "checked") {
        this.father = null
        this.getAnswerGuide(this.selectedProgram, this.father).then((res) => {
          this.answers = res;
        })

        this.showAnswersTree = true
        if (this.type !== 4) {
          this.father = ""
        }
      } else {
        this.answers = [];
        this.showAnswersTree = false;
        if (this.type !== 4) {
          this.father = "";
        }
      }
    },
    dataLoaded(newVal){
      if(newVal){
      }
    },
  },
};
</script>

<style scoped>
.img-fan-page {
  height: 40px;
}
.pointer {
  cursor: pointer;
}
.mar-top {
  margin-top: 0.5em;
}
.prepend{
  background-color: #0090E7;
  border-radius: 5px 0 0 5px;
  color: white
}
.mar-icon{
  margin-left: 0.4rem;
}
@media (max-width: 768px){
  .prepend{
    background-color: #0090E7;
    border-radius: 5px 0 0 5px;
    color: white;
    font-size: 0.8em;
    height: 25px !important;
  }
  .img-fan-page {
    height: 40px;
    width: 40px;
  }
  .mobile{
    margin-top: 0.5rem;
  }
}
/*@media (max-width: 768px){*/
/*  .img-fan-page {*/
/*    height: 50px;*/
/*    width: 50px;*/
/*  }*/
/*  .mobile{*/
/*    margin-left: 0.2rem !important;*/
/*    padding-right: 0 !important;*/
/*  }*/
/*  .flex{*/
/*    display: flex;*/
/*  }*/
/*}*/
</style>
