
var GetUrlDate = function() {
    var parts = document.location.href.split("/");
    var last_part = parts[parts.length - 1];
    return last_part.indexOf('?') == 0 ? moment(last_part.substring(1)) : moment();
}

function LogEntry() {
    var self = this;

    self.timestamp = ko.observable(moment().format("YYYY/MM/DD hh:mm a"));
    self.meal = ko.observable();
    self.description = ko.observable();
    self.hungerScale = ko.observable();
    self.location = ko.observable();
    self.comments = ko.observable();
    self.image = ko.observable();
    self.logEntryId = ko.observable();

    self.descriptionPlaceholder = ko.computed(function () {
        if (self.meal() == 5) return "Description";
        if (self.meal() == 8) return "Notes";
        return "Food & Beverages";
    });

    self.descriptionFormatted = ko.computed(function () {
        return self.description() == undefined ? undefined : self.description().replace(new RegExp("\n", 'g'), "<br>");
    });

    self.ImageSource = function () {
        return self.image() == undefined ? "/Images/NoImagePlaceholder.jpg" : "data:image/png;base64," + self.image();
    }

    self.ImageMarkup = function () {
        return self.image() == undefined ? undefined : "data:image/png;base64," + self.image();
    }

    self.ImagePreview = function () {
        if (self.image() == undefined) return;
        bootbox.dialog({
            title: "Entry Image Preview",
            message: $.validator.format('<div style="overflow: auto"><img src="{0}"></img></div>', self.ImageSource()),
            buttons: {
                main: {
                    label: "Close",
                    className: "btn-primary"
                }
            }
        });
        $(".modal-dialog").width($(window).width() - 50);
    }

    self.DisplayMeal = ko.computed(function () {
        switch (self.meal()) {
            case 1:
                return "Breakfast";
            case 2:
                return "Lunch";
            case 3:
                return "Dinner";
            case 4:
                return "Snack";
            case 5:
                return "Elimination";
            case 6:
                return "Awake";
            case 7:
                return "Asleep";
            case 8:
                return "Note";
            default:
                return "N/A";
        }
    });

    self.Column1Text = ko.computed(function () {
        return $.validator.format("<strong>{0}</strong><br>TIME: <u>{1}</u>", self.DisplayMeal().toUpperCase(), moment(self.timestamp()).format("h:mm a"));
    });

    self.Column4Text = ko.computed(function () {
        return $.validator.format("<u><strong>LOCATION: </strong><span>{0}</span></u><br><span>{1}</span>", self.location() || "", self.comments() || "");
    });

    self.EliminationEntry = ko.computed(function () {
        return $.validator.format('TIME {0}<br>{1}', moment(self.timestamp()).format("h:mmA"), self.descriptionFormatted());
    });

    self.Copy = function () {
        var obj = new LogEntry();
        var value = ko.mapping.toJS(self);

        obj.timestamp(moment(value.timestamp).format("YYYY/MM/DD hh:mm a"));
        obj.meal(value.meal);
        obj.description(value.description);
        obj.hungerScale(value.hungerScale);
        obj.location(value.location);
        obj.comments(value.comments);
        obj.image(value.image);
        obj.logEntryId(value.logEntryId);
        return obj;
    }
    
    self.Load = function (value) {
        self.timestamp(value.Timestamp);
        self.meal(value.Meal);
        self.description(value.Description);
        self.hungerScale(value.HungerScale);
        self.location(value.Location);
        self.comments(value.Comments);
        self.image(value.Image);
        self.logEntryId(value.LogEntryId);
        return self;
    }
}

function HomePage() {
    var self = this;

    self.LogEntries = ko.observableArray([]);

    self.JournalHeading = ko.computed(function () {
        return $.validator.format("Journal Entry for {0}", GetUrlDate().format("dddd, MMM Do YYYY"));
    });

    self.EliminationEntries = ko.computed(function () {
        return $.grep(self.LogEntries(), function (value, i) {
            return value.meal() == 5;
        });
    });

    self.AwakeEntries = ko.computed(function () {
        return $.grep(self.LogEntries(), function (value, i) {
            return value.meal() == 6;
        });
    });

    self.EliminationBorderStyling = function (index) {
        return index == 0 ? "0px solid green" : "1px solid #dddddd";
    }

    self.DeleteEntry = function (logEntry) {
        if (logEntry == undefined || logEntry == null) return;

        bootbox.confirm({
            message: "Are you sure you want to REMOVE this log entry?  This action cannot be undone.",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-danger'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-primary'
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: "DELETE",
                        url: "api/LogEntries",
                        xhrFields: {
                            withCredentials: true
                        },
                        data: ko.mapping.toJSON(logEntry),
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            var entry = new LogEntry().Load(JSON.parse(data));
                            var index = self.FindLogEntryIndex(entry);
                            if (index < 0) return;
                            self.LogEntries.splice(index, 1);
                        },
                        error: function (error) {
                            return false;
                        }
                    });
                }
            }
        });
    }

    self.CreateEntry = function (value) {
        var isNew = value == undefined;
        var logEntry = undefined;
        if (value == undefined) {
            logEntry = new LogEntry();
        }
        else {
            logEntry = value.Copy();
        }
        var messageTemplate = $("#dialog-log-entry-template").html();
        bootbox.dialog({
            closeButton: false,
            title: "Log Entry",
            message: messageTemplate,
            buttons: {
                success: {
                    label: isNew ? "Create" : "Save",
                    className: "btn-success",
                    callback: function () {
                        $.ajax({
                            type: isNew ? "POST" : "PUT",
                            url: "api/LogEntries",
                            xhrFields: {
                                withCredentials: true
                            },
                            data: ko.mapping.toJSON(logEntry),
                            async: false,
                            contentType: "application/json; charset=utf-8",
                            success: function (data) {
                                var newEntry = new LogEntry().Load(JSON.parse(data));
                                if (moment(newEntry.timestamp()).format("YYYY-MM-DD") == moment(GetUrlDate()).format("YYYY-MM-DD")) {
                                    if (isNew) {
                                        self.LogEntries.push(newEntry);
                                    }
                                    else {
                                        var index = self.FindLogEntryIndex(newEntry);
                                        if (index < 0) return;
                                        self.LogEntries.splice(index, 1, newEntry);
                                    }
                                }
                            },
                            error: function (error) {
                                /*$.notify({
                                    // options
                                    message: error.responseText,
                                }, {
                                    // settings
                                    type: 'danger'
                                });*/

                                return false;
                            }
                        });
                    }
                },
                main: {
                    label: "Cancel",
                    className: "btn-primary"
                }
            }
        });
        $(messageTemplate).show();
        $(".modal-body").css("padding-bottom", 0);

        ko.applyBindings(logEntry, document.getElementById("dialog-log-entry"));

        $('.fileupload').fileupload({
            dataType: 'json',
            url: '/Files/UploadFiles',
            autoUpload: true,
            maxFileSize: 5000000, // 5 MB
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
            imageMaxWidth: 800,
            imageMaxHeight: 800,
            imageCrop: true,
            imageOrientation: true,
            acceptFileTypes: '/^image\/(gif|jpeg|png)$/',
            previewSourceFileTypes: '/^image\/(gif|jpeg|png)$/',
            done: function (e, data) {
                logEntry.image(data._response.result.fileInfo.Data);
            }
        }).on('fileuploadprogressall', function (e, data) {
            //var progress = parseInt(data.loaded / data.total * 100, 10);
            //$('.progress .progress-bar').css('width', progress + '%');
        });
    }

    self.MoveNextDay = function () {
        var date = GetUrlDate().add(1, 'days');
        window.location.href = "?" + date.format("YYYY-MM-DD");
    }

    self.MovePreviousDay = function () {
        var date = GetUrlDate().subtract(1, 'days');
        window.location.href = "?" + date.format("YYYY-MM-DD");
    }

    self.MoveToday = function () {
        window.location.href = "/";
    }

    self.FindLogEntryIndex = function (value) {
        for (var i = 0; i < self.LogEntries().length; ++i) {
            if (self.LogEntries()[i].logEntryId() == value.logEntryId()) return i;
        }
        return -1;
    }
        
    self.Load = function () {
        $.ajax({
            type: "GET",
            url: "api/LogEntries/" + GetUrlDate().format("YYYY-MM-DD"),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var items = JSON.parse(data);
                items.forEach(function (item) {
                    self.LogEntries.push(new LogEntry().Load(item));
                });
            },
            error: function (error) {
                /*$.notify({
                    // options
                    message: error.responseText,
                }, {
                    // settings
                    type: 'danger'
                });*/

                return false;
            }
        });
        return self;
    }
}

ko.applyBindings(new HomePage().Load(), document.getElementById("body"));

$('#btnChangeDate').datepicker()
.on('changeDate', function(ev){
    window.location.href = "?" + moment(ev.date).format("YYYY-MM-DD");
});