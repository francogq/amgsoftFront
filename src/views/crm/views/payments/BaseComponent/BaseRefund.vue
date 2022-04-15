<template>
    <div class="w-100">
        <!-- Row Client -->
        <div class="col-lg-8 col-12 col-xl-8 col-md-8 p-1">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Client</span>
            </div>
            <slot name="client"></slot>
          </div>
        </div>
        <!-- Row Transaction ID -->
        <div class="col-lg-8 col-12 col-xl-8 col-md-8 pb-1">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon2">Transaction ID</span>
            </div>
            <slot name="transaction"></slot>
          </div>
        </div>
        <!-- Row Amount -->
        <div class="col-lg-8 col-12 col-xl-8 col-md-8 pb-1">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon3">Amount</span>
            </div>
            <slot name="amount"></slot>
          </div>
        </div>
        <!-- Row Date -->
        <div class="col-lg-8 col-12 col-xl-8 col-md-8 pb-1">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon4">Date</span>
            </div>
            <slot name="date"></slot>
          </div>
        </div>
    </div>
</template>


<style scoped>
.input-group > .input-group-prepend {
  flex: 0 0 40%;
}
.input-group .input-group-text {
  width: 100%;
}
</style>