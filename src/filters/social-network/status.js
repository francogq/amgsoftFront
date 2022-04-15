import Vue from 'vue'

Vue.filter('variant', function (value) {
    if (value === "Pending") return "light-warning";
    if (value === "Active") return "light-success";
    if (value === "Inactive") return "light-secondary";
    if (value === "Not Contacted") return "light-danger";
    return "light-primary";
});