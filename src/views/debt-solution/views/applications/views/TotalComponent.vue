<template>
    <b-container>
        <center>
        <b-col :cols="5">
            <b-row class="p-1 border border-5 border-dark rounded-pill">
                <b-col :cols="showTotal ? 6 : 12">
                    <h4>Sub total: <h3> $ {{this.subtotal}}</h3> </h4>
                </b-col>
                <b-col v-if="showTotal" :cols="6"><h4> Total:<h3> $ {{this.total}}</h3> </h4></b-col>
            </b-row>
        </b-col>
        </center>
    </b-container>
</template>
<script>

export default {
    props:{
            showTotal:{type:Boolean,required:true},
            total:{type:Number,default:0.00},
            subtotal:{type:Number,default:0.00}
        },
}
</script>
<style scoped>
h3{
    margin:0;
}
</style>