<template>
  <b-card
    no-body
    :class="
      tabSupervisorCrm
        ? 'border-top-primary border-3 box-shadow-3 rounded-bottom border-table-radius pb-1'
        : 'pb-2'
    "
  >
    <CommissionsHeader
      @search="searchCommissions(true)"
      @update-percentage="updatePercentageDepartment"
      :tab="tab"
      :isManagement="isManagement"
      :class="[isSeller ? 'mt-2 ml-1 mr-1' : '']"
    />

    <div :class="['mt-1', isSeller ? 'margin-is-seller' : '']">
      <div v-if="!commissions" class="text-center text-primary my-4">
        <b-spinner class="align-middle mr-1" />
        <strong>Loading ...</strong>
      </div>
      <b-table-simple
        v-else
        responsive
        sticky-header="74vh"
        no-border-collapse
        hover
        bordered
      >
        <b-thead>
          <b-tr class="width-th">
            <b-th style="width: 100px !important">User</b-th>
            <b-th v-if="isCrm || isDepartment"></b-th>
            <template v-if="halfYear">
              <b-th>
                Jan
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.january_percentage }}%</span
                >
              </b-th>
              <b-th>
                Feb
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.february_percentage }}%</span
                >
              </b-th>
              <b-th>
                Mar
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.march_percentage }}%</span
                >
              </b-th>
              <b-th>
                Apr
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.april_percentage }}%</span
                >
              </b-th>
              <b-th>
                May
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.may_percentage }}%</span
                >
              </b-th>
              <b-th>
                Jun
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.june_percentage }}%</span
                >
              </b-th>
            </template>
            <template v-else>
              <b-th>
                Jul
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.july_percentage }}%</span
                >
              </b-th>
              <b-th>
                Aug
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.august_percentage }}%</span
                >
              </b-th>
              <b-th>
                Sep
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.september_percentage }}%</span
                >
              </b-th>
              <b-th>
                Oct
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.october_percentage }}%</span
                >
              </b-th>
              <b-th>
                Nov
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.november_percentage }}%</span
                >
              </b-th>
              <b-th>
                Dic
                <span v-if="isCrm" class="float-right"
                  >{{ percentages.december_percentage }}%</span
                >
              </b-th>
            </template>
          </b-tr>
        </b-thead>

        <b-tbody>
          <b-tr v-for="(item, index) in commissions" :key="item.user_id">
            <b-td>
              <div class="font-weight-bolder text-dark">
                {{ item.user_name }}
              </div>
              <div v-if="isSupervisorCrm" class="color-gray-m fs10">
                {{ item.main_name }}
              </div>
            </b-td>
            <b-td v-if="isCrm">
              <div>
                <div class="font-weight-bold">Generated:</div>
                <div
                  class="margin-t-pay font-weight-bold"
                  v-if="item.role_id != 2"
                >
                  % to Pay:
                </div>
                <div class="margin-t-pay font-weight-bold">To Pay:</div>
              </div>
            </b-td>
            <b-td v-if="isDepartment">
              <div class="font-weight-bold">Add/Change:</div>
              <div class="margin-t-pay font-weight-bold">CRM:</div>
              <div class="margin-t-pay font-weight-bold">Total:</div>
            </b-td>
            <template v-if="halfYear">
              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'jan_percentage_pay')"
                  @find="findCommissions($event, '01', item, 'January')"
                  @pay="
                    payCommissions(
                      $event,
                      '01',
                      item,
                      item.ps_jan,
                      item.jan_to_pay,
                      item.jan,
                      'ps_jan',
                      'January'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_jan', item)"
                  @cancel="cancelPercentageUser(index, 'edit_jan', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_jan',
                      'jan_percentage_pay',
                      'jan_to_pay',
                      '01',
                      item
                    )
                  "
                  :editPercentage="item.edit_jan == 0 ? false : true"
                  :info="{
                    ps: item.ps_jan,
                    to_pay: item.jan_to_pay,
                    percentage_pay: item.jan_percentage_pay,
                    month_pay: item.jan,
                    monthUser: `January-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-01-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'jan'"
                  :year="year"
                ></commissions-monthly>
              </b-td>

              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'feb_percentage_pay')"
                  @find="findCommissions($event, '02', item, 'February')"
                  @pay="
                    payCommissions(
                      $event,
                      '02',
                      item,
                      item.ps_feb,
                      item.feb_to_pay,
                      item.feb,
                      'ps_feb',
                      'February'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_feb', item)"
                  @cancel="cancelPercentageUser(index, 'edit_feb', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_feb',
                      'feb_percentage_pay',
                      'feb_to_pay',
                      '02',
                      item
                    )
                  "
                  :editPercentage="item.edit_feb == 0 ? false : true"
                  :info="{
                    ps: item.ps_feb,
                    to_pay: item.feb_to_pay,
                    percentage_pay: item.feb_percentage_pay,
                    month_pay: item.feb,
                    monthUser: `February-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-02-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'feb'"
                ></commissions-monthly>
              </b-td>

              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'mar_percentage_pay')"
                  @find="findCommissions($event, '03', item, 'March')"
                  @pay="
                    payCommissions(
                      $event,
                      '03',
                      item,
                      item.ps_mar,
                      item.mar_to_pay,
                      item.mar,
                      'ps_mar',
                      'March'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_mar', item)"
                  @cancel="cancelPercentageUser(index, 'edit_mar', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_mar',
                      'mar_percentage_pay',
                      'mar_to_pay',
                      '03',
                      item
                    )
                  "
                  :editPercentage="item.edit_mar == 0 ? false : true"
                  :info="{
                    ps: item.ps_mar,
                    to_pay: item.mar_to_pay,
                    percentage_pay: item.mar_percentage_pay,
                    month_pay: item.mar,
                    monthUser: `March-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-03-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'mar'"
                ></commissions-monthly>
              </b-td>

              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'apr_percentage_pay')"
                  @find="findCommissions($event, '04', item, 'April')"
                  @pay="
                    payCommissions(
                      $event,
                      '04',
                      item,
                      item.ps_apr,
                      item.apr_to_pay,
                      item.apr,
                      'ps_apr',
                      'April'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_apr', item)"
                  @cancel="cancelPercentageUser(index, 'edit_apr', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_apr',
                      'apr_percentage_pay',
                      'apr_to_pay',
                      '04',
                      item
                    )
                  "
                  :editPercentage="item.edit_apr == 0 ? false : true"
                  :info="{
                    ps: item.ps_apr,
                    to_pay: item.apr_to_pay,
                    percentage_pay: item.apr_percentage_pay,
                    month_pay: item.apr,
                    monthUser: `April-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-04-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'apr'"
                ></commissions-monthly>
              </b-td>

              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'may_percentage_pay')"
                  @find="findCommissions($event, '05', item, 'May')"
                  @pay="
                    payCommissions(
                      $event,
                      '05',
                      item,
                      item.ps_may,
                      item.may_to_pay,
                      item.may,
                      'ps_may',
                      'May'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_may', item)"
                  @cancel="cancelPercentageUser(index, 'edit_may', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_may',
                      'may_percentage_pay',
                      'may_to_pay',
                      '05',
                      item
                    )
                  "
                  :editPercentage="item.edit_may == 0 ? false : true"
                  :info="{
                    ps: item.ps_may,
                    to_pay: item.may_to_pay,
                    percentage_pay: item.may_percentage_pay,
                    month_pay: item.may,
                    monthUser: `May-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-05-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'may'"
                ></commissions-monthly>
              </b-td>

              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'jun_percentage_pay')"
                  @find="findCommissions($event, '06', item, 'June')"
                  @pay="
                    payCommissions(
                      $event,
                      '06',
                      item,
                      item.ps_jun,
                      item.jun_to_pay,
                      item.jun,
                      'ps_jun',
                      'June'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_jun', item)"
                  @cancel="cancelPercentageUser(index, 'edit_jun', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_jun',
                      'jun_percentage_pay',
                      'jun_to_pay',
                      '06',
                      item
                    )
                  "
                  :editPercentage="item.edit_jun == 0 ? false : true"
                  :info="{
                    ps: item.ps_jun,
                    to_pay: item.jun_to_pay,
                    percentage_pay: item.jun_percentage_pay,
                    month_pay: item.jun,
                    monthUser: `June-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-06-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'jun'"
                ></commissions-monthly>
              </b-td>
            </template>

            <template v-else>
              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'jul_percentage_pay')"
                  @find="findCommissions($event, '07', item, 'July')"
                  @pay="
                    payCommissions(
                      $event,
                      '07',
                      item,
                      item.ps_jul,
                      item.jul_to_pay,
                      item.jun,
                      'ps_jul',
                      'July'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_jul', item)"
                  @cancel="cancelPercentageUser(index, 'edit_jul', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_jul',
                      'jul_percentage_pay',
                      'jul_to_pay',
                      '07',
                      item
                    )
                  "
                  :editPercentage="item.edit_jul == 0 ? false : true"
                  :info="{
                    ps: item.ps_jul,
                    to_pay: item.jul_to_pay,
                    percentage_pay: item.jul_percentage_pay,
                    month_pay: item.jul,
                    monthUser: `July-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-07-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'jul'"
                ></commissions-monthly>
              </b-td>
              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'aug_percentage_pay')"
                  @find="findCommissions($event, '08', item, 'August')"
                  @pay="
                    payCommissions(
                      $event,
                      '08',
                      item,
                      item.ps_aug,
                      item.aug_to_pay,
                      item.aug,
                      'ps_aug',
                      'August'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_aug', item)"
                  @cancel="cancelPercentageUser(index, 'edit_aug', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_aug',
                      'aug_percentage_pay',
                      'aug_to_pay',
                      '08',
                      item
                    )
                  "
                  :editPercentage="item.edit_aug == 0 ? false : true"
                  :info="{
                    ps: item.ps_aug,
                    to_pay: item.aug_to_pay,
                    percentage_pay: item.aug_percentage_pay,
                    month_pay: item.aug,
                    monthUser: `August-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-08-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'aug'"
                ></commissions-monthly>
              </b-td>
              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'sep_percentage_pay')"
                  @find="findCommissions($event, '09', item, 'September')"
                  @pay="
                    payCommissions(
                      $event,
                      '09',
                      item,
                      item.ps_sep,
                      item.sep_to_pay,
                      item.sep,
                      'ps_sep',
                      'September'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_sep', item)"
                  @cancel="cancelPercentageUser(index, 'edit_sep', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_sep',
                      'sep_percentage_pay',
                      'sep_to_pay',
                      '09',
                      item
                    )
                  "
                  :editPercentage="item.edit_sep == 0 ? false : true"
                  :info="{
                    ps: item.ps_sep,
                    to_pay: item.sep_to_pay,
                    percentage_pay: item.sep_percentage_pay,
                    month_pay: item.sep,
                    monthUser: `September-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-09-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'sep'"
                ></commissions-monthly>
              </b-td>
              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'oct_percentage_pay')"
                  @find="findCommissions($event, '10', item, 'October')"
                  @pay="
                    payCommissions(
                      $event,
                      '10',
                      item,
                      item.ps_oct,
                      item.oct_to_pay,
                      item.oct,
                      'ps_oct',
                      'September'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_oct', item)"
                  @cancel="cancelPercentageUser(index, 'edit_oct', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_oct',
                      'oct_percentage_pay',
                      'oct_to_pay',
                      '10',
                      item
                    )
                  "
                  :editPercentage="item.edit_oct == 0 ? false : true"
                  :info="{
                    ps: item.ps_oct,
                    to_pay: item.oct_to_pay,
                    percentage_pay: item.oct_percentage_pay,
                    month_pay: item.oct,
                    monthUser: `October-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-10-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'oct'"
                ></commissions-monthly>
              </b-td>
              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'nov_percentage_pay')"
                  @find="findCommissions($event, '11', item, 'November')"
                  @pay="
                    payCommissions(
                      $event,
                      '11',
                      item,
                      item.ps_nov,
                      item.nov_to_pay,
                      item.nov,
                      'ps_nov',
                      'November'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_nov', item)"
                  @cancel="cancelPercentageUser(index, 'edit_nov', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_nov',
                      'nov_percentage_pay',
                      'nov_to_pay',
                      '11',
                      item
                    )
                  "
                  :editPercentage="item.edit_nov == 0 ? false : true"
                  :info="{
                    ps: item.ps_nov,
                    to_pay: item.nov_to_pay,
                    percentage_pay: item.nov_percentage_pay,
                    month_pay: item.nov,
                    monthUser: `November-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-11-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'nov'"
                ></commissions-monthly>
              </b-td>
              <b-td>
                <commissions-monthly
                  @max="maxPercentageUser($event, index, 'dec_percentage_pay')"
                  @find="findCommissions($event, '12', item, 'December')"
                  @pay="
                    payCommissions(
                      $event,
                      '12',
                      item,
                      item.ps_dec,
                      item.dec_to_pay,
                      item.dec,
                      'ps_dec',
                      'December'
                    )
                  "
                  @edit="editPercentageUser(index, 'edit_dec', item)"
                  @cancel="cancelPercentageUser(index, 'edit_dec', item)"
                  @update="
                    updatePercentageUser(
                      $event,
                      index,
                      'edit_dec',
                      'dec_percentage_pay',
                      'dec_to_pay',
                      '12',
                      item
                    )
                  "
                  :editPercentage="item.edit_dec == 0 ? false : true"
                  :info="{
                    ps: item.ps_dec,
                    to_pay: item.dec_to_pay,
                    percentage_pay: item.dec_percentage_pay,
                    month_pay: item.dec,
                    monthUser: `December-${item.user_name}`,
                    rol: item.role_id,
                    monthYear: `${year}-12-01`,
                  }"
                  :halfYear="halfYear"
                  :tab="tab"
                  :isManagement="isManagement"
                  :commissionsDepartments="isDepartment ? item.commissions : []"
                  :month="'dec'"
                ></commissions-monthly>
              </b-td>
            </template>
          </b-tr>
        </b-tbody>
        <b-tfoot v-if="isSupervisor || isCeo">
          <b-tr>
            <b-th class="bgLightDark">Total Generated</b-th>
            <b-th class="bgLightDark" v-if="isCrm || isDepartment"></b-th>
            <template v-if="halfYear">
              <b-th class="bgLightDark">
                <span v-if="t_jan != '0.00'" class="footer-span"
                  >$ {{ t_jan }}</span
                >
                <span v-if="t_jan == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_feb != '0.00'" class="footer-span"
                  >$ {{ t_feb }}</span
                >
                <span v-if="t_feb == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_mar != '0.00'" class="footer-span"
                  >$ {{ t_mar }}</span
                >
                <span v-if="t_mar == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_apr != '0.00'" class="footer-span"
                  >$ {{ t_apr }}</span
                >
                <span v-if="t_apr == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_may != '0.00'" class="footer-span"
                  >$ {{ t_may }}</span
                >
                <span v-if="t_may == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_jun != '0.00'" class="footer-span"
                  >$ {{ t_jun }}</span
                >
                <span v-if="t_jun == '0.00'" class="footer-span">-</span>
              </b-th>
            </template>
            <template v-else>
              <b-th class="bgLightDark">
                <span v-if="t_jul != '0.00'" class="footer-span"
                  >$ {{ t_jul }}</span
                >
                <span v-if="t_jul == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_aug != '0.00'" class="footer-span"
                  >$ {{ t_aug }}</span
                >
                <span v-if="t_aug == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_sep != '0.00'" class="footer-span"
                  >$ {{ t_sep }}</span
                >
                <span v-if="t_sep == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_oct != '0.00'" class="footer-span"
                  >$ {{ t_oct }}</span
                >
                <span v-if="t_oct == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_nov != '0.00'" class="footer-span"
                  >$ {{ t_nov }}</span
                >
                <span v-if="t_nov == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_dec != '0.00'" class="footer-span"
                  >$ {{ t_dec }}</span
                >
                <span v-if="t_dec == '0.00'" class="footer-span">-</span>
              </b-th>
            </template>
          </b-tr>
          <b-tr v-if="isCrm">
            <b-th class="bgLightDark">Total To Pay</b-th>
            <b-th v-if="isCrm || isDepartment" class="bgLightDark"></b-th>
            <template v-if="halfYear">
              <b-th class="bgLightDark">
                <span v-if="t_feb != '0.00'" class="footer-span"
                  >$ {{ t_jan_pay }}</span
                >
                <span v-if="t_jan_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_feb_pay != '0.00'" class="footer-span"
                  >$ {{ t_feb_pay }}</span
                >
                <span v-if="t_feb_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_mar_pay != '0.00'" class="footer-span"
                  >$ {{ t_mar_pay }}</span
                >
                <span v-if="t_mar_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_apr_pay != '0.00'" class="footer-span"
                  >$ {{ t_apr_pay }}</span
                >
                <span v-if="t_apr_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_may_pay != '0.00'" class="footer-span"
                  >$ {{ t_may_pay }}</span
                >
                <span v-if="t_may_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_jun_pay != '0.00'" class="footer-span"
                  >$ {{ t_jun_pay }}</span
                >
                <span v-if="t_jun_pay == '0.00'" class="footer-span">-</span>
              </b-th>
            </template>
            <template v-else>
              <b-th class="bgLightDark">
                <span v-if="t_jul_pay != '0.00'" class="footer-span"
                  >$ {{ t_jul_pay }}</span
                >
                <span v-if="t_jul_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_aug_pay != '0.00'" class="footer-span"
                  >$ {{ t_aug_pay }}</span
                >
                <span v-if="t_aug_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_sep_pay != '0.00'" class="footer-span"
                  >$ {{ t_sep_pay }}</span
                >
                <span v-if="t_sep_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_oct_pay != '0.00'" class="footer-span"
                  >$ {{ t_oct_pay }}</span
                >
                <span v-if="t_oct_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_nov_pay != '0.00'" class="footer-span"
                  >$ {{ t_nov_pay }}</span
                >
                <span v-if="t_nov_pay == '0.00'" class="footer-span">-</span>
              </b-th>
              <b-th class="bgLightDark">
                <span v-if="t_dec_pay != '0.00'" class="footer-span"
                  >$ {{ t_dec_pay }}</span
                >
                <span v-if="t_dec_pay == '0.00'" class="footer-span">-</span>
              </b-th>
            </template>
          </b-tr>
        </b-tfoot>
      </b-table-simple>
    </div>
    <ModalCommissionsDetails
      v-if="modalDetails"
      :showModal="modalDetails"
      :info="infoDetails"
      @hide-modal="hideModalDetails"
    />
    <ModalCommissionsPayment
      v-if="modalPayment"
      :showModal="modalPayment"
      :info="infoPayment"
      @hide-modal="hideModalPayment"
    />
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import ButtonsEdit from "@/views/commons/utilities/ButtonsEdit";
import OverlayWait from "@/views/commons/utilities/OverlayWait";
import CommissionsHeader from "@/views/commons/components/commissions/CommissionsHeader.vue";
import CommissionsMonthly from "@/views/commons/components/commissions/CommissionsMonthly";
import ModalCommissionsDetails from "@/views/commons/components/commissions/modals/modal-details/ModalCommissionsDetails";
import ModalCommissionsPayment from "@/views/commons/components/commissions/modals/modal-payment/ModalCommissionsPayment";
import moment from "moment";
import commissionsService from "@/views/commons/components/commissions/services/commissions.service";
export default {
  name: "CommissionsComponent",
  components: {
    ButtonsEdit,
    OverlayWait,
    CommissionsHeader,
    CommissionsMonthly,
    ModalCommissionsDetails,
    ModalCommissionsPayment,
  },
  directives: {
    Ripple,
  },
  props: {
    module: {
      type: Number,
      default: null,
    },
    tab: {
      type: String,
      default: null,
    },
    tabSupervisorCrm: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    //when change tab supervisorCrm, set to null subProgram
    this.$store.commit("commissions-store/SET_MODULE_PROGRAM", null);
  },
  data() {
    return {
      sessionUser: null,
      commissions: null,
      returnPercent: null,
      editPercent: false,
      user_id: null,
      supervisorCrm: 0,
      users: "",
      user_name: "",
      modal: false,
      month: "",
      ps_month: "",
      role_id: "",
      approve_by: "",
      paid_state: "",
      module_id: null,
      type: "",
      modalm: false,
      module_name: "",
      percentages: null,
      amountTotal: null,
      showOverlay: false,
      modalDetails: false,
      modalPayment: false,
      infoDetails: null,
      infoPayment: null,
    };
  },
  created() {
    this.getCurrentMonth();
    this.getDepartmentPercentage();
    this.searchCommissions();
  },

  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      isCeo: "auth/isCeo",
      isSupervisor: "auth/isSupervisor",
      userSession: "auth/userSession",
      token: "auth/token",
      currentBreakPoint: "app/currentBreakPoint",
      bigWindow: "app/bigWindow",
      year: "commissions-store/year",
      halfYear: "commissions-store/halfYear",
      percentApartment: "commissions-store/percentApartment",
      skin: "appConfig/skin",
      loading: "commissions-store/loading",
      moduleProgram: "commissions-store/moduleProgram",
      isSeller: "auth/isSeller",
    }),

    isManagement() {
      return this.module == 16;
    },
    isDepartment() {
      return this.module_id != 2 && this.module_id != 4;
    },
    isCrm() {
      return this.tab == "crm";
    },
    isSupervisorCrm() {
      return this.tab == "supervisorCrm";
    },
    //Total for each Month
    t_jan() {
      return this.sumTotal("jan");
    },
    t_jan_pay() {
      return this.sumTotal("jan_to_pay");
    },

    t_feb() {
      return this.sumTotal("feb");
    },
    t_feb_pay() {
      return this.sumTotal("feb_to_pay");
    },
    t_mar() {
      return this.sumTotal("mar");
    },
    t_mar_pay() {
      return this.sumTotal("mar_to_pay");
    },
    t_apr() {
      return this.sumTotal("apr");
    },
    t_apr_pay() {
      return this.sumTotal("apr_to_pay");
    },
    t_may() {
      return this.sumTotal("may");
    },
    t_may_pay() {
      return this.sumTotal("may_to_pay");
    },
    t_jun() {
      return this.sumTotal("jun");
    },
    t_jun_pay() {
      return this.sumTotal("jun_to_pay");
    },
    t_jul() {
      return this.sumTotal("jul");
    },
    t_jul_pay() {
      return this.sumTotal("jul_to_pay");
    },
    t_aug() {
      return this.sumTotal("aug");
    },
    t_aug_pay() {
      return this.sumTotal("aug_to_pay");
    },
    t_sep() {
      return this.sumTotal("sep");
    },
    t_sep_pay() {
      return this.sumTotal("sep_to_pay");
    },
    t_oct() {
      return this.sumTotal("oct");
    },
    t_oct_pay() {
      return this.sumTotal("oct_to_pay");
    },
    t_nov() {
      return this.sumTotal("nov");
    },
    t_nov_pay() {
      return this.sumTotal("nov_to_pay");
    },
    t_dec() {
      return this.sumTotal("dec");
    },
    t_dec_pay() {
      return this.sumTotal("dec_to_pay");
    },
  },
  methods: {
    //Sum Totals
    sumTotal(month) {
      if (this.isDepartment) {
        let totalMonth = 0;
        for (let i = 0; i < this.commissions.length; i++) {
          this.commissions[i].commissions.forEach((element) => {
            totalMonth += element[month];
          });
        }
        totalMonth = parseFloat(totalMonth).toFixed(2);
        return totalMonth;
      }

      if (this.commissions && !this.isDepartment) {
        let totalMonth = this.commissions.reduce((total, commission) => {
          return total + Number(commission[month]);
        }, 0);
        totalMonth = parseFloat(totalMonth).toFixed(2);
        return totalMonth;
      } else {
        return 0;
      }
    },
    //Current Month
    getCurrentMonth() {
      let currentMonth = moment().format("MM");
      const firstPart = ["01", "02", "03", "04", "05", "06"];
      if (firstPart.includes(currentMonth)) {
        this.$store.commit("commissions-store/SET_HALF_YEAR_COMMISSIONS", true);
      } else {
        this.$store.commit(
          "commissions-store/SET_HALF_YEAR_COMMISSIONS",
          false
        );
      }
    },

    //Get Commissions
    async searchCommissions(reload) {
      if (reload) this.commissions = null;
      this.module_id = this.convertModuleToProgramString(this.tab);

      //Only when user is diferrent from CEO or SUPERVISOR or Coordinator
      if (
        !(
          this.isSupervisor ||
          this.isCeo ||
          this.isManagement ||
          this.isCoordinator
        )
      ) {
        this.user_id = this.currentUser.user_id;
      }

      //Just for CRM Supervisor
      if (this.isSupervisorCrm) this.supervisorCrm = 1;

      const params = {
        user: this.user_id,
        year: this.year,
        module: this.module_id,
        supervisorCrm: this.supervisorCrm,
        subProgram: this.isSupervisorCrm ? this.moduleProgram : null,
      };
      let response =
        this.isDepartment && !this.isSupervisorCrm
          ? await commissionsService.searchCommissionsDepartments(params)
          : await commissionsService.searchCommissions(params);
      this.commissions = response;
      this.filterCommissionsCoordinator();
      this.departmentCommissions();
    },
    filterCommissionsCoordinator() {
      //Dont Show commissions of Supervisor
      if (this.isCoordinator) {
        this.commissions = this.commissions.filter((commission) => {
          return commission.role_id != 2;
        });
      }
    },
    departmentCommissions() {
      if (this.isDepartment) {
        this.commissions.forEach((element) => {
          element.commissions = JSON.parse(element.commissions);
        });
      }
    },
    async getDepartmentPercentage() {
      if (this.isCrm) {
        const params = {
          year: this.year,
        };
        let response = await commissionsService.getDepartmentPercentage(params);

        this.percentages = response[0];
      }
    },

    //Update Percentage
    async updatePercentageDepartment() {
      this.addPreloader();
      const params = {
        type: 1, //Update all department
        percent: this.percentApartment,
        modul: this.module_id,
        id_user: this.currentUser.user_id,
      };
      await commissionsService.updatePercentage(params);
      await this.searchCommissions();
      this.removePreloader();
      this.showSuccessSwal(
        "Percentage updated",
        "The percentage to pay of the department was updated",
        "success"
      );
    },
    editPercentageUser(index, edit) {
      this.commissions[index][edit] = 1;
    },
    cancelPercentageUser(index, edit) {
      this.commissions[index][edit] = 0;
    },
    async updatePercentageUser(
      valuePercentage,
      index,
      edit,
      percentage_pay,
      to_pay,
      month,
      item
    ) {
      this.addPreloader();
      const params = {
        type: 2, //Update specific user
        percent: valuePercentage,
        modul: this.module_id,
        year: this.year,
        month: month,
        seller: item.user_id,
      };

      let response = await commissionsService.updatePercentage(params);
      this.commissions[index][to_pay] = response[0].to_pay;
      this.commissions[index][percentage_pay] = valuePercentage;
      this.commissions[index][edit] = 0;
      this.removePreloader();
      this.showSuccessSwal(
        "Percentage updated",
        "",
        "success",
        `The percentage to pay of <b> ${item.user_name}</b> was updated`
      );
    },

    findCommissions(event, month_t, item, monthName) {
      this.infoDetails = {
        user: item.user_id,
        month: month_t,
        user_name: item.user_name,
        //For CRM
        role_id: this.isDepartment
          ? item.commissions.length == 1
            ? item.commissions[0].role_id
            : item.commissions[0].module_id == 2 && event.type == "crm"
            ? item.commissions[0].role_id
            : item.commissions[1].role_id
          : item.role_id,
        //for Adm and Departments
        role: this.isDepartment
          ? item.commissions.length == 1
            ? item.commissions[0].role_id
            : item.commissions[0].module_id == 2 && event.type == "crm"
            ? item.commissions[0].role_id
            : item.commissions[1].role_id
          : item.role_id,
        module: this.isDepartment
          ? event.type == "crm"
            ? 2
            : this.module_id
          : item.module_id,
        module_name: this.isDepartment
          ? event.type == "crm"
            ? "CRM"
            : item.main_module_name
          : item.module,
        amountTotal: event.amountTotal,
        year: this.year,
        monthName: monthName,
        type: "details",
        moduleSession: this.module,
      };
      this.modalDetails = true;
    },
    hideModalDetails() {
      this.modalDetails = false;
    },
    payCommissions(
      event,
      month_t,
      item,
      state_t,
      amount_to_pay,
      amount,
      ps_month,
      monthName
    ) {
      this.infoPayment = {
        month: month_t,
        ps_month: ps_month,
        user_name: item.user_name,
        user_id: item.user_id,
        amountToPay: amount_to_pay,
        amount: this.isDepartment ? event.total : amount,
        approve_by: this.currentUser.user_id,
        paid_state: this.isDepartment ? event.ps : state_t,
        module: item.module_id,
        monthName: monthName,
        tab: this.tab,
        type: "payment",
        year: this.year,
      };

      this.modalPayment = true;
    },
    hideModalPayment(status, payment, user_id, ps_month) {
      if (status) {
        this.changeStatusPayment(payment, user_id, ps_month);
        //close preloader
        this.removePreloader();
      }
      this.modalPayment = false;
    },

    changeStatusPayment(status, user_id, ps_month) {
      if (this.isDepartment) {
        this.commissions.forEach((element) => {
          if (element.user_id == user_id) {
            element.commissions.forEach((item) => {
              item[ps_month] = status;
            });
          }
        });
      } else {
        this.commissions.forEach((element) => {
          if (element.user_id == user_id) {
            element[ps_month] = status;
          }
        });
      }
    },
  },
  watch: {
    moduleProgram(newValue, oldValue) {
      this.searchCommissions(true);
    },
  },
};
</script>

<style scoped>
.margin-t-pay {
  margin-top: 29px;
}

.width-th th {
  min-width: 166px;
}

.fs10 {
  font-size: 10px;
}

.color-gray-m {
  color: #9f9da8;
}

.margin-is-seller {
  margin-left: 27px;
  margin-right: 27px;
}
</style>
