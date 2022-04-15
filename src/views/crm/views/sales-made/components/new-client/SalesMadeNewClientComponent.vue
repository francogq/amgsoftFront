<template>
  <div class="border-top-info border-3 box-shadow-3 rounded-bottom">
    <filter-slot
      :filter="filter"
      :filter-principal="filterPrincipal"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      @reload="$refs['new-client-done-table'].refresh()"
      @onSelectChange="getSellers()"
    >
      <template #buttons>
        <b-button
          variant="success"
          class="ml-1"
          :disabled="!selected.length"
          @click="modalSmssOpen"
        >
          <feather-icon icon="MessageCircleIcon" class="mr-50" />Send SMS
        </b-button>
      </template>

      <template #table>
        <b-table
          id="new-client-done-table"
          ref="new-client-done-table"
          sticky-header="70vh"
          small
          no-provider-filtering
          :busy.sync="isBusy"
          :items="statusEmit ? removeFromTable : search"
          :fields="filteredFields"
          :per-page="paginate.perPage"
          :current-page="paginate.currentPage"
          :filter="filter"
          class="font-small-3"
          :tbody-tr-class="'tr-table'"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
          <template #head(selected)>
            <b-form-checkbox v-model="selectAll" @input="selectedAll" />
          </template>
          <template v-slot:cell(selected)="row">
            <b-form-group>
              <b-form-checkbox
                v-model="row.item.selected"
                class="mt-1"
                @input="selectedRow(row.item)"
              />
            </b-form-group>
          </template>
          <template v-slot:cell(client)="data">
            <div class="text-left" style="margin-bottom: -15px !important">
              <router-link
                :class="[textLink]"
                :to="`/crm/leads/${data.item.lead_id}`"
                target="_blank"
                >{{ data.item.client }}</router-link
              >
              <p class="mb-0">
                {{ data.item.mobile }}
              </p>
              <p class="mb-0">
                <small>{{ data.item.state }}</small>
              </p>
              <p>
                <small>{{ data.item.sourcesname }}</small>
              </p>
            </div>
          </template>
          <template v-slot:cell(program)="data">
            <b-button
              :style="`color: white !important; border-color: ${data.item.program_color} !important; background-color: ${data.item.program_color} !important;`"
              size="sm"
              class="font-weight-bolder"
              @click="openModalProgram(data.item, data.index)"
            >
              <span v-b-tooltip.bottom="data.item.program">{{
                data.item.program_initials
              }}</span>
              <feather-icon
                v-if="data.item.haveRates !== 1"
                icon="AlertTriangleIcon"
                style="margin-left: 5px"
              />
              <feather-icon
                v-else
                icon="CheckCircleIcon"
                style="margin-left: 5px"
              />
            </b-button>
          </template>
          <template v-slot:cell(captured)="data">
            <span>
              <span v-if="!data.item.editCaptured">
                {{ data.item.captured }}
              </span>

              <span v-else>
                <b-form-select
                  v-model="data.item.capturedNew"
                  text-field="label"
                  value-field="id"
                  :options="captured"
                  class="mb-1 font-small-1"
                  style="width: 80px !important"
                  size="sm"
                />
              </span>
              <div>
                <p v-if="data.item.commission" class="m-0">
                  <small
                    v-if="G_IS_CEO || G_IS_SUPERVISOR"
                    class="text-primary font-weight-bold"
                    >$ {{ data.item.commission[0].commission }}
                  </small>
                </p>
              </div>

              <div
                v-if="
                  (data.item.status == 1 ||
                    data.item.status == 3 ||
                    data.item.status == 5) &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator)
                "
                class="mt-07 text-right mr-1"
              >
                <b-icon
                  v-if="!data.item.editCaptured"
                  icon="pencil-fill"
                  class="cursor-pointer"
                  @click="
                    data.item.editCaptured = true;
                    data.item.editCaptured = data.item.captured;
                  "
                />
                <feather-icon
                  v-else
                  class="cursor-pointer"
                  icon="SaveIcon"
                  @click="
                    saveNewCaptured(
                      data.item.captured,
                      data.item.capturedNew,
                      data.item.id,
                      data.item
                    )
                  "
                />
                <b-icon
                  v-if="!data.item.editCaptured"
                  class="cursor-pointer ml-07"
                  icon="list-ul"
                  @click="
                    openTrackingCapturedByModal(
                      data.item.program,
                      data.item.client,
                      data.item.id,
                      1
                    )
                  "
                />
                <feather-icon
                  v-else
                  class="cursor-pointer"
                  icon="XSquareIcon"
                  @click="data.item.editCaptured = false"
                />
              </div>
            </span>
          </template>
          <template v-slot:cell(seller)="data">
            <span>
              <span v-if="!data.item.editSeller">
                {{ data.item.seller }}
              </span>
              <span v-else>
                <b-form-select
                  v-model="data.item.sellerNew"
                  text-field="label"
                  value-field="id"
                  :options="sellers"
                  class="mb-1 font-small-1"
                  style="width: 80px !important"
                  size="sm"
                />
              </span>

              <div>
                <p v-if="data.item.commission">
                  <small
                    v-if="
                      G_IS_CEO ||
                      G_IS_SUPERVISOR ||
                      (data.item.user_id == currentUser.user_id && G_IS_SELLER)
                    "
                    class="text-primary font-weight-bold"
                    >$ {{ data.item.commission[1].commission }}</small
                  >
                </p>
              </div>

              <div
                v-if="
                  (data.item.status == 1 ||
                    data.item.status == 3 ||
                    data.item.status == 5) &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator)
                "
                class="mt-07 text-right mr-1"
              >
                <b-icon
                  v-if="!data.item.editSeller"
                  icon="pencil-fill"
                  class="cursor-pointer"
                  @click="data.item.editSeller = true"
                />
                <feather-icon
                  v-else
                  class="cursor-pointer"
                  icon="SaveIcon"
                  @click="
                    saveNewSeller(
                      data.item.seller,
                      data.item.sellerNew,
                      data.item.id,
                      data.item
                    )
                  "
                />
                <b-icon
                  v-if="!data.item.editSeller"
                  class="cursor-pointer ml-07"
                  icon="list-ul"
                  @click="
                    openTrackingCapturedByModal(
                      data.item.program,
                      data.item.client,
                      data.item.id,
                      2
                    )
                  "
                />
                <feather-icon
                  v-else
                  class="cursor-pointer"
                  icon="XSquareIcon"
                  @click="
                    data.item.editSeller = false;
                    data.item.sellerNew = data.item.seller;
                  "
                />
              </div>
            </span>
          </template>
          <template v-slot:cell(fee)="data">
            <span>
              <span v-if="!data.item.editFee">
                $
                {{
                  typeof data.item.fee === "number"
                    ? data.item.fee
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : data.item.fee
                }}
              </span>
              <span v-else>
                <money
                  v-model="data.item.feeNew"
                  class="form-control form-control-sm p-0"
                  v-bind="{ prefix: ' $ ', precision: 2 }"
                  style="width: 70px !important"
                />
              </span>

              <div
                v-if="
                  (data.item.status === 1 || data.item.status === 3) &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator)
                "
                class="mt-07 text-right mr-1"
              >
                <b-icon
                  v-if="!data.item.editFee"
                  icon="pencil-fill"
                  class="cursor-pointer"
                  @click="
                    !(data.item.haveRates !== 1) && (data.item.editFee = true)
                  "
                />
                <feather-icon
                  v-else
                  class="cursor-pointer"
                  icon="SaveIcon"
                  @click="
                    saveNewFee(
                      data.item.fee,
                      data.item.feeNew,
                      data.item.id,
                      data.item
                    )
                  "
                />
                <b-icon
                  v-if="!data.item.editFee"
                  icon="list-ul"
                  class="cursor-pointer ml-07"
                  @click="
                    openTrackingCapturedByModal(
                      data.item.program,
                      data.item.client,
                      data.item.id,
                      3
                    )
                  "
                />
                <feather-icon
                  v-else
                  class="cursor-pointer"
                  icon="XSquareIcon"
                  @click="
                    data.item.editFee = false;
                    data.item.feeNew = data.item.fee;
                  "
                />
              </div>
              <template
                v-if="
                  (data.item.status === 1 || data.item.status === 3) &&
                  G_IS_SELLER
                "
              >
                <br />
                <b-icon
                  v-if="!data.item.editFee"
                  icon="list-ul"
                  class="cursor-pointer ml-07"
                  @click="
                    openTrackingCapturedByModal(
                      data.item.program,
                      data.item.client,
                      data.item.id,
                      3
                    )
                  "
                />
              </template>
            </span>
          </template>
          <template v-slot:cell(initial_amount)="data">
            <div
              :class="
                (data.item.user_id == currentUser.user_id && G_IS_SELLER) ||
                G_IS_CEO ||
                G_IS_SUPERVISOR ||
                isCoordinator
                  ? 'cursor-pointer'
                  : ''
              "
              @click="
                ((data.item.user_id == currentUser.user_id && G_IS_SELLER) ||
                  G_IS_CEO ||
                  G_IS_SUPERVISOR ||
                  isCoordinator) &&
                  openInitialPaymentModal(data.item, data.index)
              "
            >
              <b-icon
                v-if="data.item.initial_payment_status === 1"
                icon="wallet2"
                variant="muted"
                class="font-medium-2"
              />
              <b-icon
                v-else-if="data.item.initial_payment_status === 3"
                icon="wallet2"
                variant="warning"
                class="font-medium-2"
              />
              <p
                v-else-if="data.item.initial_payment_status === 2"
                class="text-success font-weight-bold"
              >
                $ {{ data.item.initial_amount }}
              </p>
            </div>
          </template>
          <template v-slot:cell(contract_fee_status)="data">
            <b-row
              :style="
                data.item.user_id != currentUser.user_id && G_IS_SELLER
                  ? 'pointer-events: none !important; opacity: 0.4 !important;'
                  : ''
              "
              class="d-flex align-items-center justify-content-center"
            >
              <b-icon
                v-if="
                  data.item.contract_fee_status == 0 ||
                  (data.item.contract_fee_status == 1 &&
                    data.item.initial_payment_status == 3)
                "
                class="cursor-pointer font-medium-2"
                icon="file-text"
                variant="muted"
                :style="
                  data.item.initial_payment_status == 2
                    ? ''
                    : 'cursor: not-allowed;'
                "
                @click="
                  data.item.initial_payment_status == 1
                    ? null
                    : openContractFeeModal(data.item, data.index)
                "
              />
              <b-icon
                v-if="
                  data.item.contract_fee_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                variant="success"
                icon="file-text"
                class="cursor-pointer font-medium-2"
                :style="
                  data.item.initial_payment_status == 2
                    ? ''
                    : 'cursor: not-allowed;'
                "
                @click="
                  data.item.initial_payment_status == 1
                    ? null
                    : openContractFeeModal(data.item, data.index)
                "
              />
              <b-icon
                v-if="data.item.contract_fee_status == 2"
                variant="danger"
                icon="file-text"
                class="cursor-pointer font-medium-2"
                :style="
                  data.item.initial_payment_status == 2
                    ? ''
                    : 'cursor: not-allowed;'
                "
                @click="
                  data.item.initial_payment_status == 1
                    ? null
                    : openContractFeeModal(data.item, data.index)
                "
              />
            </b-row>
          </template>
          <template v-slot:cell(notes_status)="data">
            <b-icon
              v-if="data.item.creates > '2021-05-16 00:00:00'"
              icon="chat-square-text-fill"
              class="cursor-pointer font-medium-2"
              :variant="
                data.item.notes_status_new == null
                  ? 'muted'
                  : data.item.notes_status_new == 0
                  ? 'success'
                  : 'warning'
              "
              @click="notesModal(data.item, data.index)"
            />
            <b-icon
              v-else
              icon="chat-square-text-fill"
              class="cursor-pointer font-medium-2"
              :variant="data.item.notes_status === 0 ? 'muted' : 'success'"
              @click="notesModal(data.item, data.index)"
            />
          </template>
          <template v-slot:cell(trackings)="data">
            <b-icon
              class="cursor-pointer font-medium-2"
              icon="list-check"
              :variant="data.item.trackings ? 'success' : 'muted'"
              @click="
                openTrackingModal(
                  data.item.program,
                  data.item.client,
                  data.item.trackings
                )
              "
            />
          </template>
          <template v-slot:cell(files)="data">
            <feather-icon
              :class="
                (data.item.user_id == currentUser.user_id && G_IS_SELLER) ||
                G_IS_CEO ||
                G_IS_SUPERVISOR ||
                isCoordinator
                  ? 'cursor-pointer text-warning'
                  : ''
              "
              :style="
                (data.item.user_id == currentUser.user_id && G_IS_SELLER) ||
                G_IS_CEO ||
                G_IS_SUPERVISOR ||
                isCoordinator
                  ? 'fill: #ff9f43'
                  : 'fill: #D8D8D6'
              "
              icon="FolderIcon"
              class="font-medium-2"
              @click="
                ((data.item.user_id == currentUser.user_id && G_IS_SELLER) ||
                  G_IS_CEO ||
                  G_IS_SUPERVISOR ||
                  isCoordinator) &&
                  openFilesModal(
                    data.item.lead_id,
                    data.item.program,
                    data.item.client,
                    data.item.id,
                    data.item.status,
                    data.item.user_id,
                    data.item.program_id,
                    data.item.event_date
                  )
              "
            />
          </template>
          <template v-slot:cell(status)="data">
            <p
              class="m-0 font-weight-bold font-small-3"
              :class="'color: text-' + status[data.item.status].variant"
            >
              {{ status[data.item.status].label }}
            </p>
          </template>
          <template v-slot:cell(actions)="data">
            <b-row
              v-if="data.item.creates > '2021-05-16 00:00:00'"
              class="
                d-flex
                align-items-center
                justify-content-center
                flex-column
                px-1
              "
              :class="{
                'not-pointer':
                  data.item.user_id != currentUser.user_id &&
                  G_IS_SELLER &&
                  !isCoordinator,
              }"
            >
              <!-- Just for Seller after finish all requirements -->
              <b-button
                v-if="
                  (data.item.status == 1 || data.item.status == 7) &&
                  !G_IS_CEO &&
                  !G_IS_SUPERVISOR &&
                  !isCoordinator &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                variant="outline-success"
                class="m-10px w-100"
                size="sm"
                @click="revisionSale(5, data.item, data.index)"
              >
                Revission
              </b-button>

              <!-- Revission to Administration for Supervisor or Ceo -->
              <b-button
                v-if="
                  (data.item.status == 1 || data.item.status == 6) &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                variant="outline-success"
                :disabled="
                  data.item.type == 1 && G_IS_CEO
                    ? false
                    : data.item.type == 0
                    ? false
                    : true
                "
                class="m-10px w-100"
                size="sm"
                @click="revisionSale(2, data.item, data.index)"
              >
                Revission
              </b-button>

              <!-- IN SUPERVISOR REVISSION  -->
              <b-button
                v-if="
                  data.item.status == 5 &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                variant="outline-success"
                class="m-10px w-100"
                size="sm"
                @click="revisionSale(2, data.item, data.index)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  data.item.status == 5 &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                variant="outline-warning"
                class="m-10px w-100"
                size="sm"
                @click="revisionSale(7, data.item, data.index)"
                >Return</b-button
              >
              <b-button
                v-if="
                  data.item.status == 3 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_CEO ||
                    G_IS_SUPERVISOR ||
                    isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                variant="outline-danger"
                class="m-10px w-100"
                size="sm"
                @click="revisionSale(2, data.item, data.index)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  data.item.initial_payment_status == 1 &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator)
                "
                variant="outline-danger"
                class="m-10px w-100"
                size="sm"
                @click="annulSale(data.item)"
                >Annul</b-button
              >
            </b-row>

            <b-row
              v-else
              :class="{
                'not-pointer':
                  data.item.user_id != currentUser.user_id &&
                  G_IS_SELLER &&
                  !isCoordinator,
              }"
              class="
                d-flex
                align-items-center
                justify-content-center
                flex-column
                px-1
              "
            >
              <!-- Just for Seller after finish all requirements -->
              <b-button
                v-if="
                  (data.item.status == 1 || data.item.status == 7) &&
                  !G_IS_CEO &&
                  !G_IS_SUPERVISOR &&
                  !isCoordinator &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                variant="outline-success"
                class="m-10px w-100"
                size="sm"
                @click="revisionSale(5, data.item, data.index)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  (data.item.status == 1 || data.item.status == 6) &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                class="m-10px w-100"
                variant="outline-success"
                :disabled="
                  data.item.type == 1 && G_IS_CEO
                    ? false
                    : data.item.type == 0
                    ? false
                    : true
                "
                size="sm"
                @click="revisionSale(2, data.item, data.index)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  data.item.status == 5 &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                class="m-10px w-100"
                variant="outline-success"
                size="sm"
                @click="revisionSale(2, data.item, data.index)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  data.item.status == 5 &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status_new == 0 &&
                  data.item.initial_payment_status == 2
                "
                class="m-10px w-100"
                variant="outline-danger"
                size="sm"
                @click="revisionSale(7, data.item, data.index)"
                >Return</b-button
              >
              <b-button
                v-if="
                  data.item.status == 3 &&
                  (currentUser.user_id == data.item.user_id ||
                    G_IS_CEO ||
                    G_IS_SUPERVISOR ||
                    isCoordinator) &&
                  data.item.contract_fee_status == 1 &&
                  data.item.notes_status == 1 &&
                  data.item.initial_payment_status == 2
                "
                class="m-10px w-100"
                variant="outline-danger"
                size="sm"
                @click="revisionSale(2, data.item, data.index)"
                >Revission</b-button
              >
              <b-button
                v-if="
                  data.item.initial_payment_status == 1 &&
                  (G_IS_CEO || G_IS_SUPERVISOR || isCoordinator)
                "
                variant="outline-danger"
                size="sm"
                class="m-10px w-100"
                @click="annulSale(data.item)"
                >ANNUL</b-button
              >
            </b-row>
          </template>
          <template #cell(creates)="data">
            <span>{{ data.item.creates | myGlobal }}</span>
          </template>
          <template #cell(approved)="data">
            <span class="font-weight-bold text-info">{{
              data.item.approved | myGlobal
            }}</span>
          </template>
          <template #cell(sms)="data">
            <b-dropdown
              variant="link"
              no-caret
              :right="$store.state.appConfig.isRTL"
            >
              <template #button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="align-middle text-body"
                />
              </template>
              <b-dropdown-item @click="modalSmsOpen(data.item)">
                <feather-icon icon="MessageSquareIcon" />SMS
              </b-dropdown-item>
              <b-dropdown-item @click="modalHistorySmsOpen(data.item)">
                <feather-icon icon="RotateCcwIcon" />History
              </b-dropdown-item>
              <b-dropdown-item
                v-if="
                  data.item.initial_payment_status === 1 &&
                  (data.item.user_id == currentUser.user_id ||
                    G_IS_CEO ||
                    G_IS_SUPERVISOR ||
                    isCoordinator)
                "
                @click="openUrlModal(data.item)"
              >
                <feather-icon icon="LinkIcon" />Url
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template #cell(done)="data">
            <b-btn
              v-if="data.item.initial_payment_status == 2"
              variant="outline-info"
              size="sm"
              @click="returnDone(data.item.event_id, null)"
              >Done</b-btn
            >
          </template>
          <template v-if="G_IS_CEO || G_IS_SUPERVISOR" #custom-foot>
            <b-tr class="bg-info">
              <b-td colspan="2" />
              <b-td
                colspan="2"
                class="text-center text-white font-weight-bolder py-px"
              >
                TCMC
              </b-td>
              <b-td
                colspan="2"
                class="text-center text-white font-weight-bolder py-px"
              >
                TCMS
              </b-td>
              <b-td
                colspan="3"
                class="text-center text-white font-weight-bolder py-px"
              >
                TFEE
              </b-td>
              <b-td
                colspan="3"
                class="text-center text-white font-weight-bolder py-px"
              >
                TIP
              </b-td>
              <b-td
                colspan="2"
                class="text-center text-white font-weight-bolder py-px"
              >
                TMA
              </b-td>
              <b-td :colspan="done === 0 ? 3 : 2" />
            </b-tr>
            <b-tr>
              <b-td colspan="2" class="text-right font-weight-bolder py-px">
                Subtotal
              </b-td>
              <b-td colspan="2" class="text-center py-px">
                {{ "$ " + subtotal.tcmc }}
              </b-td>
              <b-td colspan="2" class="text-center py-px">
                {{ "$ " + subtotal.tcms }}
              </b-td>
              <b-td colspan="3" class="text-center py-px">
                {{ "$ " + subtotal.tfee }}
              </b-td>
              <b-td colspan="3" class="text-center py-px">
                {{ "$ " + subtotal.tip }}
              </b-td>
              <b-td colspan="2" class="text-center py-px">
                {{ "$ " + subtotal.tma }}
              </b-td>
              <b-td :colspan="done === 0 ? 3 : 2" />
            </b-tr>
            <b-tr>
              <b-td colspan="2" class="text-right font-weight-bolder py-px">
                Total
              </b-td>
              <b-td colspan="2" class="text-center py-px">
                {{ "$ " + total.tcmc }}
              </b-td>
              <b-td colspan="2" class="text-center py-px">
                {{ "$ " + total.tcms }}
              </b-td>
              <b-td colspan="3" class="text-center py-px">
                {{ "$ " + total.tfee }}
              </b-td>
              <b-td colspan="3" class="text-center py-px">
                {{ "$ " + total.tip }}
              </b-td>
              <b-td colspan="2" class="text-center py-px">
                {{ "$ " + total.tma }}
              </b-td>
              <b-td :colspan="done === 0 ? 3 : 2" />
            </b-tr>
          </template>
        </b-table>
      </template>
    </filter-slot>
    <b-modal
      id="modal-history-sms"
      ok-only
      modal-class="modal-primary"
      centered
      size="lg"
      title="History Of Sms"
      hide-footer
    >
      <modal-history-sms
        :id="modalData.historySms.id"
        :modul="currentUser.modul_id"
        :lead-name="modalData.historySms.leadName"
      />
    </b-modal>
    <modal-send-sms
      v-if="modal.modalSms"
      :smss="modalData.sendSms.leads_sms"
      :modul="currentUser.modul_id"
      :typesms="modalData.sendSms.typesms"
      :sms="modalData.sendSms.leads_sms_o"
      :name-leads="modalData.sendSms.name_leads_arr"
      @hide="modalSmsClose"
    />
    <tracking-modal :modal="modal" :tracking="modalData.tracking" />
    <component
      :is="modalData.programs.programSelected"
      v-if="modal.programs"
      :modal-services="modal.programs"
      :sales-client="modalData.programs.salesClient"
      :type-modal="modalData.programs.typeModal"
      @closeModal="hideModalProgram"
    />
    <initial-payment-modal
      v-if="modal.initial_payment"
      :modal="modal"
      :initial_payment="modalData.initial_payment"
      @close="hideInitialPaymentModal"
    />
    <tracking-captured-by-modal
      v-if="modal.captuerd_by_tracking"
      :modal="modal"
      :captured-by-tracking="modalData.capturedByTracking"
    />
    <files-modal
      v-if="modal.files"
      :modal="modal"
      :files="modalData.files"
      @close="modal.files = false"
    />
    <revission-modal
      v-if="modal.revission"
      :modal="modal"
      :revission="modalData.revission"
      @click="
        updateRow();
        modal.revission = false;
      "
      @response="
        updateRow();
        modal.revission = false;
      "
      @removeFromTable="removeFromTable"
    />

    <!-- NOTES -->
    <component
      :is="modalData.notes.programSelected"
      v-if="modal.notes"
      :note-info="modalData.notes"
      @hide="closeModalNotes"
    />

    <url-modal v-if="modal.url" :modal="modal" :url="modalData.url" />
    <contract-fee-modal
      v-if="modal.contract_fee"
      :modal="modal"
      :contract-fee="modalData.contractFee"
      @close="modal.contract_fee = false"
      @reload="updateRow"
    />
    <approve-supervisor-modal
      v-if="modal.approveSupervisorModal"
      :session-id="currentUser.user_id"
      :modul="modalData.approveSupervisorModal.modul"
      :event-id="modalData.approveSupervisorModal.eventId"
      :type-approve="modalData.approveSupervisorModal.typeApprove"
      @approveSupChar="returnDone"
      @click="closeModalApprove"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CrmServices from "@/views/crm/services/crm.service";

import vSelect from "vue-select";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import dataFields from "@/views/crm/views/sales-made/components/new-client/fields.data";
import dataFilters from "@/views/crm/views/sales-made/components/new-client/filters.data";
import CrmService from "@/views/crm/services/crm.service";
import TrackingModal from "@/views/crm/views/sales-made/components/modals/TrackingModal.vue";
import InitialPaymentModal from "@/views/crm/views/sales-made/components/modals/InitialPaymentModal.vue";
import TrackingCapturedByModal from "@/views/crm/views/sales-made/components/modals/TrackingCapturedByModal.vue";
import FilesModal from "@/views/crm/views/sales-made/components/modals/FilesModal.vue";
import BusinessModal from "@/views/crm/views/sales-made/components/modals/services/BuisnessModal.vue";
import CreditExpertsModal from "@/views/crm/views/sales-made/components/modals/services/CreditExpertsModal.vue";
import BoostCreditModal from "@/views/crm/views/sales-made/components/modals/services/BoostCreditModal.vue";
import GeneralSupportModal from "@/views/crm/views/sales-made/components/modals/services/GeneralSupportModal.vue";
import KeyBookModal from "@/views/crm/views/sales-made/components/modals/services/KeyBookModal.vue";
import ParagonModal from "@/views/crm/views/sales-made/components/modals/services/ParagonModal.vue";
import SpecialistModal from "@/views/crm/views/sales-made/components/modals/services/SpecialistModal.vue";
import TaxResearchModal from "@/views/crm/views/sales-made/components/modals/services/TaxResearchModal.vue";
import DebtSolutionModal from "@/views/crm/views/sales-made/components/modals/services/DebtSolutionModal.vue";
import RevissionModal from "@/views/crm/views/sales-made/components/modals/RevissionModal.vue";
import UrlModal from "@/views/crm/views/sales-made/components/modals/UrlModal.vue";
import { amgApi } from "@/service/axios";
import ContractFeeModal from "@/views/crm/views/sales-made/components/modals/ContractFeeModal.vue";
import ModalNotesTax from "@/views/commons/components/first-notes/ModalNotesTax.vue";
import ModalNotesFirst from "@/views/commons/components/first-notes/ModalNotesFirst.vue";
import ModalNotesBoost from "@/views/commons/components/first-notes/ModalNotesBoost.vue";
import ModalNotesParagon from "@/views/commons/components/first-notes/ModalNotesParagon.vue";
import ModalHistorySms from "@/views/crm/views/Lead/lead-sms/ModalHistorySms.vue";
import ModalSendSms from "@/views/crm/views/Lead/lead-sms/ModalSendSms.vue";
import ModalNotesCredit from "@/views/commons/components/first-notes/ModalNotasCredit.vue";
import ModalNotesAll from "@/views/commons/components/first-notes/ModalNotesAll.vue";
import ModalNotesSpecialist from "@/views/commons/components/first-notes/ModalNotesSpecialist.vue";
import ApproveSupervisorModal from "@/views/crm/views/sales-made/components/modals/ApproveSupervisorModal.vue";
import Vue from "vue";

export default {
  name: "SalesMadeNewComponent",
  components: {
    ModalSendSms,
    ModalHistorySms,
    ContractFeeModal,
    UrlModal,
    RevissionModal,
    CreditExpertsModal,
    BusinessModal,
    FilesModal,
    TrackingCapturedByModal,
    InitialPaymentModal,
    TrackingModal,
    FilterSlot,
    vSelect,
    BoostCreditModal,
    GeneralSupportModal,
    KeyBookModal,
    ParagonModal,
    SpecialistModal,
    TaxResearchModal,
    DebtSolutionModal,
    ModalNotesBoost,
    ModalNotesParagon,
    ModalNotesFirst,
    ModalNotesTax,
    ModalNotesCredit,
    ModalNotesAll,
    ModalNotesSpecialist,
    ApproveSupervisorModal,
  },
  props: {
    done: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      items: [],
      selected: [],
      isBusy: false,
      fields: dataFields,
      totalRows: 0,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      basicSearch: true,
      filter: dataFilters,
      startPage: null,
      toPage: null,
      modal: {
        tracking: false,
        initial_payment: false,
        captuerd_by_tracking: false,
        files: false,
        programs: false,
        revission: false,
        url: false,
        contract_fee: false,
        notes: false,
        approveSupervisorModal: false,
        modalSms: false,
      },
      modalData: {
        historySms: {
          id: null,
          leadName: "",
        },
        sendSms: {
          leads_sms: [],
          typesms: null,
          leads_sms_o: [],
          name_leads_arr: [],
        },
        url: {
          client: "",
          program: "",
          amount: 0.0,
        },
        tracking: {
          program: "",
          client: "",
          tabla: "",
        },
        initial_payment: {
          payments: null,
          nameProgram: null,
          nameClient: null,
          type: null,
          editmodal: null,
          statusSale: null,
          sessionId: null,
          valorInitalPaymetn: null,
          feeprops: null,
          modul: null,
          cfeestatus: null,
          idtransaction: null,
          programid: null,
          allcards: null,
          role_id: null,
        },
        capturedByTracking: {
          program: "",
          client: "",
          id: 0,
        },
        files: {
          id: null,
          program: "",
          client: "",
          sale_id: null,
          valorEdit: false,
        },
        programs: {
          programSelected: "",
          typeModal: 0,
          salesClient: {},
        },
        revission: {},
        contractFee: {
          programName: "",
          clientName: "",
          saleId: null,
          id: null,
          initialPaymentStatus: null,
          editModal: false,
          statusSale: null,
          st: null,
        },
        notes: {
          programSelected: "",
          roleId: null,
          notesProgram: null,
          nameProgram: null,
          nameClient: null,
          salesMades: null,
          module: null,
          type: null,
          editModal: false,
          statusSale: null,
          sourcesName: null,
          pack: null,
          created: null,
          originCountry: null,
          idLead: null,
          notSeller: null,
          capturedName: null,
          sellerName: null,
          trackings: null,
          notes_status: null,
          notes_status_new: null,
        },
        approveSupervisorModal: {
          modul: 2,
          typeApprove: 1,
          eventId: "",
        },
      },
      selectAll: false,
      selectedIndex: null,
      newRowFromSelectedIndex: null,
      sellers: [],
      statusEmit: false,
    };
  },
  computed: {
    ...mapState({
      //sellers: (state) => state["crm-store"].sellersCrm,
      captured: (state) => state["crm-store"].capturedCrm,
      // TODO HACERLO GLOBAL
      programs: (state) => state["crm-store"].programs,
      sources: (state) => state["crm-store"].sources,
      sts: (state) => state["crm-store"].states,
      stip: (state) => state["crm-store"].statusip,
      status: (state) => state["crm-store"].statusNewClient,
      statusFilter: (state) => state["crm-store"].statusFilter,
    }),
    ...mapGetters({
      currentUser: "auth/currentUser",
      G_IS_SUPERVISOR: "auth/isSupervisor",
      G_IS_SELLER: "auth/isSeller",
      G_IS_CEO: "auth/isCeo",
      G_MODULE_ID: "auth/moduleId",
      G_USER_ROLE: "auth/userRole",
      G_USER_SESSION: "auth/userSession",
      G_ROLE_ID: "auth/roleId",
    }),
    filteredFields() {
      if (this.done === 0) return this.fields;
      return this.fields.filter((field) => field.key !== "done");
    },
    total() {
      if (this.items[0]) {
        return {
          tcmc: this.items[0].tcmc,
          tcms: this.items[0].tcms,
          tfee: this.items[0].tfee,
          tip: this.items[0].tip,
          tma: this.items[0].tma,
        };
      }
      return {
        tcmc: "0.00",
        tcms: "0.00",
        tfee: "0.00",
        tip: "0.00",
        tma: "0.00",
      };
    },
    subtotal() {
      if (this.items[0]) {
        return {
          tcmc: this.items[0].stcmc,
          tcms: this.items[0].stcms,
          tfee: this.items[0].stfee,
          tip: this.items[0].stip,
          tma: this.items[0].stma,
        };
      }
      return {
        tcmc: "0.00",
        tcms: "0.00",
        tfee: "0.00",
        tip: "0.00",
        tma: "0.00",
      };
    },
  },
  async created() {
    try {
      await Promise.all([
        this.getSellers(),
        this.$store.dispatch("crm-store/getCaptured", {
          module: 2,
          body: {
            roles: "[]",
            type: "1",
          },
        }),
        this.$store.dispatch("crm-store/getPrograms"),
        this.$store.dispatch("crm-store/getSources"),
        this.$store.dispatch("crm-store/getStates"),
      ]);

      this.filter[2].options = this.captured;
      //this.filter[3].options = this.sellers;

      this.filter[4].options = [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ];

      this.filter[5].options = this.sources;
      this.filter[6].options = this.statusFilter;
      this.filter[7].options = this.programs;
      this.filter[8].options = this.stip;
      this.filter[9].options = this.sts;
    } catch (error) {
      console.error(error);
    }

    this.addPaddingTd();
  },
  methods: {
    removeFromTable(saleId) {
      this.statusEmit = true;
      if (this.done == 0) {
        const index = this.items.map((el) => el.id).indexOf(saleId);

        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }
      return this.items;
    },
    async getSellers() {
      let type = this.filter[4].model == null ? "1" : this.filter[4].model;

      const tempSellers = await CrmServices.getSellersCrm(2, {
        roles: "[1,5,2,3]",
        type: type,
      });

      const formatedSellers = tempSellers.map((seller) => ({
        id: seller.id,
        label: seller.user_name,
      }));

      this.sellers = [{ id: 0, label: "All" }];
      this.sellers.push(...formatedSellers);

      this.filter[3].options = this.sellers;
      this.filter[3].model = null;
    },
    async hideInitialPaymentModal(val) {
      this.modal.initial_payment = false;
      if (val) {
        await this.updateRow();
      }
    },
    closeModalApprove() {
      this.modal.approveSupervisorModal = false;
    },
    async returnDone(eventId, sendSupervisor) {
      this.modalData.approveSupervisorModal.eventId = Array.isArray(eventId)
        ? eventId[0]
        : eventId;
      if (this.G_IS_SELLER && sendSupervisor === null) {
        this.modal.approveSupervisorModal = true;
      } else {
        const result = await this.showConfirmSwal(
          "Are you sure?",
          "Are you sure set done this sale"
        );
        if (result.value) {
          try {
            const response = await amgApi.post("/sale/update-sales-set-done", {
              eventId: this.modalData.approveSupervisorModal.eventId,
            });
            if (response.status === 200) {
              this.$refs["new-client-done-table"].refresh();
            }
          } catch (error) {
            this.showErrorSwal(error);
          }
        }
      }
    },
    modalSmsOpen(item) {
      this.modalData.sendSms.leads_sms = [];
      this.modalData.sendSms.typesms = 1;
      this.modalData.sendSms.leads_sms_o = [];
      this.modalData.sendSms.leads_sms_o.push(item.lead_id);
      this.modalData.sendSms.name_leads_arr = [
        { name: item.client, id: item.lead_id },
      ];
      this.modal.modalSms = true;
    },
    modalSmssOpen() {
      this.modalData.sendSms.typesms = 0;
      this.modalData.sendSms.name_leads_arr = this.selected.map((el) => ({
        name: el.client,
        id: el.lead_id,
      }));
      this.modalData.sendSms.leads_sms = this.selected.map((el) => el.lead_id);
      this.modal.modalSms = true;
    },
    modalSmsClose() {
      this.modal.modalSms = false;
    },
    modalHistorySmsOpen(item) {
      this.modalData.historySms.leadName = item.client;
      this.modalData.historySms.id = item.lead_id;
      this.$bvModal.show("modal-history-sms");
    },
    async search(ctx) {
      try {
        let sortBy = 11;
        let sortDirection = "desc";
        if (ctx.sortBy === "client") {
          sortBy = 0;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        } else if (ctx.sortBy === "creates") {
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        } else if (ctx.sortBy === "approved") {
          sortBy = 12;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        }

        let filterPrograms =
          this.filter[7].model != null ? this.filter[7].model.toString() : "";
        let filterSourceName =
          this.filter[5].model != null ? this.filter[5].model.toString() : "";
        let filterStatusSeller =
          this.filter[4].model != null ? this.filter[4].model : 1;

        const data = await CrmService.getSaleMade(
          {
            text: this.filterPrincipal.model,
            status: this.filter[6].model,
            program: filterPrograms,
            state_h: this.filter[9].model,
            from: this.filter[0].model,
            to: this.filter[1].model,
            orderby: sortBy,
            order: sortDirection,
            captured: this.filter[2].model,
            seller: this.filter[3].model,
            status_seller: filterStatusSeller,
            salemade: 0,
            rolsession: this.currentUser.role_id,
            statusip: this.filter[8].model,
            sourcesname_id: filterSourceName,
            done: this.done,
            per_page: ctx.perPage,
          },
          ctx.currentPage
        );
        this.startPage = data.from;
        this.toPage = data.to;
        if (this.totalRows !== data.total) this.totalRows = data.total;
        const selectedIds = this.selected.map((s) => s.id);
        let index = 0;
        while (selectedIds.length > 0 && index < data.data.length) {
          if (selectedIds.includes(data.data[index].id)) {
            const { id } = data.data[index];
            data.data[index].selected = true;
            const deleted = selectedIds.findIndex((s) => s === id);
            if (deleted !== -1) selectedIds.splice(deleted, 1);
          }
          index += 1;
        }
        this.items = data.data;
        return this.items;
      } catch (e) {
        //this.showToast("danger", "top-right", "Error", "XIcon", e);
        return [];
      }
    },
    openContractFeeModal(data, index) {
      this.selectedIndex = index;
      if (
        data.user_id == this.currentUser.user_id ||
        this.G_IS_CEO ||
        this.G_IS_SUPERVISOR ||
        this.isCoordinator
      ) {
        this.modalData.contractFee.editModal = true;
      } else {
        this.modalData.contractFee.editModal = false;
      }
      this.modalData.contractFee.statusSale = data.status;
      this.modalData.contractFee.clientName = data.client;
      this.modalData.contractFee.programName = data.program;
      this.modalData.contractFee.id = data.lead_id;
      this.modalData.contractFee.saleId = data.id;
      this.modalData.contractFee.initialPaymentStatus =
        data.initial_payment_status;
      this.modal.contract_fee = true;
    },

    // Notes
    async notesModal(data, index) {
      this.addPreloader();
      this.modalData.notes.capturedName = data.captured;
      this.modalData.notes.sellerName = data.seller;
      this.modalData.notes.trackings = data.trackings;
      this.modalData.notes.nameProgram = data.program;
      this.modalData.notes.nameClient = data.client;
      this.modalData.notes.statusSale = data.status;
      this.modalData.notes.sourcesName = data.sourcesname;
      this.modalData.notes.pack = data.pack;
      this.modalData.notes.originCountry = data.origin_country;
      this.modalData.notes.idLead = data.lead_id;
      this.modalData.notes.created = data.creates;
      this.modalData.notes.saleId = data.id;
      this.modalData.notes.module = this.G_MODULE_ID;
      this.modalData.notes.rolId = this.G_ROLE_ID;
      this.modalData.notes.notes_status = data.notes_status;
      this.modalData.notes.notes_status_new = data.notes_status_new;
      this.modalData.notes.editModal =
        this.G_IS_CEO ||
        this.G_IS_SUPERVISOR ||
        this.isCoordinator ||
        this.G_USER_SESSION == data.user_id;
      this.modalData.notes.notSeller =
        data.user_id != this.G_USER_SESSION && this.G_IS_SELLER;

      //If is not seller,but is Coordinator
      if (this.isCoordinator) {
        this.modalData.notes.notSeller = false;
      }
      this.openModalNotes(data.creates, data.program_id, index);
    },
    openModalNotes(created, program, index) {
      this.selectedIndex = index;
      switch (true) {
        case created >= "2020-05-28" && program == 1:
          console.log("1");
          this.modalData.notes.programSelected = "ModalNotesFirst"; // ready
          break;
        case created >= "2020-10-29" && program == 2:
          console.log("2");
          this.modalData.notes.programSelected = "ModalNotesBoost"; // ready
          break;
        case created >= "2021-03-04" && program == 3:
          console.log("3");
          this.modalData.notes.programSelected = "ModalNotesCredit"; // ready
          break;
        case created >= "2020-09-24" && program == 5:
          console.log("4");
          this.modalData.notes.programSelected = "ModalNotesTax"; // ready
          break;
        case created >= "2020-10-23" && program == 7:
          console.log("5");
          this.modalData.notes.programSelected = "ModalNotesSpecialist"; // ready
          break;
        case program == 9:
          console.log("6");
          this.modalData.notes.programSelected = "ModalNotesParagon"; // ready
          break;
        default:
          console.log("7");
          this.modalData.notes.programSelected = "ModalNotesAll"; // next
          break;
      }

      this.modal.notes = true;
    },
    async closeModalNotes(status) {
      this.modal.notes = false;
      if (status) {
        await this.updateRow();
        this.removePreloader();
        this.showSuccessSwal("OPERATION SUCCESSFULLY");
      }
    },
    openUrlModal(data) {
      this.modalData.url.client = data.client;
      this.modalData.url.program = data.program;
      this.modalData.url.selectedLead = data;
      this.modal.url = true;
    },
    revisionSale(state, data, index) {
      this.selectedIndex = index;
      this.modalData.revission.nameProgram = data.program;
      this.modalData.revission.idProgram = data.program_id;
      this.modalData.revission.nameClient = data.client;
      this.modalData.revission.type = state;
      this.modalData.revission.idsales = data.id;
      this.modalData.revission.initialPayment = data.initial_payment_status;
      this.modalData.revission.account = data.account;
      this.modalData.revission.leadId = data.lead_id;
      this.modalData.revission.datevent = data.event_date;
      this.modalData.revission.sellerName = data.seller;
      this.modalData.revission.language = data.language;
      this.modalData.revission.user_id = this.currentUser.user_id;
      this.modalData.revission.last_name = data.last_name;
      this.modal.revission = true;
    },
    async updateRow() {
      this.newRowFromSelectedIndex = await window.amgApi.post(
        "/sales-made/get-sale-made-by-sale-id",
        { saleId: this.items[this.selectedIndex].id }
      );
      const newRow = this.newRowFromSelectedIndex.data[0];
      const keysNewRow = Object.keys(newRow);
      const keysOldRow = Object.keys(this.items[this.selectedIndex]);
      keysNewRow.forEach((key) => {
        if (keysOldRow.includes(key)) {
          Vue.set(this.items[this.selectedIndex], key, newRow[key]);
        }
      });
    },
    async hideModalProgram(refresh) {
      if (refresh) {
        await this.updateRow();
      }
      this.modalData.programs.programSelected = "";
      this.modal.programs = false;
      this.removePreloader();
    },
    openTrackingModal(program, client, tabla) {
      this.modalData.tracking.program = program;
      this.modalData.tracking.client = client;
      if (tabla) {
        this.modalData.tracking.tabla = JSON.parse(tabla);
        this.modal.tracking = true;
      }
    },
    openTrackingCapturedByModal(program, client, id, type) {
      this.modalData.capturedByTracking.client = client;
      this.modalData.capturedByTracking.program = program;
      this.modalData.capturedByTracking.id = id;
      this.modalData.capturedByTracking.type = type;
      if (type === 1) this.modalData.capturedByTracking.tittle = "CAPTURED BY";
      else if (type === 2) this.modalData.capturedByTracking.tittle = "SELLER";
      else if (type === 3) this.modalData.capturedByTracking.tittle = "FEE";
      this.modal.captuerd_by_tracking = true;
    },
    async openInitialPaymentModal(data, index) {
      try {
        this.selectedIndex = index;
        this.addPreloader();
        this.modalData.initial_payment.programid = data.program_id;
        this.modalData.initial_payment.sessionId = this.currentUser.user_id;
        this.modalData.initial_payment.cfeestatus = data.contract_fee_status;
        this.modalData.initial_payment.id_transaction = data.transaction_id;
        this.modalData.initial_payment.editmodal =
          data.user_id == this.currentUser.user_id ||
          this.isCeo ||
          this.isSupervisor ||
          this.isCoordinator;
        this.modalData.initial_payment.statusSale = data.status;
        this.modalData.initial_payment.nameProgram = data.program;
        this.modalData.initial_payment.nameClient = data.client;
        this.modalData.initial_payment.valorInitalPaymetn =
          data.initial_payment_status;
        this.modalData.initial_payment.feeprops = data.fee;
        const cards = await amgApi.post("/clients/search-cards-clients", {
          id: data.lead_id,
        });
        if (cards.status === 200) {
          this.modalData.initial_payment.allcards = cards.data;
        }
        const response = await amgApi.post(
          "/sales-made/get-payments-sales-made",
          { id: data.id }
        );
        if (response.status === 200) {
          [this.modalData.initial_payment.payments] = response.data;
        }
        this.modalData.initial_payment.modul = 2;
        this.modalData.initial_payment.role_id = this.currentUser.role_id;
        this.modal.initial_payment = true;
      } catch (error) {
        this.showErrorSwal();
      }
    },
    openModalProgram(data, index) {
      this.selectedIndex = index;
      switch (data.program_id) {
        case 1:
          this.modalData.programs.programSelected = "business-modal";
          break;
        case 2:
          this.modalData.programs.programSelected = "boost-credit-modal";
          break;
        case 3:
          this.modalData.programs.programSelected = "credit-experts-modal";
          break;
        case 4:
          this.modalData.programs.programSelected = "debt-solution-modal";
          break;
        case 5:
          this.modalData.programs.programSelected = "tax-research-modal";
          break;
        case 6:
          this.modalData.programs.programSelected = "general-support-modal";
          break;
        case 7:
          this.modalData.programs.programSelected = "specialist-modal";
          break;
        case 8:
          this.modalData.programs.programSelected = "key-book-modal";
          break;
        case 9:
          this.modalData.programs.programSelected = "paragon-modal";
          break;
        default:
          break;
      }
      if (this.modalData.programs.programSelected !== "") {
        this.modalData.programs.typeModal = data.haveRates == 1 ? 2 : 1;
        this.modalData.programs.salesClient = data;
        this.modal.programs = true;
      }
    },
    openFilesModal(
      id,
      program,
      client,
      saleId,
      status,
      sellerId,
      programId,
      eventDate
    ) {
      this.modalData.files.id = id;
      this.modalData.files.program = program;
      this.modalData.files.client = client;
      this.modalData.files.sale_id = saleId;
      this.modalData.files.programId = programId;
      this.modalData.files.event_date = eventDate;
      const isCeoOrSupervisor =
        this.currentUser.role_id == "1" || this.currentUser.role_id == "2";
      const statusNotInRevisionOrApproved = !(status == "4" || status == "2");
      if (
        (this.currentUser.user_id == sellerId || isCeoOrSupervisor) &&
        statusNotInRevisionOrApproved
      ) {
        this.modalData.files.valorEdit = true;
      }
      this.modal.files = true;
    },
    selectedRow(data) {
      const index = this.selected.findIndex((select) => select.id === data.id);
      if (data.selected === true && index === -1) this.selected.push(data);
      else if (data.selected === false && index !== -1)
        this.selected.splice(index, 1);
    },
    selectedAll() {
      if (this.selectAll) this.items.forEach((item) => (item.selected = true));
      else this.items.forEach((item) => (item.selected = false));
    },
    async saveNewCaptured(captured, capturedNew, userId, user) {
      // eslint-disable-next-line no-param-reassign
      const [capturedNew2] = this.captured.filter(
        (val) => val.id === capturedNew
      );
      if (captured === capturedNew2.label) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else {
        this.$store.commit("app/SET_LOADING", true);
        try {
          const response = await CrmService.saveNewCaptured({
            capt: capturedNew2.id,
            id: userId,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Se actualizo satisfactoriamente"
            );
          } else return;
          // eslint-disable-next-line no-param-reassign
          user.capturedNew = capturedNew2.id;
          // eslint-disable-next-line no-param-reassign
          user.captured_id = capturedNew2.id;
          // eslint-disable-next-line no-param-reassign
          user.captured = capturedNew2.label;
          // eslint-disable-next-line no-param-reassign
          user.editCaptured = false;
          this.removePreloader();
        } catch (error) {
          this.showToast("danger", "top-right", "Error", "XIcon", error);
          this.removePreloader();
        }
      }
    },
    async saveNewSeller(seller, sellerNew, userId, user) {
      const [sellerNew2] = this.sellers.filter((val) => val.id === sellerNew);
      if (seller === sellerNew2.label) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else {
        this.addPreloader();
        try {
          const response = await CrmService.saveNewSeller({
            sel: sellerNew2.id,
            id: userId,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Se actualizo satisfactoriamente"
            );
          } else return;
          // eslint-disable-next-line no-param-reassign
          user.sellerNew = sellerNew2.id;
          // eslint-disable-next-line no-param-reassign
          user.seller_id = sellerNew2.id;
          // eslint-disable-next-line no-param-reassign
          user.seller = sellerNew2.label;
          // eslint-disable-next-line no-param-reassign
          user.editSeller = false;
          this.removePreloader();
        } catch (error) {
          this.showToast("danger", "top-right", "Error", "XIcon", error);
          this.removePreloader();
        }
      }
    },
    async saveNewFee(fee, feeNew, userId, user) {
      if (fee === feeNew) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "You can't select the same captured"
        );
      } else {
        this.$store.commit("app/SET_LOADING", true);
        try {
          const response = await CrmService.saveNewFee({
            fee: feeNew,
            id: userId,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showSuccessSwal();
          } else return;
          // eslint-disable-next-line no-param-reassign
          user.fee = user.feeNew;
          // eslint-disable-next-line no-param-reassign
          user.feeNew = user.fee;
          // eslint-disable-next-line no-param-reassign
          user.editFee = false;
          this.$store.commit("app/SET_LOADING", false);
        } catch (error) {
          this.showToast("danger", "top-right", "Error", "XIcon", error);
          this.$store.commit("app/SET_LOADING", false);
        }
      }
    },
    async annulSale(sale) {
      try {
        const swal = await this.showConfirmSwal(
          "Are you sure?",
          "Are you sure annuled this sale"
        );
        if (swal.isConfirmed) {
          const response = await amgApi.post("/sales-made/annul-sale", {
            id: sale.id,
            id_event: sale.event_id,
            user: this.currentUser.user_id,
          });
          if (response.status === 200) {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Your sale has been annulled successfully"
            );
            this.$refs["new-client-done-table"].refresh();
          } else {
            this.showErrorSwal();
          }
        }
      } catch (error) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "Error",
          "XIcon",
          "Some error, please try again or contact to support"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.not-pointer {
  pointer-events: none;
  opacity: 0.4;
}
.m-10px {
  margin: 2px;
}

.py-px {
  padding: 12px !important;
}

.mt-07 {
  margin-top: 7px;
}

.ml-07 {
  margin-left: 7px;
}
</style>
