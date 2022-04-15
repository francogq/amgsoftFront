import Vue from 'vue'

Vue.filter('renderProgramLogo', function (value) {

    let baseImg = process.env.VUE_APP_BASE_URL_FRONT;

    if (value === "Tax Research") return baseImg + "/assets/images/modules-icons/taxresearch.png";
    if (value === "Boost Credit") return baseImg + "/assets/images/modules-icons/bootscredit.png";
    if (value === "Credit Experts") return baseImg + "/assets/images/modules-icons/creditexperts.png";
    if (value === "Business") return baseImg + "/assets/images/modules-icons/business.png";
    return "light-primary";
});

Vue.filter('renderProgramLogobyId', function (value) {

    let baseImg = process.env.VUE_APP_BASE_URL_FRONT;

    if (value === 5) return baseImg + "/assets/images/modules-icons/taxresearch.png";
    if (value === 2) return baseImg + "/assets/images/modules-icons/bootscredit.png";
    if (value === 3) return baseImg + "/assets/images/modules-icons/creditexperts.png";
    if (value === 1) return baseImg + "/assets/images/modules-icons/business.png";
    return "light-primary";
});

Vue.filter('fanPageProgramColor', function (value) {
    if (value === 'Boost Credit') return 'flat-primary';
    if (value === 'Business') return 'flat-success';
    if (value === 'Credit Experts') return 'flat-dark';
    if (value === 'Debt Solution') return 'flat-warning';
    if (value === 'Tax Research') return 'flat-danger';
    return 'secondary';
})
