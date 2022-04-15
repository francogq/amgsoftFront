<template>
  <div>
    <ValidationObserver ref="accounts">
      <b-card no-body class="mb-1">
        <div class="p-2">
          <b-row>
            <b-col cols="6">
              <b-button class="btn btn-danger" @click="returnGrid">
                <feather-icon icon="ChevronsLeftIcon"></feather-icon>Return
              </b-button>
              <span
                class="font-weight-bold ml-2 d-inline"
                :class="process != 1 ? 'red-text-2' : 'text-success'"
              >
                {{
                process != 1 ? "UNPROCESSED" : "PROCESSED BY: " + processInfo
                }}
              </span>
            </b-col>
            <b-col cols="6" class="text-right">
              <h4 class="font-weight-bold">Provider : {{ nameProvider }}</h4>
            </b-col>
          </b-row>
        </div>
      </b-card>
      <b-card no-body class="mb-1">
        <div class="pb-1">
          <table class="table table-bordered table-responsive">
            <tr :class="classAdd">
              <th colspan="4">
                <span>Personal Profile</span>
              </th>
            </tr>
            <tr>
              <th class="td-left text-right"></th>
              <th class="font-weight-bold col-3 text-center">
                <span>Trans</span>
                <span style="color: #4d917a">Union</span>
              </th>
              <th class="font-weight-bold col-3 text-center">
                <span>Experian</span>
              </th>
              <th class="font-weight-bold col-3 text-center">
                <span>EQUIFAX</span>
              </th>
            </tr>
            <tr>
              <td class="td-left col-2 text-right">
                <span>Score</span>
                <b-button
                  class="rounded ml-2"
                  :title="!editScore ? 'Edit Score' : 'Save Score'"
                  :variant="!editScore ? 'info' : 'success'"
                  v-if="isForSpecialist"
                  size="sm"
                  @click="editScore = !editScore"
                >
                  <i :class="'fas ' + (!editScore ? 'fa-edit' : 'fa-save')"></i>
                  {{ !editScore ? "Edit" : "Save" }}
                </b-button>
              </td>
              <template class="td-center td-bold text-center" v-for="score in datos.score">
                <td class="td-center td-bold text-center" :key="score.id">
                  <span v-if="!editScore">{{ score.score }}</span>
                  <b-input
                    v-else
                    class="form-control"
                    type="text"
                    v-model="score.score"
                    v-mask="'###'"
                  ></b-input>
                </td>
              </template>
            </tr>
            <tr>
              <td class="td-left text-right">Credit Report Date</td>
              <td class="td-center text-center">
                <span>{{ datos.date }}</span>
              </td>
              <td class="td-center text-center">
                <span>{{ datos.date }}</span>
              </td>
              <td class="td-center text-center">
                <span>{{ datos.date }}</span>
              </td>
            </tr>
            <tr v-for="LineIndex in 3" :key="LineIndex">
              <td class="td-left text-right">
                {{
                LineIndex == 1
                ? "Name:"
                : LineIndex == 2
                ? "Date of Birth:"
                : "Address(es):"
                }}
                <b-button
                  class="btn btn-secondary"
                  size="sm"
                  @click="modalPersonalInfo(LineIndex)"
                  v-if="LineIndex != 2 && isForSpecialist"
                >
                  <feather-icon icon="MoveIcon"></feather-icon>
                </b-button>
                <div
                  v-if="
                    isForRound &&
                    personal_info.filter(
                      (x) => x.type == LineIndex && x.to_select
                    ).length > 0
                  "
                  class="text-left"
                >
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD REASON" label-for="input-3">
                      <select
                        class="form-control"
                        v-model="setPersonal[LineIndex - 1].reason"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="reason in reasons"
                          :key="reason.id"
                          :value="reason.id"
                        >{{ reason.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD INSTRUCTION" label-for="input-3">
                      <select
                        v-model="setPersonal[LineIndex - 1].instruction"
                        class="form-control"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="instruction in instructions"
                          :key="instruction.id"
                          :value="instruction.id"
                        >{{ instruction.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                </div>
              </td>
              <td class="td-center text-center" v-for="rowsIndex in 3" :key="rowsIndex">
                <ul class="list-unstyled">
                  <template v-for="(name, index) in personal_info">
                    <li
                      :key="index"
                      v-if="
                        name.type == LineIndex && name.bureau_id == rowsIndex
                      "
                      class="text-center"
                    >
                      <b-form-checkbox
                        v-model="name.to_select"
                        v-if="isForRound && name.status != 1"
                      >{{ name.content }}</b-form-checkbox>
                      <div v-else class="mb-2">
                        <div v-if="!name.for_edit">
                          <feather-icon size="17" icon="CheckIcon" v-if="name.check"></feather-icon>
                          <span
                            class="text-blue-underline"
                            :class="
                              name.status == 1 ? 'text-orange-wounder' : ''
                            "
                            @click="displayCheckArray(name)"
                            v-if="!name.for_edit"
                          >{{ name.content }}</span>
                          <b-button
                            v-if="isForSpecialist"
                            class="ml-2 rounded-circle"
                            variant="primary"
                            size="sm"
                            @click="name.for_edit = !name.for_edit"
                          >
                            <feather-icon icon="EditIcon"></feather-icon>
                          </b-button>
                        </div>

                        <div v-if="name.for_edit && isForSpecialist" class="row mx-0">
                          <div class="col-md-9">
                            <b-form-input v-model="name.content"></b-form-input>
                          </div>
                          <div class="col-md-3 justify-content-center align-items-center">
                            <b-button
                              class="rounded-circle btn btn-success"
                              size="sm"
                              @click="name.for_edit = !name.for_edit"
                            >
                              <feather-icon size="17" icon="CheckIcon"></feather-icon>
                            </b-button>
                          </div>
                        </div>
                      </div>

                      <div v-if="name.to_select">
                        <ValidationProvider rules="required" v-slot="{ errors }">
                          <ul
                            class="list-group list-group-horizontal center my-3"
                            :class="{ 'border border-danger': errors[0] }"
                          >
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="1"
                                v-model="name.type_of_disput"
                                :unchecked-value="null"
                              >PHONE</b-form-checkbox>
                            </li>
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="2"
                                v-model="name.type_of_disput"
                                :unchecked-value="null"
                              >ONLINE</b-form-checkbox>
                            </li>
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="3"
                                v-model="name.type_of_disput"
                                :unchecked-value="null"
                              >LETTER</b-form-checkbox>
                            </li>
                          </ul>
                        </ValidationProvider>
                      </div>
                    </li>
                  </template>
                </ul>
              </td>
            </tr>
            <!-- Line of Employers -->
            <tr>
              <td class="td-left text-right">Employers:</td>
              <td class="td-center text-center" v-for="rowsIndex in 3" :key="rowsIndex">
                <ul class="list-unstyled">
                  <template v-for="(name, index) in personal_info">
                    <li :key="index" v-if="name.type == 4 && name.bureau_id == rowsIndex">
                      <span>{{ name.content }}</span>
                    </li>
                  </template>
                </ul>
              </td>
            </tr>
          </table>
        </div>
      </b-card>
      <b-card no-body class="mb-1">
        <!-- Table Credit Summary -->
        <div class="pb-1">
          <table class="table table-bordered table-responsive">
            <tr :class="classAdd">
              <th colspan="4">Credit Summary</th>
            </tr>
            <tr>
              <th class="td-left text-right"></th>
              <th class="font-weight-bold col-3 text-center">
                <span>Trans</span>
                <span style="color: #4d917a">Union</span>
              </th>
              <th class="font-weight-bold col-3 text-center">Experian</th>
              <th class="font-weight-bold col-3 text-center">EQUIFAX</th>
            </tr>
            <tr v-if="datos.sumary">
              <td class="td-left text-right col-2">Total Accounts:</td>
              <td class="td-center text-center">{{ datos.sumary[0].t_account }}</td>
              <td class="td-center text-center">{{ datos.sumary[1].t_account }}</td>
              <td class="td-center text-center">{{ datos.sumary[2].t_account }}</td>
            </tr>
            <tr v-if="datos.sumary">
              <td class="td-left text-right">Open Accounts:</td>
              <td class="td-center text-center">{{ datos.sumary[0].o_account }}</td>
              <td class="td-center text-center">{{ datos.sumary[1].o_account }}</td>
              <td class="td-center text-center">{{ datos.sumary[2].o_account }}</td>
            </tr>
            <tr v-if="datos.sumary">
              <td class="td-left text-right">losed Accounts:</td>
              <td class="td-center text-center">{{ datos.sumary[0].c_account }}</td>
              <td class="td-center text-center">{{ datos.sumary[1].c_account }}</td>
              <td class="td-center text-center">{{ datos.sumary[2].c_account }}</td>
            </tr>
            <tr v-if="datos.sumary">
              <td class="td-left td-left text-right">Balances:</td>
              <td class="td-center" align="center">
                {{
                val != 2
                ? "$ " + datos.sumary[0].balance
                : datos.sumary[0].balance
                }}
              </td>
              <td class="td-center" align="center">
                {{
                val != 2
                ? "$ " + datos.sumary[1].balance
                : datos.sumary[1].balance
                }}
              </td>
              <td class="td-center" align="center">
                {{
                val != 2
                ? "$ " + datos.sumary[2].balance
                : datos.sumary[2].balance
                }}
              </td>
            </tr>
            <tr v-if="datos.sumary">
              <td class="td-left td-left text-right">Payments:</td>
              <td class="td-center" align="center">
                {{
                val != 2
                ? "$ " + datos.sumary[0].payments
                : datos.sumary[0].payments
                }}
              </td>
              <td class="td-center" align="center">
                {{
                val != 2
                ? "$ " + datos.sumary[1].payments
                : datos.sumary[1].payments
                }}
              </td>
              <td class="td-center" align="center">
                {{
                val != 2
                ? "$ " + datos.sumary[2].payments
                : datos.sumary[2].payments
                }}
              </td>
            </tr>
          </table>
        </div>
      </b-card>

      <!-- Table Credit Inquiries -->
      <b-card no-body class="mb-1">
        <div class="pb-1">
          <div>
            <b-row v-if="isForSpecialist">
              <b-col cols="4">
                <b-button
                  variant="success"
                  class="rounded mt-2 ml-1 mb-1"
                  @click="addInquires()"
                >Add Inquires</b-button>
              </b-col>
              <b-col cols="6" class="text-center" v-if="isForRound">
                <b-button
                  variant="info"
                  class="rounded mt-2 ml-1 mb-1"
                  :disabled="!btnRound"
                  @click="openModalRound()"
                >ADD NEW ROUND</b-button>
              </b-col>
            </b-row>
          </div>
          <table class="table table-bordered table-responsive">
            <tr :class="classAdd">
              <th colspan="4">
                <span>Credit Inquiries</span>
                <b-button
                  class="rounded ml-2"
                  :title="!editInquire ? 'Edit Inquires' : 'Save Inquires'"
                  :variant="!editInquire ? 'info' : 'success'"
                  size="sm"
                  v-if="isForSpecialist"
                  @click="editInquire = !editInquire"
                >
                  <i :class="'fas ' + (!editInquire ? 'fa-edit' : 'fa-save')"></i>
                  {{ !editInquire ? "Edit" : "Save" }}
                </b-button>
              </th>
            </tr>
            <tr>
              <th class="td-left text-right col-2"></th>
              <th class="font-weight-bold col-3 text-center">
                <span>Trans</span>
                <span style="color: #4d917a">Union</span>
              </th>
              <th class="font-weight-bold col-3 text-center">
                <span>Experian</span>
              </th>
              <th class="font-weight-bold col-3 text-center">
                <span>EQUIFAX</span>
              </th>
            </tr>
            <tr v-for="(item, inquireIndex) in inquires" :key="inquireIndex">
              <td class="td-left text-right">
                <div v-if="!item.for_edit">
                  <div>{{ item.content }}</div>
                  <div>{{ item.date_show }}</div>
                  <div>{{ item.sub_content }}</div>
                  <b-button
                    variant="info"
                    size="sm"
                    class="rounded"
                    @click="item.for_edit = !item.for_edit"
                    v-if="isForSpecialist"
                  >
                    <i class="fas fa-edit mr-2"></i> Edit
                  </b-button>
                </div>
                <div v-else>
                  <b-form-input v-model="item.content"></b-form-input>
                  <b-form-input type="date" v-model="item.date_show"></b-form-input>
                  <b-form-input v-model="item.sub_content"></b-form-input>
                  <b-button
                    variant="success"
                    size="sm"
                    @click="item.for_edit = !item.for_edit"
                    class="rounded"
                  >
                    <i class="fas fa-save mr-2"></i> Save
                  </b-button>
                </div>
              </td>
              <template v-for="rowsIndex in 3">
                <td class="td-left text-right" style="position: relative" :key="rowsIndex">
                  <b-form-checkbox
                    :id="'checkbox-' + inquireIndex + rowsIndex"
                    v-model="item.bureau_id"
                    :value="rowsIndex"
                    size="lg"
                    v-if="editInquire"
                  ></b-form-checkbox>
                  <b-form-checkbox
                    :id="'checkbox-' + inquireIndex + rowsIndex"
                    v-model="item.to_select"
                    :value="rowsIndex"
                    size="lg"
                    v-if="
                      isForRound &&
                      item.status != 1 &&
                      item.bureau_id == rowsIndex
                    "
                  ></b-form-checkbox>
                  <feather-icon
                    class="text-center"
                    :class="
                      item.status == 1 ? 'text-check-orange' : 'text-check-red'
                    "
                    size="26"
                    v-if="item.bureau_id == rowsIndex"
                    icon="CheckIcon"
                  ></feather-icon>
                </td>
              </template>
            </tr>
            <tr>
              <td class="td-left text-left">
                <div
                  v-if="
                    isForRound &&
                    inquires.filter((item) => item.to_select).length > 0
                  "
                >
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD REASON" label-for="input-3">
                      <select
                        class="form-control"
                        v-model="setInquires.reason"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="reason in reasons"
                          :key="reason.id"
                          :value="reason.id"
                        >{{ reason.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD INSTRUCTION" label-for="input-3">
                      <select
                        v-model="setInquires.instruction"
                        class="form-control"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="instruction in instructions"
                          :key="instruction.id"
                          :value="instruction.id"
                        >{{ instruction.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                </div>
              </td>
              <td class="td-left text-right" v-for="rowIndex in 3" :key="rowIndex">
                <div
                  v-if="
                    isForRound &&
                    inquires.filter(
                      (item) => item.to_select && item.bureau_id == rowIndex
                    ).length > 0
                  "
                >
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <ul
                      class="list-group list-group-horizontal center my-3"
                      :class="{ 'border border-danger': errors[0] }"
                    >
                      <li class="list-group-item">
                        <b-form-checkbox
                          value="1"
                          v-model="
                            setDisputeInquire[rowIndex - 1].type_of_disput
                          "
                          :unchecked-value="null"
                        >PHONE</b-form-checkbox>
                      </li>
                      <li class="list-group-item">
                        <b-form-checkbox
                          value="2"
                          v-model="
                            setDisputeInquire[rowIndex - 1].type_of_disput
                          "
                          :unchecked-value="null"
                        >ONLINE</b-form-checkbox>
                      </li>
                      <li class="list-group-item">
                        <b-form-checkbox
                          value="3"
                          v-model="
                            setDisputeInquire[rowIndex - 1].type_of_disput
                          "
                          :unchecked-value="null"
                        >LETTER</b-form-checkbox>
                      </li>
                    </ul>
                  </ValidationProvider>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </b-card>

      <!-- Table Public Information -->
      <b-card no-body class="mb-1">
        <div class="pb-1">
          <b-row v-if="isForSpecialist">
            <b-col cols="4">
              <b-button variant="success" class="rounded mt-2 ml-1 mb-1" @click="addPublicRecord()">
                <i class="fas fa-plus"></i> Add Record
              </b-button>
              <b-button variant="danger" class="rounded mt-2 ml-1 mb-1" @click="removeAllRecord()">
                <i class="fas fa-trash"></i> Delete All Record
              </b-button>
            </b-col>
            <b-col cols="6"></b-col>
          </b-row>

          <table class="table table-bordered table-responsive">
            <tr :class="classAdd">
              <th colspan="4">Public Information</th>
            </tr>
            <tr>
              <th class="td-left text-right col-2"></th>
              <th class="font-weight-bold col-3 text-center">
                <span>Trans</span>
                <span style="color: #4d917a">Union</span>
              </th>
              <th class="font-weight-bold col-3 text-center">Experian</th>
              <th class="font-weight-bold col-3 text-center">EQUIFAX</th>
            </tr>
            <template v-for="(item, publicIndex) in public_info">
              <tr class="bg-dark" :key="publicIndex">
                <th class="td-left text-right col-2">
                  <div>
                    <b-button-group>
                      <b-button
                        variant="danger"
                        class="rounded"
                        v-if="isForSpecialist"
                        style="margin: 2px 2px"
                        @click="removeRecord(publicIndex)"
                      >
                        <i class="fas fa-trash"></i> Remove Record
                      </b-button>
                    </b-button-group>
                  </div>
                </th>
                <template v-for="t in 3">
                  <th
                    class="font-weight-bold col-3 text-center"
                    :key="t - 1"
                    :class="
                      item.element[t - 1].status == 1 ? 'bg-warning' : 'bg-dark'
                    "
                  >
                    <template v-if="isForSpecialist">
                      <b-button
                        v-if="!item.element[t - 1].edit"
                        @click="
                          (item.element[t - 1].edit =
                            !item.element[t - 1].edit),
                            editRecord(1, t - 1, publicIndex)
                        "
                        variant="info"
                        class="rounded"
                      >
                        <i class="fas fa-edit"></i> Edit
                      </b-button>
                      <div v-else>
                        <b-button
                          variant="danger"
                          class="rounded"
                          @click="
                            (item.element[t - 1].edit =
                              !item.element[t - 1].edit),
                              editRecord(0, t - 1, publicIndex)
                          "
                        >
                          <i class="fas fa-times-circle"></i> Cancel
                        </b-button>
                        <b-button
                          @click="
                            item.element[t - 1].edit = !item.element[t - 1].edit
                          "
                          variant="success"
                          class="rounded"
                        >
                          <i class="fas fa-check"></i> Save
                        </b-button>
                      </div>
                    </template>
                    <template v-if="isForRound">
                      <b-form-checkbox
                        v-model="item.element[t - 1].to_select"
                        v-if="
                          item.element[t - 1].status != 1 &&
                          item.element[t - 1].content != null &&
                          item.element[t - 1].court != null
                        "
                        :style="
                          !item.element[t - 1].edit
                            ? 'margin-top: 9px;'
                            : 'margin-top: -24px;'
                        "
                        style="float: right"
                        @change="toSelected(item, [t - 1])"
                      >TO SELECT</b-form-checkbox>
                      <span
                        v-else-if="item.element[t - 1].status == 1"
                        class="font-weight-bold"
                      >IN DISPUTE</span>
                    </template>
                  </th>
                </template>
              </tr>
              <tr v-for="(header, indexHeader) in headerPublics" :key="indexHeader + publicIndex">
                <td
                  class="td-left text-left"
                  v-if="
                    header.key == 'round' &&
                    item.element.filter((item) => item.to_select).length > 0
                  "
                >
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD REASON" label-for="input-3">
                      <select
                        class="form-control"
                        v-model="setPublicRecord.reason[publicIndex]"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="reason in reasons"
                          :key="reason.id"
                          :value="reason.id"
                        >{{ reason.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD INSTRUCTION" label-for="input-3">
                      <select
                        v-model="setPublicRecord.instruction[publicIndex]"
                        class="form-control"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="instruction in instructions"
                          :key="instruction.id"
                          :value="instruction.id"
                        >{{ instruction.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                </td>
                <td class="td-left text-right" v-else>{{ header.label }}</td>
                <template v-for="(value, indexItem) in item.element">
                  <template v-for="(valueItem, key, indexValue) in value">
                    <td
                      :key="indexValue + indexItem"
                      v-if="header.key == key"
                      class="td-center text-center"
                      :class="
                        value.content != '' && header.key != 'round'
                          ? 'bg-light-red'
                          : ''
                      "
                    >
                      <input
                        v-if="value.edit"
                        :type="header.key == 'date' ? 'date' : 'text'"
                        class="input-form w-75"
                        v-model="value[key]"
                        :disabled="disableModule"
                      />
                      <span v-else>{{ valueItem }}</span>
                      <div v-if="header.key == 'round' && value.to_select">
                        <ValidationProvider rules="required" v-slot="{ errors }">
                          <ul
                            class="list-group list-group-horizontal center my-3"
                            :class="{ 'border border-danger': errors[0] }"
                          >
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="1"
                                v-model="value.type_of_disput"
                                :unchecked-value="null"
                              >PHONE</b-form-checkbox>
                            </li>
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="2"
                                v-model="value.type_of_disput"
                                :unchecked-value="null"
                              >ONLINE</b-form-checkbox>
                            </li>
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="3"
                                v-model="value.type_of_disput"
                                :unchecked-value="null"
                              >LETTER</b-form-checkbox>
                            </li>
                          </ul>
                        </ValidationProvider>
                      </div>
                    </td>
                  </template>
                </template>
              </tr>
            </template>
          </table>
        </div>
      </b-card>

      <!-- Table Accounts -->
      <b-card no-body class="mb-1">
        <div class="pb-1">
          <div>
            <b-row v-if="isForSpecialist">
              <b-col cols="4">
                <b-button
                  variant="success"
                  class="rounded mt-2 ml-1 mb-1"
                  @click="addAccount()"
                >Add Account</b-button>
                <b-button
                  variant="danger"
                  class="rounded mt-2 ml-1 mb-1"
                  @click="removeAllAccount()"
                >Delete All Accounts</b-button>
              </b-col>
              <b-col cols="6" class="text-center" v-if="isForRound">
                <b-button
                  variant="info"
                  class="rounded mt-2 ml-1 mb-1"
                  :disabled="!btnRound"
                  @click="openModalRound()"
                >Add New Round</b-button>
              </b-col>
            </b-row>
          </div>
          <table class="table table-bordered table-responsive">
            <tr :class="classAdd">
              <th colspan="4">Account History</th>
            </tr>
            <tr>
              <th class="td-left text-right col-2"></th>
              <th class="font-weight-bold col-3 text-center">
                <span>Trans</span>
                <span style="color: #4d917a">Union</span>
              </th>
              <th class="font-weight-bold col-3 text-center">Experian</th>
              <th class="font-weight-bold col-3 text-center">EQUIFAX</th>
            </tr>

            <template v-for="(item, indexAccount) in accounts">
              <tr :class="skin == 'dark'? 'bg-dark' :'bg-light'" :key="item.id">
                <th class="td-left text-right col-2">
                  <div>
                    <b-button-group>
                      <b-button
                        variant="danger"
                        class="rounded"
                        v-if="isForSpecialist"
                        style="margin: 2px 2px"
                        @click="removeAccount(indexAccount)"
                      >
                        <i class="fas fa-trash"></i> Remove Account
                      </b-button>
                    </b-button-group>
                  </div>
                </th>
                <template v-for="t in 3">
                  <th
                    class="font-weight-bold col-3 text-center"
                    :key="t - 1"
                    :class="
                      item.element[t - 1].status == 1 ? 'bg-warning' : skin == 'dark'? 'bg-dark' :'bg-light'
                    "
                  >
                    <template v-if="isForSpecialist">
                      <b-button
                        v-if="!item.element[t - 1].edit"
                        @click="
                          (item.element[t - 1].edit =
                            !item.element[t - 1].edit),
                            editAccount(1, t - 1, indexAccount)
                        "
                        variant="info"
                        class="rounded"
                      >
                        <i class="fas fa-edit"></i> Edit
                      </b-button>
                      <div v-else>
                        <b-button
                          variant="danger"
                          class="rounded"
                          @click="
                            (item.element[t - 1].edit =
                              !item.element[t - 1].edit),
                              editAccount(0, t - 1, indexAccount)
                          "
                        >
                          <i class="fas fa-times-circle"></i> Cancel
                        </b-button>
                        <b-button
                          @click="
                            item.element[t - 1].edit = !item.element[t - 1].edit
                          "
                          variant="success"
                          class="rounded"
                        >
                          <i class="fas fa-check"></i> Save
                        </b-button>
                      </div>
                    </template>
                    <template v-if="isForRound">
                      <b-form-checkbox
                        v-model="item.element[t - 1].to_select"
                        v-if="
                          item.element[t - 1].status != 1 &&
                          isValidStatusNumber(item.element[t - 1])
                        "
                        :style="
                          !item.element[t - 1].edit
                            ? 'margin-top: 9px;'
                            : 'margin-top: -24px;'
                        "
                        style="float: right"
                        @change="toSelected(item, [t - 1])"
                      >TO SELECT</b-form-checkbox>
                      <span
                        v-else-if="item.element[t - 1].status == 1"
                        class="font-weight-bold"
                      >IN DISPUTE</span>
                    </template>
                  </th>
                </template>
              </tr>
              <tr
                v-for="(header, indexHeader) in headerAccounts"
                :key="header.key + indexAccount"
                :ref="
                  header.key != 'detail' &&
                  header.key != 'status' &&
                  header.key != 'round'
                    ? 'trAccounts' + indexAccount
                    : 'trAccounts' + 1000000000
                "
                :class="{
                  'd-none':
                    indexHeader > 3 &&
                    header.key != 'detail' &&
                    header.key != 'status' &&
                    header.key != 'round',
                }"
              >
                <td
                  class="td-left text-left"
                  v-if="
                    header.key == 'round' &&
                    item.element.filter((item) => item.to_select).length > 0
                  "
                >
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD REASON" label-for="input-3">
                      <select
                        class="form-control"
                        v-model="setAccounts.reason[indexAccount]"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="reason in reasons"
                          :key="reason.id"
                          :value="reason.id"
                          :reduce="val => val.id"
                        >{{ reason.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-group label="ADD INSTRUCTION" label-for="input-3">
                      <select
                        v-model="setAccounts.instruction[indexAccount]"
                        class="form-control"
                        :class="{ 'border border-danger': errors[0] }"
                      >
                        <option
                          v-for="instruction in instructions"
                          :key="instruction.id"
                          :value="instruction.id"
                        >{{ instruction.value }}</option>
                      </select>
                    </b-form-group>
                  </ValidationProvider>
                </td>
                <td
                  v-else
                  class="td-left text-right col-2"
                  :class="
                    header.key == 'status' ? 'bg-gray font-weight-bold' : ''
                  "
                >
                  <b-button
                    v-if="header.key == 'detail'"
                    variant="secondary"
                    class="rounded"
                    @click="toggleDetails(indexAccount)"
                  >
                    <span :ref="'btnAccounts' + indexAccount">
                      {{
                      header.label
                      }}
                    </span>
                    <i class="fas fa-arrow-circle-right"></i>
                  </b-button>
                  <span v-else>{{ header.label }}</span>
                </td>
                <template v-for="(value, indexItem) in item.element">
                  <template v-for="(valueItem, key, indexValue) in value">
                    <td
                      :key="indexValue + indexItem"
                      v-if="header.key == key"
                      class="col-3 text-center"
                      :class="`${value.status == 6 && value.isShow &&header.key != 'status' &&header.key != 'round'? 'bg-light-red': header.key == 'status'
                          ? 'bg-gray'
                          : ''} ${statusValue}`"
                    >
                      <v-select
                        v-if="
                          header.key == 'status' && value.a_number.length > 3
                        "
                        :disabled="disableModule || isForRound"
                        :options="status"
                        :reduce="(val) => val.id"
                        label="value"
                        v-model="value.status"
                      ></v-select>
                      <!-- <span v-if="header.key == 'status' && value.a_number.length > 3">Yp franco</span> -->
                      <span v-else-if="header.key != 'status' && !value.edit">
                        {{
                        valueItem
                        }}
                      </span>
                      <input
                        v-else-if="
                          header.key != 'status' &&
                          header.key != 'round' &&
                          value.edit
                        "
                        :type="header.key == 'date' ? 'date' : 'text'"
                        class="input-form w-75"
                        v-model="value[key]"
                        :disabled="disableModule"
                      />

                      <div v-if="header.key == 'round' && value.to_select">
                        <ValidationProvider rules="required" v-slot="{ errors }">
                          <ul
                            class="list-group list-group-horizontal center my-3"
                            :class="{ 'border border-danger': errors[0] }"
                          >
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="1"
                                v-model="value.type_of_disput"
                                :unchecked-value="null"
                              >PHONE</b-form-checkbox>
                            </li>
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="2"
                                v-model="value.type_of_disput"
                                :unchecked-value="null"
                              >ONLINE</b-form-checkbox>
                            </li>
                            <li class="list-group-item">
                              <b-form-checkbox
                                value="3"
                                v-model="value.type_of_disput"
                                :unchecked-value="null"
                              >LETTER</b-form-checkbox>
                            </li>
                          </ul>
                        </ValidationProvider>
                      </div>
                    </td>
                  </template>
                </template>
              </tr>
            </template>
          </table>
        </div>
      </b-card>
    </ValidationObserver>
    <b-row>
      <b-col cols="4" class="text-center offset-4" v-if="isForSpecialist">
        <b-button
          variant="success"
          class="rounded mt-2 mb-1"
          :disabled="disable.save"
          @click="processReport()"
        >PROCESS</b-button>
      </b-col>
      <b-col cols="6" class="text-center offset-3" v-if="isForRound">
        <b-button
          variant="info"
          class="rounded mt-2 ml-1 mb-1"
          @click="openModalRound()"
        >ADD NEW ROUND</b-button>
        <b-button
          variant="success"
          class="rounded mt-2 ml-1 mb-1"
          @click="completeRound()"
        >MARK AS COMPLETE</b-button>
      </b-col>
    </b-row>
    <br />
    <b-modal
      modal
      v-model="modalRound"
      no-close-on-backdrop
      size="lg"
      header-class="b-vue-modal-header"
      modal-class="top-modal"
      hide-footer
    >
      <template #modal-header="{ close }">
        <div class="text-center">
          <span style="font-size: 20px; font-weight: 900">ADD ROUND</span>
        </div>
        <i
          class="fas fa-times-circle text-white"
          style="color: #d0cdc5; font-size: 20px; cursor: pointer"
          @click="close"
        ></i>
      </template>
      <div>
        <ValidationObserver ref="form">
          <b-row class="m-0">
            <b-col md="12" xs="12">
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group class="mt-2">
                  <b-input-group>
                    <b-input-group-prepend class="w-35">
                      <b-input-group-text class="w-100 badge-name-group">
                        <span>SECURITY NUMBER</span>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-radio-group
                      v-model="round.secure_number"
                      class="form-control text-center"
                      :class="{ 'border border-danger': errors[0] }"
                    >
                      <b-form-radio
                        :value="secure_number.ssn"
                        v-if="secure_number.ssn"
                      >{{ "SSN: " + secure_number.ssn }}</b-form-radio>
                      <b-form-radio
                        :value="secure_number.itin"
                        v-if="secure_number.itin"
                      >{{ "ITIN: " + secure_number.itin }}</b-form-radio>
                      <b-form-radio
                        :value="secure_number.other"
                        v-if="secure_number.other"
                      >{{ "CPN: " + secure_number.other }}</b-form-radio>
                    </b-radio-group>
                  </b-input-group>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group class="mt-2">
                  <b-input-group>
                    <b-input-group-prepend class="w-35">
                      <b-input-group-text class="w-100 badge-name-group">
                        <span>TITLE</span>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <select
                      class="form-control"
                      v-model="round.title"
                      :class="{ 'border border-danger': errors[0] }"
                    >
                      <option :value="null" hidden>Select one</option>
                      <option
                        v-for="(item, index) in titles"
                        :key="index"
                        :value="item.id"
                      >{{ item.value }}</option>
                    </select>
                  </b-input-group>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group class="mt-2">
                  <b-input-group>
                    <b-input-group-prepend class="w-35">
                      <b-input-group-text class="w-100 badge-name-group">
                        <span>FORMAT</span>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <select
                      class="form-control"
                      v-model="round.format"
                      :class="{ 'border border-danger': errors[0] }"
                    >
                      <option :value="null" hidden>Select one</option>
                      <option
                        v-for="(item, index) in formats"
                        :key="index"
                        :value="item.id"
                      >{{ item.value }}</option>
                    </select>
                  </b-input-group>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                v-if="
                  this.rounds.filter((item) => item.type_of_disput == 3)
                    .length > 0
                "
              >
                <b-form-group class="mt-2">
                  <b-input-group>
                    <b-input-group-prepend class="w-35">
                      <b-input-group-text class="w-100 badge-name-group">
                        <span>TYPE</span>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <select
                      class="form-control"
                      v-model="round.type"
                      :class="{ 'border border-danger': errors[0] }"
                    >
                      <option :value="null" hidden>Select one</option>
                      <option value="1">REGULAR</option>
                      <option value="2">CERTIFIED</option>
                    </select>
                  </b-input-group>
                </b-form-group>
              </ValidationProvider>
              <b-form-group class="mt-2 text-center">
                <b-button variant="success" @click="processRound">
                  <span>PROCESS ROUND</span>
                </b-button>
              </b-form-group>
            </b-col>
          </b-row>
        </ValidationObserver>
      </div>
    </b-modal>
    <!-- Modal Info -->
    <b-modal
      modal
      v-model="modalInfo"
      size="md"
      header-class="b-vue-modal-header"
      modal-class="top-modal"
      hide-footer
    >
      <template #modal-header="{ close }">
        <div class="text-center">
          <span style="font-size: 20px; font-weight: 900">SELECT BUREAU</span>
        </div>
        <i
          class="fas fa-times-circle text-white"
          style="color: #d0cdc5; font-size: 20px; cursor: pointer"
          @click="close"
        ></i>
      </template>
      <div>
        <!-- three button -->
        <ul class="list-group list-group-horizontal center my-3">
          <li class="list-group-item" style="cursor: pointer">
            <img
              src="/images/logo-bureau/same/eq.png"
              style="height: 35px"
              @click="addPersonalInfo(1)"
            />
          </li>
          <li class="list-group-item" style="cursor: pointer">
            <img
              src="/images/logo-bureau/same/ex.png"
              style="height: 35px"
              @click="addPersonalInfo(2)"
            />
          </li>
          <li class="list-group-item" style="cursor: pointer">
            <img
              src="/images/logo-bureau/same/tu.png"
              style="height: 35px"
              @click="addPersonalInfo(3)"
            />
          </li>
        </ul>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { amgApi } from "@/service/axios";
import { mapGetters } from "vuex";
import moment from "moment";
import FeatherIcon from "@/@core/components/feather-icon/FeatherIcon.vue";
import vSelect from "vue-select";
export default {
  props: {
    // modul: Number,
    global: Object,
    idfile: [Number, String],
    idlead: [Number, String]
  },
  components: { FeatherIcon, vSelect },
  data() {
    return {
      modul: this.$route.meta.module,
      assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      datos: {},
      status: [],
      viewreport: false,
      rounds: [],
      val: "",
      process: "",
      data: [],
      personal_info: [],
      inquires: [],
      public_info: [],
      accounts: [],
      reasons: [],
      instructions: [],
      modalRound: false,
      disable: {
        save: false,
        color: "#f1f1f1"
      },
      round_id: "",
      secure_number: {
        ssn: null,
        itin: null,
        other: null
      },
      round: {
        title: null,
        format: null,
        type: null,
        secure_number: null
      },
      headerPublics: [
        {
          key: "content",
          label: "Type"
        },
        {
          key: "status_show",
          label: "Status"
        },
        {
          key: "date",
          label: "Date"
        },
        {
          key: "reference",
          label: "Reference"
        },
        {
          key: "closing",
          label: "Closing"
        },
        {
          key: "court",
          label: "Court"
        }
      ],
      headerAccounts: [
        {
          key: "content",
          label: "Account Name"
        },
        {
          key: "a_number",
          label: "Account #"
        },
        {
          key: "type",
          label: "Account Type"
        },
        {
          key: "a_status",
          label: "Account Status"
        },
        {
          key: "a_description",
          label: "Account Description"
        },
        {
          key: "monthly",
          label: "Monthly Payment"
        },
        {
          key: "date",
          label: "Date Opened"
        },
        {
          key: "balance",
          label: "Balance"
        },
        {
          key: "n_months",
          label: "No. of Months (terms)"
        },
        {
          key: "h_credit",
          label: "Highest Credit"
        },
        {
          key: "c_limit",
          label: "Credit Limit"
        },
        {
          key: "p_status",
          label: "Payment Status"
        },
        {
          key: "comments",
          label: "Comments"
        },
        {
          key: "lp_status",
          label: "Last Payment Status"
        },
        {
          key: "detail",
          label: "Show More Details"
        },
        {
          key: "status",
          label: "Status"
        }
      ],
      setInq: [
        {
          type_of_disput: null,
          reason: null,
          instruction: null,
          select: false
        },
        {
          type_of_disput: null,
          reason: null,
          instruction: null,
          select: false
        },
        {
          type_of_disput: null,
          reason: null,
          instruction: null,
          select: false
        }
      ],
      setPersonal: [
        {
          reason: null,
          instruction: null
        },
        {
          reason: null,
          instruction: null
        },
        {
          reason: null,
          instruction: null
        }
      ],
      setDisputeInquire: [
        {
          type_of_disput: null
        },
        {
          type_of_disput: null
        },
        {
          type_of_disput: null
        }
      ],
      setInquires: {
        reason: null,
        instruction: null
      },
      setAccounts: {
        reason: [],
        instruction: []
      },
      setPublicRecord: {
        reason: [],
        instruction: []
      },
      editScore: false,
      editInquire: false,
      oldAccounts: [],
      oldInfo: [],
      processed_by: "",
      processed_at: "",
      addRoundBtn: true,
      btnRound: false,
      method: null,
      titles: [],
      formats: [],
      roundPaginator: 0,
      day_processed: null,
      modalInfo: false,
      type_selected: null
    };
  },
  computed: {
    ...mapGetters({
      skin: "appConfig/skin" 
    }),
    classAdd() {
      return this.skin == "dark" ? "dark" : "light";
    },
    statusValue() {
      return this.skin == "dark" ? "text-primary" : "";
    },
    processInfo() {
      return this.processed_by + " - " + this.processed_at;
    },
    disableModule() {
      return this.modul == 11 ? false : true;
    },
    nameProvider() {
      return this.val == 1
        ? "IdentityIQ"
        : this.val == 3
        ? "PrivacyGuard"
        : this.val == 7
        ? "MyScoreIQ"
        : "MyFreeScoreNow";
    },
    isForSpecialist() {
      return this.process != 1 && this.modul == 11;
    },
    isForRound() {
      return (
        this.process == 1 &&
        this.modul == 11 &&
        this.day_processed > "2021-09-27"
      );
    }
  },
  created() {
    this.generateReport();
    this.getSelectsOptions();
    this.allStatus();
    this.alltitles();
    this.allFormats();
  },
  methods: {
    toggleDetails(index) {
      this.$refs[`trAccounts${index}`].map((item, index) => {
        if (index > 3 && index != 1000000000) {
          item.classList.toggle("d-none");
        }
      });
      let nameButton = this.$refs[`btnAccounts${index}`][0].innerText;
      this.$refs[`btnAccounts${index}`][0].innerText =
        nameButton.trim() == "Show More Details"
          ? "Hide Details"
          : "Show More Details";
    },

    getDataOfScore() {
      amgApi
        .post("/lead/get-credit-report-data", {
          score_id: this.idfile,
          account_id: this.global.idaccount
        })
        .then(res => {
          this.reloadHeaders();
          //Add Scores
          this.datos.score[0].score = res.data.scores[0].transunion;
          this.datos.score[1].score = res.data.scores[0].experian;
          this.datos.score[2].score = res.data.scores[0].equifax;
          //Charge Data Accounts
          for (let i = 0; i < res.data.accounts.length; i++) {
            this.addAccount();
          }
          res.data.accounts.map((item, i) => {
            item.map((element, j) => {
              let key = element.bureau_id - 1;
              this.accounts[i].element[key].a_description =
                element.a_description;
              this.accounts[i].element[key].a_number = element.a_number;
              this.accounts[i].element[key].a_status = element.a_status;
              this.accounts[i].element[key].balance = element.balance;
              this.accounts[i].element[key].bureau_id = element.bureau_id;
              this.accounts[i].element[key].c_limit = element.c_limit;
              this.accounts[i].element[key].comments = element.comments;
              this.accounts[i].element[key].content = element.content;
              this.accounts[i].element[key].date = element.date;
              this.accounts[i].element[key].id = element.id;
              this.accounts[i].element[key].lp_status = element.lp_status;
              this.accounts[i].element[key].monthly = element.monthly;
              this.accounts[i].element[key].n_months = element.n_months;
              this.accounts[i].element[key].p_status = element.p_status;
              this.accounts[i].element[key].type = element.type;
              this.accounts[i].element[key].status = element.status;
            });
          });
          //End Charge Data Accounts

          //Charge Data Inquires
          res.data.inquires.map((item, i) => {
            item.map((element, j) => {
              this.inquires.push({
                content: element.content,
                id: element.id,
                bureau_id: element.bureau_id,
                date_show: element.date_show,
                sub_content: element.sub_content,
                status: element.status,
                to_select: false,
                type_of_disput: null,
                reason: null,
                instruction: null,
                for_edit: false
              });
            });
          });
          //End Charge Data Inquires

          //Charge Data Personal Information
          res.data.personal.map((item, i) => {
            item.map((element, j) => {
              this.personal_info.push({
                id: element.id,
                type: element.type,
                content: element.content,
                status: element.status,
                bureau_id: element.bureau_id,
                check: element.status == 6 ? true : false,
                to_select: false,
                type_of_disput: null,
                reason: null,
                instruction: null,
                for_edit: false
              });
            });
          });
          //End Charge Data Personal Information

          //Charge Data Public Record
          for (let i = 0; i < res.data.public.length; i++) {
            this.addPublicRecord();
          }
          res.data.public.map((item, i) => {
            item.map((element, j) => {
              let key = element.bureau_id - 1;
              this.public_info[i].element[key].content = element.content;
              this.public_info[i].element[key].status = element.status;
              this.public_info[i].element[key].bureau_id = element.bureau_id;
              this.public_info[i].element[key].court = element.court;
              this.public_info[i].element[key].date = element.date;
              this.public_info[i].element[key].id = element.id;
              this.public_info[i].element[key].reference = element.reference;
              this.public_info[i].element[key].closing = element.closing;
              this.public_info[i].element[key].status_show =
                element.status_show;
              this.public_info[i].date = element.date;
              this.public_info[i].to_select = false;
            });
          });
          //End Charge Data Public Record
          this.round_id = res.data.round_id;
          btn.classList.remove("preloader-specialist");
        });
    },

    generateReport() {
      this.$store.commit("app/SET_LOADING", true);
      amgApi
        .post("/lead/credit-report/get-reports", {
          id: this.idfile
        })
        .then(response => {
          if (response.status == 200) {
            this.$store.commit("app/SET_LOADING", false);
            this.datos = response.data[0].cr;
            this.data = response.data[0].cra;
            this.val = response.data[0].plataform_id;
            this.process = response.data[0].process;
            this.processed_by = response.data[0].processed_by;
            this.processed_at = response.data[0].processed_at;
            this.day_processed = response.data[0].day_processed;
            this.viewreport = true;
            if (this.isForRound) {
              this.getDataOfScore();
            } else {
              this.validateArrayAccounts();
              this.buildArrayInquires();
              this.buildArrayPersonal();
              this.buildArrayPublic();
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.$store.commit("app/SET_LOADING", false);
        });
    },

    // build array personal info
    buildArrayInquires() {
      var inquires = this.data[0].inquires;
      var x = 1;
      inquires.map(item => {
        switch (this.val == 2 ? item[2] : item[3]) {
          case "TransUnion":
            x = 1;
            break;
          case "Experian":
            x = 2;
            break;
          case "Equifax":
            x = 3;
            break;
        }
        this.inquires.push({
          content: item[0],
          sub_content: item[1],
          status: 6,
          bureau_id: x,
          date: moment(this.val == 2 ? item[1] : item[2]).format("YYYY--MM-DD"),
          date_show: moment(this.val == 2 ? item[1] : item[2]).format(
            "MM/DD/YYYY"
          ),
          for_edit: false
        });
      });
    },

    // build array public info
    buildArrayPublic() {
      var publicr = this.data[0].public;
      publicr.map(item => {
        var date =
          item[0].date != ""
            ? item[0].date
            : item[1].date != ""
            ? item[1].date
            : item[2].date;
        var elements = [];
        item.map((value, index) => {
          elements.push({
            content: value.type == "" ? 0 : value.type,
            status: 6,
            bureau_id: index + 1,
            court: value.court,
            date: value.date,
            reference: value.reference,
            closing: value.closing,
            status_show: value.status,
            round: null,
            edit: false
          });
        });

        this.public_info.push({
          date: moment(date).format("YYYY--MM-DD"),
          element: elements
        });
        this.oldInfo = JSON.parse(JSON.stringify(this.public_info));
      });
    },

    // build array accounts
    buildArrayPersonal() {
      var personal = this.data[0].personal;
      var x = 1;
      for (var i = 0; i < personal.length; i++) {
        this.processMapData(personal[i].name, x, 1);
        this.processMapData(personal[i].bod, x, 2);
        this.processMapData(personal[i].address, x, 3);
        this.processMapData(personal[i].employer, x, 4);
        x++;
      }
    },

    processMapData(data, bureau_id, type) {
      if (typeof data == "object") {
        data.map(value => {
          if (value != "") {
            this.personal_info.push({
              type: type,
              content: value,
              status: 5,
              bureau_id: bureau_id,
              check: false,
              for_edit: false
            });
          }
        });
      } else {
        if (data != "") {
          this.personal_info.push({
            type: type,
            content: data,
            status: 5,
            bureau_id: bureau_id,
            check: false,
            for_edit: false
          });
        }
      }
    },

    // build array accounts
    validateArrayAccounts() {
      var accounts = this.data[0].account;
      var comment = /profit and loss writeoff|collection|charged off|redeemed|settled less than full balance|reaffirmation debt|repossesion|merchandise taken back|foreclosure|delinquency|delinquent|paid for less/;
      var status = [];
      var last = [];
      var lastMap = [];
      var waitStatus = 5;
      var StatusMap = [];
      accounts.map(item => {
        StatusMap = [];
        item.map(value => {
          if (value.a_name != "") {
            var partOne =
              [1, 2].includes(this.val) &&
              (value.p_status
                .toLowerCase()
                .match(/unknown|current|paid is agree|--|-/) == null ||
                ![0, "-", "--", "0"].includes(value.status30) ||
                ![0, "-", "--", "0"].includes(value.status60) ||
                ![0, "-", "--", "0"].includes(value.status90) ||
                (![0, "-", "--", "0"].includes(value.stateiq) &&
                  this.isValidStatusNumber(value)));

            var partTwo =
              [3, 7].includes(this.val) &&
              (value.a_type.toLowerCase().match(/collection|charged off/) !=
                null ||
                String(value.comments)
                  .toLowerCase()
                  .match(comment) != null ||
                String(value.p_status)
                  .toLowerCase()
                  .match(/charged off/) != null ||
                ![0, "-", "--", "0"].includes(value.status30) ||
                ![0, "-", "--", "0"].includes(value.status60) ||
                ![0, "-", "--", "0"].includes(value.status90) ||
                (![0, "-", "--", "0"].includes(value.stateiq) &&
                  this.isValidStatusNumber(value)));
            waitStatus = partOne || partTwo ? 6 : 5;
          }
          StatusMap.push(waitStatus);
        });

        item.map((value, index) => {
          if (StatusMap.includes(6)) {
            StatusMap[index] = this.isValidStatusNumber(value) ? 6 : 5;
          }
        });

        status.push(StatusMap);

        item.map(value => {
          if (value.a_name != "") {
            lastMap = ["-", "--"].includes(value.status30)
              ? 0
              : Number(value.status30) +
                (["-", "--"].includes(value.status60)
                  ? 0
                  : Number(value.status60)) +
                (["-", "--"].includes(value.status90)
                  ? 0
                  : Number(value.status90)) +
                (value.status120 == undefined ? 0 : Number(value.status120)) +
                (value.status150 == undefined ? 0 : Number(value.status150)) +
                (value.status180 == undefined ? 0 : Number(value.status180));
          }
        });
        last.push(lastMap);
      });
      this.buildArrayAccounts(status, last);
    },
    isValidStatusNumber(data) {
      return (
        (data.a_status.match(/-|--/) == null &&
          data.a_description.match(/-|--/) == null) ||
        data.a_number.length > 3
      );
    },
    buildArrayAccounts(status, last) {
      var account = this.data[0].account;
      var x = 1;

      account.map((item, indexAccount) => {
        const IsNumeric = num => /^-{0,1}\d*\.{0,1}\d+$/.test(num);
        var elements = [];
        var showAccount = false;
        item.map(value => {
          if (this.isValidStatusNumber(value)) {
            showAccount = true;
          }
        });
        if (showAccount) {
          item.map((value, index) => {
            var commentary = "";
            if (typeof value.comments == "object") {
              value.comments.map(comment => {
                commentary += comment + " ";
              });
            } else {
              commentary = value.comments;
            }
            elements.push({
              content: this.isValidStatusNumber(value) ? value.a_name : "-",
              a_number: value.a_number,
              balance: IsNumeric(String(value.balance).replace(/[$,]/g, ""))
                ? value.balance
                : 0,
              type: value.a_type,
              status: status[indexAccount][index],
              bureau_id: index + 1,
              p_status: value.p_status,
              c_limit: value.c_limit == "-" ? 0 : value.c_limit,
              monthly: value.monthly == "-" ? 0 : value.monthly,
              last_p:
                last[indexAccount][index] == undefined
                  ? 0
                  : last[indexAccount][index],
              a_status: value.a_status,
              a_description: value.a_description,
              date: value.date,
              n_months: value.n_months,
              h_credit: value.h_credit,
              comments: commentary,
              lp_status: value.lp_status,
              isShow: this.isValidStatusNumber(value) ? true : false,
              edit: false,
              round: null, // aqui agregar round
              type_of_disput: null,
              reason: null,
              instruction: null,
              to_select: false
            });
          });
          this.accounts.push({
            element: elements
          });
          this.oldAccounts = JSON.parse(JSON.stringify(this.accounts));
        }
      });
    },

    showTableAccounts(data) {
      data[0].a_name == "-" && data[1].a_name == "-" && data[2].a_name == "-"
        ? false
        : true;
    },
    removeAllAccount() {
      this.accounts = [];
    },
    removeAllRecord() {
      this.public_info = [];
    },
    returnGrid() {
      var route = "";
      if (this.modul == 2) {
        route = "/crm/leads/" + this.idlead;
      } else if (this.modul == 3) {
        route =
          this.global.idaccount != undefined
            ? "/bussiness/clients/account/" + this.global.idaccount
            : "/bussiness/leads/show/" + this.global.idlead;
      } else if (this.modul == 4) {
        route = "/administration/leads/show/" + this.global.idlead;
      } else if (this.modul == 5) {
        route =
          this.global.idaccount != undefined
            ? "/debtsolution/clients/account/" + this.global.idaccount
            : "/debtsolution/leads/show/" + this.global.idlead;
      } else if (this.modul == 6) {
        route =
          this.global.idaccount != undefined
            ? "/creditexperts/clients/account/" + this.global.idaccount
            : "/creditexperts/leads/show/" + this.global.idlead;
      } else if (this.modul == 7) {
        route =
          this.global.idaccount != undefined
            ? "/boostcredit/clients/account/" + this.global.idaccount
            : "/boostcredit/leads/show/" + this.global.idlead;
      } else if (this.modul == 8) {
        route =
          this.global.idaccount != undefined
            ? "/taxresearch/clients/account/" + this.global.idaccount
            : "/taxresearch/leads/show/" + this.global.idlead;
      } else if (this.modul == 10) {
        route =
          this.global.idaccount != undefined
            ? "/claimdepartment/clients/account/" + this.global.idaccount
            : "/claimdepartment/leads/show/" + this.global.idlead;
      } else if (this.modul == 11) {
        route =
          this.global.idaccount != undefined
            ? "/specialists/clients/account/" + this.global.idaccount
            : "/specialists/leads/show/" + this.global.idlead;
      } else if (this.modul == 18) {
        route = "/crm/socialnetwork/show/" + this.global.idlead;
      }
      window.location.href = route;
    },

    displayCheckArray(name) {
      if (!this.isForRound) {
        name.check = !name.check;
        name.status = name.check == false ? 5 : 6;
      }
    },
    processReport() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ab9220",
          cancelButtonColor: "#8f9194",
          confirmButtonText: "Yes"
        })
        .then(result => {
          if (result.value) {
            var btn = document.getElementById("app");
            btn.classList.add("preloader");
            this.disable.save = true;
            amgApi
              .post("/lead/credit-report/process-report", {
                user_id: this.global.layout.id,
                account: this.global.idaccount,
                score_id: this.idfile,
                pi: this.personal_info,
                in: this.inquires,
                pr: this.public_info,
                ac: this.accounts,
                scores: this.datos.score
              })
              .then(response => {
                if (response.status == 200) {
                  swal
                    .fire({
                      type: "success",
                      title: "OPERATION SUCCESSFULLY"
                    })
                    .then(res => {
                      if (res) {
                        var btn = document.getElementById("app");
                        btn.classList.remove("preloader");
                        window.location.reload();
                      }
                    });
                }
              })
              .catch(err => {
                console.error(err);
              });
          }
        });
    },

    changeDispute() {
      this.rounds.map(value => {
        this.accounts.map(account => {
          account.element.map(element => {
            if (value.id == element.id) {
              element.status = 1;
              element.to_select = false;
            }
          });
        });

        this.inquires.map(inquire => {
          if (value.id == inquire.id) {
            inquire.status = 1;
            inquire.to_select = false;
          }
        });

        this.personal_info.map(pi => {
          if (value.id == pi.id) {
            pi.status = 1;
            pi.to_select = false;
          }
        });

        this.public_info.map(pr => {
          pr.element.map(element => {
            if (value.id == element.id) {
              element.status = 1;
              element.to_select = false;
            }
          });
        });
      });
    },

    allStatus() {
      amgApi
        .get("/lead/get-all-status-letters")
        .then(response => {
          if (response.status == 200) {
            this.status = response.data;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    isInquiry(item, name) {
      try {
        return item[2].toLowerCase() == name || item[3].toLowerCase() == name;
      } catch (error) {
        return false;
      }
    },

    removeAccount(index) {
      this.accounts.splice(index, 1);
      this.oldAccounts = JSON.parse(JSON.stringify(this.accounts));
    },

    removeRecord(index) {
      this.public_info.splice(index, 1);
      this.oldInfo = JSON.parse(JSON.stringify(this.public_info));
    },

    editAccount(action, index, indexAccount) {
      if (action == 0) {
        this.accounts[indexAccount].element[index] = this.oldAccounts[
          indexAccount
        ].element[index];
        this.accounts[indexAccount].element[index].edit = false;
        let band = true;
        this.accounts[indexAccount].element.map(item => {
          if (item.edit == true) {
            band = false;
          }
        });
        if (band) {
          this.oldAccounts = JSON.parse(JSON.stringify(this.accounts));
        }
      }
    },

    editRecord(action, index, publicIndex) {
      if (action == 0) {
        this.public_info[publicIndex].element[index] = this.oldInfo[
          publicIndex
        ].element[index];
        this.public_info[publicIndex].element[index].edit = false;
        let band = true;
        this.public_info[publicIndex].element.map(item => {
          if (item.edit == true) {
            band = false;
          }
        });
        if (band) {
          this.oldInfo = JSON.parse(JSON.stringify(this.public_info));
        }
      }
    },

    addInquires() {
      this.inquires.unshift({
        content: null,
        sub_content: null,
        status: 6,
        bureau_id: 1,
        date: null,
        date_show: null,
        for_edit: true
      });
    },

    addPersonalInfo(bureau_id) {
      this.personal_info.push({
        type: this.type_selected,
        content: null,
        status: 6,
        bureau_id: bureau_id,
        check: true,
        for_edit: true
      });
      this.personal_info = JSON.parse(JSON.stringify(this.personal_info));
      this.modalInfo = false;
    },
    modalPersonalInfo(type) {
      this.type_selected = type;
      this.modalInfo = true;
      //this.addPersonalInfo(type, this.selected_bureau);
    },
    addAccount() {
      let elements = [];
      for (let i = 0; i < 3; i++) {
        elements.push({
          content: "-",
          a_number: "-",
          balance: 0,
          type: "-",
          status: 5,
          bureau_id: i + 1,
          p_status: "-",
          c_limit: 0,
          monthly: 0,
          last_p: 0,
          a_status: "-",
          a_description: "-",
          date: "-",
          n_months: "-",
          h_credit: "-",
          comments: "-",
          isShow: true,
          edit: false,
          round: null,
          to_select: false
        });
      }
      this.accounts.push({
        element: elements
      });
      this.oldAccounts = JSON.parse(JSON.stringify(this.accounts));
    },

    addPublicRecord() {
      let elements = [];
      for (let i = 0; i < 3; i++) {
        elements.push({
          content: null,
          status: 6,
          bureau_id: i + 1,
          court: null,
          date: null,
          reference: null,
          closing: null,
          status_show: null,
          round: null,
          edit: false
        });
      }
      this.public_info.push({
        element: elements,
        date: null
      });
      this.oldInfo = JSON.parse(JSON.stringify(this.public_info));
    },

    alltitles() {
      amgApi.get("/lead/ncr/all-titles").then(res => {
        this.titles = res.data;
      });
    },

    allFormats() {
      amgApi.get("/lead/ncr/all-formats").then(res => {
        this.formats = res.data;
      });
    },

    reloadHeaders() {
      if (this.isForRound) {
        this.headerAccounts.push({
          key: "round",
          label: "Round"
        });
        this.headerPublics.push({
          key: "round",
          label: "Round"
        });
      }
    },

    getSelectsOptions() {
      amgApi
        .get("/lead/ncr/get-reasons")
        .then(response => {
          if (response.status == 200) {
            this.reasons = response.data;
          }
        })
        .catch(err => {
          console.error(err);
        });

      amgApi
        .get("/lead/ncr/get-instructions")
        .then(response => {
          if (response.status == 200) {
            this.instructions = response.data;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    toSelected(item, index) {
      let count = 0;
      item.element.map(items => {
        if (items.to_select == 1) {
          count = count + 1;
        }
      });
      if (count > 0) {
        this.btnRound = true;
      }
    },

    loadSecureSocial() {
      amgApi
        .post("/lead/ncr/all-secure-social", {
          ncrid: this.round_id
        })
        .then(response => {
          if (response.status == 200) {
            if (response.data.length > 0) {
              this.secure_number = response.data[0];
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    openModalRound() {
      this.$refs.accounts.validate().then(success => {
        if (!success) {
          return;
        } else {
          let count = 0;
          let countOnline = 0;
          let countPhone = 0;
          this.rounds = [];
          // Agregar ronda cuentas online
          this.accounts.map((item, index) => {
            item.element.map(elme => {
              let select = elme.to_select;
              if (select != null && select != false && elme.status != 1) {
                count = count + 1;
                let isShow = false;
                if (elme.type_of_disput == 3) {
                  isShow = true;
                } else if (elme.type_of_disput == 1) {
                  if (countPhone < 1) {
                    isShow = true;
                    countPhone = countPhone + 1;
                  } else {
                    isShow = false;
                  }
                } else if (elme.type_of_disput == 2) {
                  if (countOnline < 1) {
                    isShow = true;
                    countOnline = countOnline + 1;
                  } else {
                    isShow = false;
                  }
                }
                this.rounds.push({
                  id: elme.id,
                  type_of_disput: elme.type_of_disput,
                  title: null,
                  format: null,
                  type: null,
                  social: null,
                  show: isShow,
                  bureau_id: elme.bureau_id,
                  content: elme.content,
                  reason: this.setAccounts.reason[index],
                  instruction: this.setAccounts.instruction[index],
                  isElement: 4,
                  type_of_disput: elme.type_of_disput,
                  type_social: null
                });
              }
            });
          });

          // Agregar ronda public record
          this.public_info.map((item, index) => {
            item.element.map(elme => {
              let select = elme.to_select;
              if (select != null && select != false && elme.status != 1) {
                count = count + 1;
                let isShow = false;
                if (elme.type_of_disput == 3) {
                  isShow = true;
                } else if (elme.type_of_disput == 1) {
                  if (countPhone < 1) {
                    isShow = true;
                    countPhone = countPhone + 1;
                  } else {
                    isShow = false;
                  }
                } else if (elme.type_of_disput == 2) {
                  if (countOnline < 1) {
                    isShow = true;
                    countOnline = countOnline + 1;
                  } else {
                    isShow = false;
                  }
                }
                this.rounds.push({
                  id: elme.id,
                  type_of_disput: elme.type_of_disput,
                  title: null,
                  format: null,
                  type: null,
                  social: null,
                  show: isShow,
                  bureau_id: elme.bureau_id,
                  content: elme.content,
                  reason: this.setPublicRecord.reason[index],
                  instruction: this.setPublicRecord.instruction[index],
                  isElement: 3,
                  type_of_disput: elme.type_of_disput,
                  type_social: null
                });
              }
            });
          });

          // Agregar ronda inquries
          this.inquires.map(elme => {
            this.setInq.map((item, index) => {
              if (index + 1 == elme.bureau_id) {
                elme.type_of_disput = item.type_of_disput;
              }
            });
            let select = elme.to_select;
            if (select != null && select != false && elme.status != 1) {
              count = count + 1;
              let isShow = false;
              if (elme.type_of_disput == 3) {
                isShow = true;
              } else if (elme.type_of_disput == 1) {
                if (countPhone < 1) {
                  isShow = true;
                  countPhone = countPhone + 1;
                } else {
                  isShow = false;
                }
              } else if (elme.type_of_disput == 2) {
                if (countOnline < 1) {
                  isShow = true;
                  countOnline = countOnline + 1;
                } else {
                  isShow = false;
                }
              }
              this.rounds.push({
                id: elme.id,
                type_of_disput: elme.type_of_disput,
                title: null,
                format: null,
                type: null,
                social: null,
                show: isShow,
                bureau_id: elme.bureau_id,
                isElement: 2,
                content: elme.content,
                reason: this.setInquires.reason,
                instruction: this.setInquires.instruction,
                type_of_disput: this.setDisputeInquire[elme.bureau_id - 1]
                  .type_of_disput,
                type_social: null
              });
            }
          });

          // Agregar ronda personal
          this.personal_info.map(elme => {
            let select = elme.to_select;
            if (select != null && select != false && elme.status != 1) {
              count = count + 1;
              let isShow = false;
              if (elme.type_of_disput == 3) {
                isShow = true;
              } else if (elme.type_of_disput == 1) {
                if (countPhone < 1) {
                  isShow = true;
                  countPhone = countPhone + 1;
                } else {
                  isShow = false;
                }
              } else if (elme.type_of_disput == 2) {
                if (countOnline < 1) {
                  isShow = true;
                  countOnline = countOnline + 1;
                } else {
                  isShow = false;
                }
              }
              this.rounds.push({
                id: elme.id,
                type_of_disput: elme.type_of_disput,
                title: null,
                format: null,
                type: null,
                social: null,
                show: isShow,
                bureau_id: elme.bureau_id,
                isElement: 1,
                content: elme.content,
                reason: this.setPersonal[elme.type - 1].reason,
                instruction: this.setPersonal[elme.type - 1].instruction,
                type_social: null
              });
            }
          });

          if (count > 0) {
            this.btnRound = true;
            this.roundPaginator = 0;
            this.modalRound = true;
          } else {
            this.btnRound = false;
          }

          this.loadSecureSocial();
        }
      });
    },

    processRound() {
      if (this.round.secure_number == this.secure_number.ssn) {
        this.type_social = 1;
      } else if (this.round.secure_number == this.secure_number.itin) {
        this.type_social = 2;
      } else {
        this.type_social = 3;
      }
      this.$refs.form.validate().then(success => {
        if (!success) {
          return;
        } else {
          swal
            .fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ab9220",
              cancelButtonColor: "#8f9194",
              confirmButtonText: "Yes"
            })
            .then(async result => {
              if (result.value) {
                await this.checkIsEmpty();
                var btn = document.getElementById("app");
                btn.classList.add("preloader");
                btn.classList.add("opacity-uno");
                amgApi
                  .post("/lead/process-round-in-credit-report", {
                    rounds: this.rounds,
                    user_id: this.global.layout.id,
                    round_id: this.round_id,
                    type_social: this.type_social
                  })
                  .then(response => {
                    if (response.status == 200) {
                      //reload page
                      this.changeDispute();
                      this.modalRound = false;
                      btn.classList.remove("preloader");
                      btn.classList.remove("opacity-uno");
                      this.cleanAllForms();
                      swal.fire("Round Processed", "", "success");
                    }
                  })
                  .catch(err => {
                    console.error(err);
                  });
              }
            });
        }
      });
    },

    completeRound() {
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ab9220",
          cancelButtonColor: "#8f9194",
          confirmButtonText: "Yes"
        })
        .then(result => {
          if (result.value) {
            var btn = document.getElementById("app");
            btn.classList.add("preloader");
            window.location.href = "/specialists/ncr/new";
          }
        });
    },

    checkIsEmpty() {
      this.rounds.map(item => {
        item.title = this.round.title;
        item.social = this.round.secure_number;
        item.format = this.round.format;
        item.type = this.round.type;
      });
    },

    nextPageRound(index) {
      this.$refs.form.validate().then(success => {
        if (!success) {
          return;
        } else {
          this.roundPaginator = index;
          0;
        }
      });
    },

    cleanAllForms() {
      this.round = {
        title: null,
        format: null,
        type: null,
        secure_number: null
      };
      this.setInq = [
        {
          type_of_disput: null,
          reason: null,
          instruction: null,
          select: false
        },
        {
          type_of_disput: null,
          reason: null,
          instruction: null,
          select: false
        },
        {
          type_of_disput: null,
          reason: null,
          instruction: null,
          select: false
        }
      ];
      this.setPersonal = [
        {
          reason: null,
          instruction: null
        },
        {
          reason: null,
          instruction: null
        },
        {
          reason: null,
          instruction: null
        }
      ];
      this.setDisputeInquire = [
        {
          type_of_disput: null
        },
        {
          type_of_disput: null
        },
        {
          type_of_disput: null
        }
      ];
      this.setInquires = {
        reason: null,
        instruction: null
      };
      this.setAccounts = {
        reason: [],
        instruction: []
      };
      this.setPublicRecord = {
        reason: [],
        instruction: []
      };
    },
    showData() {}
  }
};
</script>

<style scoped>
.light {
  background-color: #f3f2f7;
}
.dark {
  background-color: #333b51;
}
</style>

<style scoped>
.text-blue-underline {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.text-orange-wounder {
  color: #ff9800 !important;
}
.text-check-red {
  color: red;
  font-size: 25px;
}
.bg-light-red {
  background: #ffb2c5;
}
.personalizado tbody tr td {
  border: 1px solid grey;
}
.personalizado {
  border: 1px solid grey;
}
.center {
  display: flex;
  justify-content: center;
}
.page-item.active .page-link {
  background-color: #3490dc !important;
}
.table::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.table::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  /* border-radius: 7px; */
}
.table::-webkit-scrollbar-thumb:hover {
  background: #c5c2c2 !important;
  /* border-radius: 10px; */
}
.bg-warning {
  background-color: #ff9800 !important;
}
.text-check-orange {
  color: #ff9800;
  font-size: 25px;
}
</style>

<style lang="scss" scoped>
.fade-hr {
  height: 1px;
  $color: #343a40;
  color: $color;
  background-image: linear-gradient(
    90deg,
    rgba($color, 0),
    rgba($color, 1) 50%,
    rgba($color, 0) 100%
  );
}
</style>
