import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import getFilesOfRecord from "@salesforce/apex/CommunityFilesHelper.getFilesOfRecord";

const columns = [
    {
        label: "Title",
        fieldName: "DownloadUrl",
        type: "url",
        typeAttributes: {
            label: {
                fieldName: "Title"
            },
            name: "Download",
            target: "_blank"
        },
        sortable: true,
        hideDefaultActions: true
    },
    {
        label: "File Type",
        fieldName: "FileType",
        hideDefaultActions: true
    },
    {
        label: "Size",
        fieldName: "ContentSize",
        hideDefaultActions: true
    },
    {
        label: "Last Modified",
        fieldName: "ContentModifiedDate",
        type: "date",
        sortable: true,
        hideDefaultActions: true
    }
];

export default class CommunityFilesRelatedList extends NavigationMixin(LightningElement) {
    @api recordId;
    @api allowUploadingFiles;
    files = [];
    columns = columns;
    defaultSortDirection = "desc";
    sortDirection = "desc";
    sortedBy = "ContentModifiedDate";

    connectedCallback() {
        this.retrieveFiles();
    }

    retrieveFiles() {
        getFilesOfRecord({ recordId: this.recordId })
            .then((files) => {
                let baseUrl = "https://" + location.host;
                this.files = files.map((file) => ({
                    ...file,
                    ContentSize: this.formatBytes(file.ContentSize),
                    DownloadUrl: baseUrl + "/sfc/servlet.shepherd/document/download/" + file.Id
                }));
            })
            .catch((error) => {
                this.displayToast("Error", this.getWireError(error), "error");
            });
    }

    get getTitle() {
        return "Files (" + this.files.length + ")";
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.files];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
        this.files = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);

            if (typeof a === "string") {
                a = a.toLowerCase();
                b = b.toLowerCase();
            }

            return reverse * ((a > b) - (b > a));
        };
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case "Download":
                this.downloadFile(row);
                break;
            default:
        }
    }

    downloadFile(row) {
        this[NavigationMixin](
            {
                type: "standard_webPage",
                attributes: {
                    url: row.DownloadUrl
                }
            },
            false
        );
    }
    116;

    get filesArePresent() {
        return this.files?.length > 0;
    }

    getWireError(error) {
        let message = "Unknown error";
        if (Array.isArray(error.body)) {
            message = error.body.map((e) => e.message).join(", ");
        } else if (typeof error.body.message === "string") {
            message = error.body.message;
        }
        return message;
    }

    displayToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }

    formatBytes(bytes, decimals = 1) {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    handleUploadFinished() {
        this.retrieveFiles();
    }
}
