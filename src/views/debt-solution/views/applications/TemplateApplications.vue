<template>
<b-container fluid>
    <header-slot></header-slot>

    <b-tabs id="tab" pills lazy>
        <b-tab class="tab" title="IN PROGRESS" active>
            <table-applications :program_id="4" :statusApp="1"/>
        </b-tab>
        <b-tab class="tab" title="COMPLETED" >
            <table-applications :program_id="4" :statusApp="2"/>
        </b-tab>
    </b-tabs>
</b-container>
    
</template>
<script>
import TableApplications from './views/TableAplications.vue'
import {mapActions} from 'vuex'
export default {
    components:{ TableApplications },
    methods:{
        ...mapActions({
            getCountriesAction : 'DebtSolutionApplications/getCountriesAction'
        }),
    },
    created(){
        this.getCountriesAction()
    },
}
</script>
<style>
th{
    text-align: center;
}
td{
    padding-top: 10px !important;
    padding-left: 10px !important;
    padding-bottom: 5px !important;
    padding-right: 0 !important;
}
.tab{
    transform: translateY(-1rem);
}
.container-fluid{
    padding: 0;
}
</style>