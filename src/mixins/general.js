import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import {useWindowSize} from "@vueuse/core";
import {swalErrorIcon, swalInfoIcon, swalSuccessIcon, swalWarningIcon} from "@/icons/statusIcons";

export default {
    data() {
        return {baseUrl: process.env.VUE_APP_BASE_URL_ASSETS};
    },
    computed: {
        screenWidth() {
            const {width} = useWindowSize();
            return width.value;
        },

        screenHeight() {
            const {height} = useWindowSize();
            return height;
        },

        bgTabsNavs() {
            //getters
            return this.$store.getters["appConfig/skin"] === "dark"
                ? "nav-dark-tabs"
                : "nav-light-tabs";
        },
        textLink() {
            return this.$store.getters["appConfig/skin"] === "dark"
                ? "text-warning font-weight-bolder"
                : "text-primary font-weight-bolder";
        },
        bgLightDark() {
            return this.$store.getters["appConfig/skin"] === "dark"
                ? "bg-dark text-white"
                : "bg-white";
        },
        isDarkSkin() {
            return this.$store.getters["appConfig/skin"] === "dark";
        },
        isLightSkin() {
            return this.$store.getters["appConfig/skin"] === "light";
        },
        isBigWindow() {
            return this.$store.getters["app/bigWindow"];
        },

        isSupervisor() {
            return this.$store.getters["auth/isSupervisor"];
        },
        isCeo() {
            return this.$store.getters["auth/isCeo"];
        },
        isCoordinator() {
            return this.$store.getters["auth/isCoordinator"];
        },
        isTeamLeader() {
            return this.$store.getters["auth/isTeamLeader"];
        },
    },
    methods: {
        convertProgramToModule(program) {
            let module = 0;
            switch (program) {
                case 0:
                    module = 0;
                case 1:
                    module = 3;
                    break;
                case 2:
                    module = 7;
                    break;
                case 3:
                    module = 6;
                    break;
                case 4:
                    module = 5;
                    break;
                case 5:
                    module = 8;
                    break;
                case 6:
                    module = 10;
                    break;
                case 7:
                    module = 11;
                    break;
                case 8:
                    module = 14;
                    break;
                case 9:
                    module = 12;
                    break;
                case 15:
                    module = 15;
                    break;
                case null:
                    module = null;
            }

            return module;
        },
        convertModuleToProgramString(program) {
            let module = 0;
            if (program == 0) {
                module = 0;
            } else {
                // eslint-disable-next-line default-case
                switch (program) {
                    case "1":
                        module = 3;
                        break;
                    case "2":
                        module = 7;
                        break;
                    case "3":
                        module = 6;
                        break;
                    case "4":
                        module = 5;
                        break;
                    case "5":
                        module = 8;
                        break;
                    case "6":
                        module = 10;
                        break;
                    case "7":
                        module = 11;
                        break;
                    case "8":
                        module = 14;
                        break;
                    case "9":
                        module = 12;
                        break;
                    case "sn":
                        module = 15;
                        break;
                    case "crm":
                        module = 2;
                        break;
                    case "adm":
                        module = 4;
                        break;
                    case "supervisorCrm":
                        module = 2;
                        break;
                }
            }
            return module;
        },
        getModuleName(module) {
            switch (module) {
                case 2:
                    return "crm";
                case 3:
                    return "bussiness";
                case 4:
                    return "administration";
                case 5:
                    return "debtsolution";
                case 6:
                    return "creditexperts";
                case 7:
                    return "boostcredit";
                case 8:
                    return "taxresearch";
                case 10:
                    return "claimdepartment";
                case 11:
                    return "specialists";
                case 12:
                    return "ti";
                case 14:
                    return "bookeeping";
                case 15:
                    return "socialnetwork";
                case 18:
                    return "quality";
            }
        },
        /* GENERIC TOAST */
        showGenericToast({
                             variant = "success",
                             position = "top-right",
                             title = "Congratulations",
                             icon = "CheckIcon",
                             text = "You've successfully done it!",
                         }) {
            this.$toast(
                {
                    component: ToastificationContent,
                    props: {
                        title,
                        icon,
                        text,
                        variant,
                    },
                },
                {
                    position,
                }
            );
        },

        /* TOAST */
        showToast(
            variant = "success",
            position = "top-right",
            title = "Congratulations",
            icon = "CheckIcon",
            text = "You've successfully done it!"
        ) {
            this.$toast(
                {
                    component: ToastificationContent,
                    props: {
                        title,
                        icon,
                        text,
                        variant,
                    },
                },
                {
                    position,
                }
            );
        },

        /** *** SWALS **** */
        showGenericConfirmSwal({
          title = "Are you sure?",
          text = "You won't be able to revert this!",
          config = {}
        }) {
          return this.$swal({
            title,
            text,
            imageUrl: swalWarningIcon,
            imageWidth: 70,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: "Yes",
            customClass: {
              confirmButton: "btn btn-primary mr-1",
              cancelButton: "btn btn-outline-danger",
            },
            ...config,
          });
        },

        showConfirmSwal(
            title = "Are you sure?",
            text = "You won't be able to revert this!",
            config = {}
        ) {
            return this.$swal({
                title,
                text,
                imageUrl: swalWarningIcon,
                imageWidth: 70,
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes",
                customClass: {
                    confirmButton: "btn btn-primary mr-1",
                    cancelButton: "btn btn-outline-danger  ",
                },
                ...config,
            });
        },

        showSuccessSwal(
            title = "Success!",
            text = "Successful Process",
            html = ""
        ) {
            return this.$swal({
                title,
                text,
                imageUrl: swalSuccessIcon,
                imageWidth: 70,
                html,
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "btn btn-primary",
                },
                buttonsStyling: false,
            });
        },
        showInfoSwal(text = "Important Information", title = "Very Important!") {
            this.$swal({
                title,
                text,
                imageUrl: swalInfoIcon,
                imageWidth: 70,
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "btn btn-primary",
                },
                buttonsStyling: false,
            });
        },
        showWarningSwal(title = "Very Important!", text = "Important Information") {
            this.$swal({
                title,
                text,
                imageUrl: swalWarningIcon,
                imageWidth: 70,
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "btn btn-primary",
                },
                buttonsStyling: false,
            });
        },
        showErrorSwal(
            error,
            title = "Sorry, there was an error... try again or contact support !!!"
        ) {
            this.$swal({
                html: `<h4><b>${title}</b></h4> <br/> <span class="font-small-3 text-danger">${error}</span>`,
                imageUrl: swalErrorIcon,
                imageWidth: 70,
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
        },

        isResponseSuccess(response) {
            return (
                response &&
                response.status &&
                String(response.status).substr(0, 2) === "20"
            );
        },

        getAuthorizeErrors(errors) {
            const errorsAuthorize = [];
            for (const key in errors) {
                errorsAuthorize.push(errors[key].errorText);
            }
            return `${errorsAuthorize.join("<br>")}`;
        },
        getInternalErrors(error, split = "\n") {
            try {
                if (error.response && error.response.data) {
                    const message =
                        error.response.data.message || "Something went wrong.";
                    const errors = [];
                    for (const key in error.response.data.errors) {
                        errors.push(error.response.data.errors[key]);
                    }
                    return `${message + split}${errors.join(`.${split}`)}`;
                }
                return "Something went wrong";
            } catch (error) {
                console.log("Something went wrong getInternalErrors:", error);
                return "Something went wrong";
            }
        },
        toggleModal(tagId, state = true) {
            if (tagId && state) this.$bvModal.show(tagId);
            if (tagId && !state) this.$bvModal.hide(tagId);
        },
        getCurrentMonth() {
            return this.$moment().format("MMM");
        },
        addPreloader() {
            this.$store.commit("app/SET_LOADING", true);
        },
        removePreloader() {
            this.$store.commit("app/SET_LOADING", false);
        },
        range(start, end) {
            const arr = [];
            for (let i = start; i <= end; i += 1) {
                arr.push(i);
            }
            return arr;
        },
        isPreloading(state = true) {
            this.$store.commit("app/SET_LOADING", state);
        },
        returnThis() {
            return this;
        },
        //Add Padding To   td en small tables
        addPaddingTd() {
            this.fields.map((field) => {
                field.tdClass = "py-1";
            });
        },

        //Export to Excel General
        async forceFileDownload(response, nameExcel) {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", nameExcel);
            document.body.appendChild(link);
            link.click();
        },
        $evaluate: (param) => eval("this." + param),
    },
};
