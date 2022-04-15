import Vue from 'vue'

Vue.filter('extFile', function (value) {

    let baseImg = process.env.VUE_APP_BASE_URL_FRONT;
    let url = baseImg + "/assets/images/extensions/";

    switch (value) {
        case 'pdf':
            url = url + "pdf.png";
            break;
        case 'pptx':
            url = url + "ppt.png";
            break;
        case 'xlsx' || 'csv':
            url = url + "excel.png";
            break;
        case 'docx':
            url = url + "doc.png";
            break;
        case 'png' || 'jpg' || 'jpeg' || 'ico':
            url = url + "img.png";
            break;
        default:
            url = "";
            break;
    }

    return url;

})